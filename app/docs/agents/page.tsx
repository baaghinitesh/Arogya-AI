import {
  DocPageHeader, DocSection, DocSubSection, CodeBlock,
  InfoCard, DocNavigation, Breadcrumb, PropTable,
} from '@/components/docs/doc-components';

const agents = [
  {
    name: 'LanguageAgent',
    file: 'agents/language_agent.py',
    role: 'Language detection, translation, and style preservation',
    color: 'bg-teal-50 border-teal-200 text-teal-800',
    badge: 'bg-teal-100 text-teal-700',
    description: 'Detects the user\'s language using langdetect + LLM fallback. Translates input to English for internal processing. Translates the final response back to the user\'s language. Handles Hinglish and Banglish style preservation.',
    model: 'llama-3.1-8b-instant (fast)',
    temp: '0.1',
    methods: [
      { name: 'process_input(user_input, preferred_lang)', desc: 'Returns detected_language, english_text, response_style' },
      { name: 'translate_response(text, target_lang, style)', desc: 'Translates English response back to user language, preserving Hinglish/Banglish style' },
    ],
  },
  {
    name: 'PlannerAgent',
    file: 'agents/planner_agent.py',
    role: 'Tool selection and execution planning',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    badge: 'bg-blue-100 text-blue-700',
    description: 'Analyzes the English-translated user input and conversation context to decide which tools to invoke. Returns a JSON plan array. Falls back to symptom_analysis if parsing fails.',
    model: 'llama-3.3-70b-versatile',
    temp: '0.2',
    methods: [
      { name: 'create_plan(original_input, english_input, history, state, long_term_memory)', desc: 'Returns [{tool, reason}, ...] plan array' },
    ],
  },
  {
    name: 'ConversationStateAgent',
    file: 'agents/conversation_state_agent.py',
    role: 'Dialogue state tracking and slot filling',
    color: 'bg-cyan-50 border-cyan-200 text-cyan-800',
    badge: 'bg-cyan-100 text-cyan-700',
    description: 'Maintains the dialogue frame — active topic, task stage, filled slots, pending questions. Determines if the user is answering a previous question or starting a new topic. Persists state to Redis and SQLite.',
    model: 'llama-3.3-70b-versatile',
    temp: '0.2',
    methods: [
      { name: 'update_state(english_text, history, previous_state, last_assistant_message, ...)', desc: 'Returns updated dialogue state dict with slots, pending_question, stage, state' },
    ],
  },
  {
    name: 'SymptomAgent',
    file: 'agents/symptom_agent.py',
    role: 'Core medical symptom analysis',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-700',
    description: 'The primary medical reasoning agent. Analyzes symptoms using the user\'s profile, conversation history, vector memory, and long-term memory. Returns a structured response with possible disease, severity, and emergency flag.',
    model: 'llama-3.3-70b-versatile',
    temp: '0.3',
    methods: [
      { name: 'analyze(symptoms_english, phone_number, user_name, age, gender, conversation_history, medical_context, summary_memory, vector_context, structured_profile, long_term_memory, conversation_state, session_context)', desc: 'Returns {response, possible_disease, severity, see_doctor, emergency}' },
    ],
  },
  {
    name: 'ReasoningAgent',
    file: 'agents/reasoning_agent.py',
    role: 'Response quality evaluation and follow-up detection',
    color: 'bg-sky-50 border-sky-200 text-sky-800',
    badge: 'bg-sky-100 text-sky-700',
    description: 'Evaluates the SymptomAgent\'s response for completeness. Detects uncertainty and suggests a follow-up question if more information is needed. Appends the follow-up to the symptom response.',
    model: 'llama-3.3-70b-versatile',
    temp: '0.2',
    methods: [
      { name: 'analyze_response(user_input, symptom_result)', desc: 'Returns {needs_followup, followup_question, reason}' },
    ],
  },
  {
    name: 'SynthesisAgent',
    file: 'agents/synthesis_agent.py',
    role: 'Multi-agent output synthesis',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    badge: 'bg-indigo-100 text-indigo-700',
    description: 'Combines outputs from all executed agents into a single coherent, empathetic response. Follows a strict 5-part structure: acknowledgement → explanation → bullet guidance → red flags → one follow-up question. Uses session context to avoid repeating questions.',
    model: 'llama-3.3-70b-versatile',
    temp: '0.25',
    methods: [
      { name: 'synthesize(user_query, agent_outputs, session_context)', desc: 'Returns final English response string (80–180 words)' },
    ],
  },
  {
    name: 'EducationAgent',
    file: 'agents/education_agent.py',
    role: 'Disease education and health tips',
    color: 'bg-amber-50 border-amber-200 text-amber-800',
    badge: 'bg-amber-100 text-amber-700',
    description: 'Provides educational content about diseases and health topics. Detects if the user is asking for information vs. reporting symptoms. Also generates daily health tips on demand.',
    model: 'llama-3.3-70b-versatile',
    temp: '0.7',
    methods: [
      { name: 'is_education_request(user_input_english)', desc: 'Returns bool — true if user wants information, not symptom reporting' },
      { name: 'educate(topic, user_name)', desc: 'Returns formatted educational message about the topic' },
      { name: 'daily_tip(user_name)', desc: 'Returns a personalized daily health tip' },
    ],
  },
  {
    name: 'OutbreakAgent',
    file: 'agents/outbreak_agent.py',
    role: 'Disease outbreak detection and alerting',
    color: 'bg-red-50 border-red-200 text-red-800',
    badge: 'bg-red-100 text-red-700',
    description: 'Monitors disease case counts per pincode. Triggers an outbreak alert when 5+ cases of the same disease are reported within 7 days in the same area. Alerts are prepended to the user\'s response.',
    model: 'Rule-based (no LLM)',
    temp: 'N/A',
    methods: [
      { name: 'log_and_check(pincode, disease, location_area, user_lang)', desc: 'Logs a case and returns {is_outbreak, case_count, alert_message}' },
      { name: 'check_area_outbreaks(pincode, user_lang)', desc: 'Returns active outbreak alert string for the pincode, or empty string' },
      { name: 'get_dashboard_summary()', desc: 'Returns all active outbreaks for admin dashboard' },
    ],
  },
  {
    name: 'RAGAgent',
    file: 'agents/rag_agent.py',
    role: 'Medical knowledge retrieval (vaccination, pregnancy)',
    color: 'bg-teal-50 border-teal-200 text-teal-800',
    badge: 'bg-teal-100 text-teal-700',
    description: 'Retrieves relevant chunks from the FAISS vector store built from medical PDFs. Used for vaccination schedules, pregnancy care, and maternal health questions. Combines retrieved context with LLM generation.',
    model: 'llama-3.3-70b-versatile + FAISS',
    temp: '0.3',
    methods: [
      { name: 'answer(query)', desc: 'Retrieves top-3 medical chunks and generates a grounded response' },
    ],
  },
  {
    name: 'MemoryAgent',
    file: 'agents/memory_agent.py',
    role: 'Conversation summarization',
    color: 'bg-slate-50 border-slate-200 text-slate-800',
    badge: 'bg-slate-100 text-slate-700',
    description: 'Auto-summarizes conversations when they reach 20+ messages. Stores summaries in SQLite ConversationMemory table. Summaries are loaded as summary_memory in subsequent sessions.',
    model: 'llama-3.1-8b-instant',
    temp: '0.3',
    methods: [
      { name: 'summarize(conversation_id, messages)', desc: 'Generates and saves a medical conversation summary' },
    ],
  },
  {
    name: 'ProfileMemoryAgent',
    file: 'agents/profile_memory_agent.py',
    role: 'Medical profile extraction',
    color: 'bg-green-50 border-green-200 text-green-800',
    badge: 'bg-green-100 text-green-700',
    description: 'Extracts structured medical facts from conversation exchanges — chronic diseases, allergies, medications, recurring symptoms. Saves to the MedicalMemory SQLite table for future context.',
    model: 'llama-3.1-8b-instant',
    temp: '0.1',
    methods: [
      { name: 'extract_profile(conversation_text)', desc: 'Returns {diseases, allergies, medications, recurring_symptoms}' },
    ],
  },
  {
    name: 'MemorySelectorAgent',
    file: 'agents/memory_selector_agent.py',
    role: 'Vector memory ranking and filtering',
    color: 'bg-cyan-50 border-cyan-200 text-cyan-800',
    badge: 'bg-cyan-100 text-cyan-700',
    description: 'Ranks FAISS vector search results by relevance to the current query. Filters out low-relevance memories. Returns top-k ranked memories for injection into the symptom agent context.',
    model: 'llama-3.1-8b-instant',
    temp: '0.1',
    methods: [
      { name: 'rank_memories(query, memories, top_k)', desc: 'Returns top-k most relevant memory chunks' },
    ],
  },
  {
    name: 'LocationAgent',
    file: 'agents/location_agent.py',
    role: 'Hospital and facility search',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-700',
    description: 'Handles hospital, clinic, pharmacy, and ambulance search requests. Uses the user\'s WhatsApp GPS coordinates (if shared) or pincode for geolocation. Calls the maps service for nearby facilities.',
    model: 'llama-3.3-70b-versatile + Maps API',
    temp: '0.2',
    methods: [
      { name: 'analyze(query, phone_number, user_name, pincode, latitude, longitude, ...)', desc: 'Returns {full_response, facilities, message}' },
    ],
  },
  {
    name: 'HealthDataAgent',
    file: 'agents/health_data_agent.py',
    role: 'Health history retrieval and formatting',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    badge: 'bg-blue-100 text-blue-700',
    description: 'Fetches and formats the user\'s past health records from SQLite. Returns a human-readable summary of previous consultations, diseases, and severity levels.',
    model: 'Rule-based',
    temp: 'N/A',
    methods: [
      { name: 'get_history(phone_number)', desc: 'Returns {formatted_summary, records}' },
    ],
  },
];

