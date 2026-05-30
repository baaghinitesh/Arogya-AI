import {
  DocPageHeader, DocSection, DocSubSection, CodeBlock,
  InfoCard, FeatureCard, DocNavigation, Breadcrumb,
} from '@/components/docs/doc-components';

export default function ArchitecturePage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Docs', href: '/docs' }, { label: 'Architecture' }]} />
      <DocPageHeader
        badge="Architecture"
        title="System Architecture"
        description="How Arogya AI processes every message — from WhatsApp webhook to multilingual AI response — through a deterministic LangGraph state machine."
      />

      <DocSection title="High-Level Overview">
        <p className="text-gray-600 leading-relaxed mb-4">
          Every user message — whether from WhatsApp or the web chat — follows the same pipeline. The entry point
          is either the <strong>Twilio webhook</strong> (WhatsApp) or the <strong>POST /api/chat</strong> REST endpoint
          (web). Both converge on the <code className="font-mono text-xs bg-gray-100 px-1 rounded">LangGraphCoordinator</code>,
          which runs a typed state machine through 12 sequential nodes.
        </p>
        <CodeBlock
          title="Message Flow"
          language="text"
          code={`WhatsApp Message
      │
      ▼
Twilio Webhook  ──►  webhook_handler.py
      │                    │
      │              [Voice audio?]
      │                    │ Yes → Faster-Whisper transcription
      │                    │
      ▼                    ▼
POST /api/chat  ◄──  chat_endpoint()
      │
      ▼
LangGraphCoordinator.handle_message()
      │
      ▼
┌─────────────────────────────────────────────────────┐
│                  LangGraph State Machine             │
│                                                     │
│  input_validation → language_processing             │
│       → init_session_context → load_memory          │
│       → update_dialogue_state → check_special_cmds  │
│       → outbreak_check → create_plan                │
│       → execute_agents → synthesize_response        │
│       → translate_response → save_response          │
└─────────────────────────────────────────────────────┘
      │
      ▼
Final response (in user's language)
      │
      ├──► Twilio → WhatsApp reply
      └──► JSON response → Web UI`}
        />
      </DocSection>

      <DocSection title="LangGraph State Machine">
        <p className="text-gray-600 leading-relaxed mb-5">
          The coordinator uses LangGraph's <code className="font-mono text-xs bg-gray-100 px-1 rounded">StateGraph</code> with
          a typed <code className="font-mono text-xs bg-gray-100 px-1 rounded">ConversationState</code> TypedDict. Each node
          receives the full state, mutates it, and passes it to the next node. One conditional edge handles special commands.
        </p>

        <div className="space-y-3 mb-6">
          {[
            { node: 'input_validation', desc: 'Verifies the user is registered in SQLite. Rejects unregistered numbers with a registration prompt.' },
            { node: 'language_processing', desc: 'Detects language (langdetect + LLM), translates input to English, determines response style (hinglish/banglish/formal). Saves raw message to Redis.' },
            { node: 'init_session_context', desc: 'Loads or creates a SessionContextManager for the user. Tracks turn count, slot history, and pending questions across the session.' },
            { node: 'load_memory', desc: 'Loads recent messages from Redis (20 msgs), conversation summary from SQLite, structured medical profile, and Mem0 long-term memories.' },
            { node: 'update_dialogue_state', desc: 'Runs ConversationStateAgent to update the dialogue frame — active topic, task, stage, slots, pending questions. Persists to Redis + SQLite.' },
            { node: 'check_special_commands', desc: 'Intercepts "my history", "health tip", "daily tip" commands. Bypasses the full agent pipeline for these.' },
            { node: 'outbreak_check', desc: 'On session start, checks if the user\'s pincode has active outbreaks (5+ same disease in 7 days). Prepends alert to response if found.' },
            { node: 'create_plan', desc: 'PlannerAgent analyzes the English input and returns a JSON execution plan — a list of tools to invoke (symptom_analysis, disease_education, etc.).' },
            { node: 'execute_agents', desc: 'Runs each planned tool in sequence. Collects outputs into agent_outputs dict. Falls back to symptom_analysis if plan is empty.' },
            { node: 'synthesize_response', desc: 'SynthesisAgent combines all agent outputs into a single coherent, empathetic response in English using the Groq LLM.' },
            { node: 'translate_response', desc: 'LanguageAgent translates the English response to the user\'s detected language, preserving Hinglish/Banglish style if needed.' },
            { node: 'save_response', desc: 'Saves the assistant message to SQLite and Redis. Stores the exchange in FAISS vector memory. Extracts and saves medical profile updates.' },
          ].map((item) => (
            <div key={item.node} className="flex gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-teal-200 transition-colors">
              <code className="text-xs font-mono text-teal-700 bg-teal-50 px-2 py-1 rounded-lg h-fit shrink-0 border border-teal-100">
                {item.node}
              </code>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <InfoCard type="info" title="Conditional Edge">
          After <code className="font-mono text-xs bg-blue-100 px-1 rounded">check_special_commands</code>, if
          <code className="font-mono text-xs bg-blue-100 px-1 rounded mx-1">is_special_command = True</code>, the graph
          jumps directly to <code className="font-mono text-xs bg-blue-100 px-1 rounded">save_response</code>, skipping
          outbreak check, planning, and agent execution entirely.
        </InfoCard>
      </DocSection>

      <DocSection title="ConversationState TypedDict">
        <p className="text-gray-600 text-sm mb-4">
          The full state object passed between every node. All fields are typed and validated by LangGraph.
        </p>
        <CodeBlock title="orchestrator/langgraph_coordinator.py" language="python" code={`class ConversationState(TypedDict):
    # Identity
    phone_number: str
    conversation_id: int | None
    user_input: str

    # Language
    detected_lang: str        # e.g. "hi", "bn", "en"
    english_text: str         # translated input for AI processing
    response_style: str       # "english" | "hinglish" | "banglish"

    # User profile
    user_name: str
    age: int
    gender: str
    pincode: str
    location_area: str
    pref_lang: str

    # Memory layers
    conversation_history: list   # recent messages from Redis
    summary_memory: str          # SQLite conversation summary
    structured_profile: str      # medical profile (diseases, allergies)
    medical_context: str         # built from conversation history
    vector_context: str          # FAISS semantic search results
    long_term_memory: str        # Mem0 cross-session memories

    # Dialogue state
    dialogue_state: dict         # slots, pending_question, stage, etc.
    last_assistant_message: str
    session_context: dict        # SessionContextManager state

    # Execution
    execution_plan: list         # [{tool, reason}, ...]
    agent_outputs: dict          # {tool_name: result, ...}

    # Response
    response_english: str
    final_response: str
    outbreak_prefix: str

    # Flags
    check_outbreak_on_start: bool
    is_special_command: bool`} />
      </DocSection>

      <DocSection title="Memory Architecture">
        <p className="text-gray-600 text-sm mb-5 leading-relaxed">
          Arogya AI uses four distinct memory layers, each serving a different time horizon and purpose.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {[
            {
              icon: '⚡',
              title: 'Redis — Short-Term Session',
              description: 'Stores the last 20 messages per user, dialogue state JSON, and session context. Falls back to an in-memory dict if Redis is unavailable. TTL managed by session lifecycle.',
            },
            {
              icon: '🗄️',
              title: 'SQLite — Persistent Records',
              description: 'Stores user profiles, health records, conversations, messages, dialogue state, and medical memory permanently. Survives server restarts.',
            },
            {
              icon: '🔍',
              title: 'FAISS — Vector Memory',
              description: 'Semantic search over past conversation exchanges. Each Q&A pair is embedded with all-MiniLM-L6-v2 and stored. Top-3 ranked results are injected as vector_context.',
            },
            {
              icon: '🧬',
              title: 'Mem0 — Long-Term Cross-Session',
              description: 'Cloud-based long-term memory that persists across sessions. Stores extracted medical facts (chronic conditions, allergies, medications) per user.',
            },
          ].map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
          ))}
        </div>
        <InfoCard type="success" title="Memory Priority Order">
          When loading memory, the system checks: <strong>in-memory cache → Redis → SQLite database</strong>.
          This ensures the fastest possible response while maintaining persistence.
        </InfoCard>
      </DocSection>

      <DocSection title="Dialogue State Management">
        <DocSubSection title="State Schema">
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            The <code className="font-mono text-xs bg-gray-100 px-1 rounded">ConversationStateAgent</code> maintains a
            structured dialogue frame that tracks what the AI knows, what it has asked, and what it still needs.
          </p>
          <CodeBlock title="Dialogue State Structure" language="json" code={`{
  "active_topic": "fever",
  "task": "symptom_assessment",
  "stage": "detail_collection",
  "state": "CONTINUING_TOPIC",
  "continue_context": true,
  "is_answer_to_question": true,
  "last_assistant_question": "How long have you had the fever?",
  "pending_question": {
    "id": "q_duration",
    "slot": "duration",
    "question": "How long have you had the fever?"
  },
  "slots": {
    "symptom": "fever",
    "duration": "2 days",
    "severity": null,
    "location": null
  },
  "pending_slots": ["severity", "location"],
  "next_action": "continue_assessment",
  "note": ""
}`} />
        </DocSubSection>

        <DocSubSection title="State Transitions">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { state: 'NEW_TOPIC', color: 'bg-blue-50 text-blue-700 border-blue-200', desc: 'Fresh symptom or question' },
              { state: 'CONTINUING_TOPIC', color: 'bg-teal-50 text-teal-700 border-teal-200', desc: 'Follow-up in same thread' },
              { state: 'TOPIC_RESOLVED', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', desc: 'Assessment complete' },
              { state: 'TOPIC_CHANGED', color: 'bg-amber-50 text-amber-700 border-amber-200', desc: 'User switched subject' },
            ].map((s) => (
              <div key={s.state} className={`rounded-lg border p-3 ${s.color}`}>
                <code className="text-xs font-mono font-bold block mb-1">{s.state}</code>
                <p className="text-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </DocSubSection>
      </DocSection>

      <DocSection title="Tool Routing (Planner)">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          The <code className="font-mono text-xs bg-gray-100 px-1 rounded">PlannerAgent</code> uses the Groq LLM
          (temperature 0.2) to decide which tools to invoke. It returns a JSON plan array.
        </p>
        <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Tool</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Triggered When</th>
              </tr>
            </thead>
            <tbody>
              {[
                { tool: 'symptom_analysis', when: 'User reports symptoms, pain, discomfort, or health complaints' },
                { tool: 'disease_education', when: 'User asks "what is X", "tell me about Y disease", educational queries' },
                { tool: 'outbreak_check', when: 'User asks about diseases in their area, local health concerns' },
                { tool: 'health_history', when: 'User references past records, "my history", repeated symptoms' },
                { tool: 'vaccination_rag', when: 'Vaccination questions, pregnancy care, maternal health, immunization' },
                { tool: 'hospital_search', when: 'Hospital/clinic/pharmacy queries, location + facility requests, emergencies' },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-4 py-3 font-mono text-teal-700 text-xs font-medium">{row.tool}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{row.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocNavigation
        prev={{ href: '/docs/quickstart', label: 'Quick Start' }}
        next={{ href: '/docs/agents', label: 'AI Agents' }}
      />
    </div>
  );
}