export default function AgentsPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Docs', href: '/docs' }, { label: 'AI Agents' }]} />
      <DocPageHeader
        badge="AI Agents"
        title="AI Agents Reference"
        description="Arogya AI uses 14 specialized agents, each with a distinct responsibility. They are orchestrated by the LangGraph coordinator and communicate through the shared ConversationState."
      />

      <DocSection title="Agent Overview">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Agents', value: '14' },
            { label: 'LLM-powered', value: '11' },
            { label: 'Rule-based', value: '3' },
            { label: 'LLM Models', value: '2' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-2xl font-bold text-teal-600">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <InfoCard type="info" title="Two-Model Strategy">
          <strong>llama-3.3-70b-versatile</strong> — used for complex reasoning: symptom analysis, planning, synthesis, education, outbreak alerts.<br />
          <strong>llama-3.1-8b-instant</strong> — used for fast, simple tasks: language detection, memory ranking, profile extraction, summarization.
        </InfoCard>
      </DocSection>

      <DocSection title="Agent Details">
        <div className="space-y-6">
          {agents.map((agent) => (
            <div key={agent.name} className={`rounded-xl border p-5 ${agent.color}`}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-base">{agent.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${agent.badge}`}>
                      {agent.role}
                    </span>
                  </div>
                  <code className="text-xs opacity-60 font-mono">{agent.file}</code>
                </div>
                <div className="text-right text-xs opacity-70">
                  <p><span className="font-semibold">Model:</span> {agent.model}</p>
                  <p><span className="font-semibold">Temp:</span> {agent.temp}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-3 opacity-90">{agent.description}</p>
              <div className="space-y-1.5">
                {agent.methods.map((m) => (
                  <div key={m.name} className="bg-white/60 rounded-lg px-3 py-2">
                    <code className="text-xs font-mono font-semibold block mb-0.5">{m.name}</code>
                    <p className="text-xs opacity-80">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Agent Execution Flow">
        <CodeBlock title="orchestrator/langgraph_coordinator.py — _node_execute_agents" language="python" code={`def _node_execute_agents(self, state):
    agent_outputs = {}

    for step in state["execution_plan"]:
        tool = step.get("tool")

        if tool == "symptom_analysis":
            # Build context from conversation history
            medical_context = build_medical_context(state["conversation_history"])
            # Semantic search in FAISS
            similar_memories = self.vector_memory.search_memory(state["english_text"], k=5)
            # Rank by relevance
            ranked = self.memory_selector_agent.rank_memories(
                state["english_text"], similar_memories, top_k=3
            )
            vector_context = "\\n".join([m["text"] for m in ranked])

            # Run symptom analysis
            symptom_result = self.symptom_agent.analyze(
                symptoms_english=state["english_text"],
                phone_number=state["phone_number"],
                ...
            )
            # Evaluate response quality
            reasoning = self.reasoning_agent.analyze_response(
                state["english_text"], symptom_result
            )
            # Append follow-up if needed
            if reasoning.get("needs_followup"):
                symptom_result["response"] += f"\\n\\n{reasoning['followup_question']}"

            agent_outputs["symptom_analysis"] = symptom_result

        elif tool == "vaccination_rag":
            agent_outputs["medical_knowledge"] = self.rag_agent.answer(state["english_text"])

        elif tool == "disease_education":
            agent_outputs["education"] = self.education_agent.educate(
                state["english_text"], state["user_name"]
            )
        # ... hospital_search, outbreak_check

    state["agent_outputs"] = agent_outputs
    return state`} />
      </DocSection>

      <DocNavigation
        prev={{ href: '/docs/architecture', label: 'System Architecture' }}
        next={{ href: '/docs/api', label: 'API Reference' }}
      />
    </div>
  );
}
