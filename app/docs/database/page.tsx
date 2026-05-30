import {
  DocPageHeader, DocSection, DocSubSection, CodeBlock,
  InfoCard, FeatureCard, DocNavigation, Breadcrumb, PropTable,
} from '@/components/docs/doc-components';

export default function DatabasePage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Docs', href: '/docs' }, { label: 'Database & Models' }]} />
      <DocPageHeader
        badge="Database"
        title="Database & Models"
        description="Arogya AI uses three storage layers: SQLite (via SQLAlchemy) for persistent data, Redis for session memory, and FAISS for vector similarity search."
      />

      <DocSection title="Storage Architecture">
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: '🗄️', title: 'SQLite + SQLAlchemy', description: '9 tables for users, health records, conversations, messages, dialogue state, and medical memory. Persistent across restarts.' },
            { icon: '⚡', title: 'Redis', description: 'Short-term session memory: recent messages (20 per user), dialogue state JSON, and session context. Falls back to in-memory dict.' },
            { icon: '🔍', title: 'FAISS + Mem0', description: 'FAISS for local vector search over conversation history. Mem0 for cloud-based long-term cross-session memory.' },
          ].map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
          ))}
        </div>
      </DocSection>

      {/* ── SQLITE MODELS ── */}
      <DocSection title="SQLite Models (SQLAlchemy ORM)">

        <DocSubSection title="User">
          <p className="text-gray-600 text-sm mb-3">Primary user identity table. Phone number is the unique key used throughout the system.</p>
          <PropTable rows={[
            { name: 'id', type: 'Integer PK', required: true, description: 'Auto-increment primary key.' },
            { name: 'phone_number', type: 'String(20) UNIQUE', required: true, description: 'E.164 phone number — the primary identifier across all tables.' },
            { name: 'name', type: 'String(100)', required: true, description: 'User\'s full name.' },
            { name: 'age', type: 'Integer', required: true, description: 'User\'s age.' },
            { name: 'gender', type: 'String(10)', required: true, description: 'male | female | other' },
            { name: 'pincode', type: 'String(10)', required: true, description: '6-digit Indian pincode for outbreak tracking.' },
            { name: 'location_area', type: 'String(100)', required: false, description: 'Resolved from pincode via India Post API (e.g. "Bhubaneswar, Khordha, Odisha").' },
            { name: 'language', type: 'String(10)', required: false, description: 'Preferred language code. Default: "en".' },
            { name: 'registered_at', type: 'DateTime', required: false, description: 'Registration timestamp (UTC).' },
            { name: 'last_active', type: 'DateTime', required: false, description: 'Updated on every message via update_last_active().' },
          ]} />
        </DocSubSection>

        <DocSubSection title="HealthRecord">
          <p className="text-gray-600 text-sm mb-3">Stores meaningful health consultations. Only saved when confidence ≥ 0.5 and disease is not "unknown".</p>
          <PropTable rows={[
            { name: 'id', type: 'Integer PK', required: true, description: 'Auto-increment primary key.' },
            { name: 'user_id', type: 'Integer FK → users.id', required: true, description: 'Foreign key to the user.' },
            { name: 'symptoms', type: 'Text', required: true, description: 'Raw symptom description from the user.' },
            { name: 'possible_disease', type: 'String(200)', required: false, description: 'AI-predicted disease name.' },
            { name: 'advice', type: 'Text', required: false, description: 'Medical advice given.' },
            { name: 'severity', type: 'String(20)', required: false, description: 'mild | moderate | severe | emergency' },
            { name: 'confidence', type: 'Float', required: false, description: 'AI confidence score (0.0–1.0). Records below 0.5 are not saved.' },
            { name: 'emergency', type: 'Boolean', required: false, description: 'True if the AI flagged this as an emergency.' },
            { name: 'language_used', type: 'String(10)', required: false, description: 'Language of the conversation.' },
            { name: 'timestamp', type: 'DateTime', required: false, description: 'Record creation time (UTC).' },
          ]} />
        </DocSubSection>

        <DocSubSection title="Conversation & Message">
          <p className="text-gray-600 text-sm mb-3">Conversation groups messages into sessions. Messages store the full chat history.</p>
          <CodeBlock title="database/models.py" language="python" code={`class Conversation(Base):
    __tablename__ = "conversations"
    id         = Column(Integer, primary_key=True)
    user_id    = Column(Integer, ForeignKey("users.id"))
    title      = Column(String(200), default="New Conversation")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    messages   = relationship("Message", back_populates="conversation", cascade="all, delete")

class Message(Base):
    __tablename__ = "messages"
    id              = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    role            = Column(String(20))   # "user" | "assistant"
    content         = Column(Text)
    timestamp       = Column(DateTime, default=datetime.utcnow)`} />
        </DocSubSection>

        <DocSubSection title="DialogueState">
          <p className="text-gray-600 text-sm mb-3">
            Persists the full dialogue frame per conversation. One row per conversation, updated on every turn.
            Also cached in Redis and in-memory for fast access.
          </p>
          <PropTable rows={[
            { name: 'conversation_id', type: 'Integer FK UNIQUE', required: true, description: 'One dialogue state per conversation.' },
            { name: 'phone_number', type: 'String(20) FK', required: true, description: 'User phone number for direct lookup.' },
            { name: 'active_topic', type: 'Text', required: false, description: 'Current health topic being discussed.' },
            { name: 'task', type: 'String(50)', required: false, description: 'symptom_assessment | education | general' },
            { name: 'stage', type: 'String(50)', required: false, description: 'detail_collection | assessment | resolved' },
            { name: 'state', type: 'String(50)', required: false, description: 'NEW_TOPIC | CONTINUING_TOPIC | TOPIC_RESOLVED | TOPIC_CHANGED' },
            { name: 'slots', type: 'Text (JSON)', required: false, description: 'Filled slot values: {symptom, duration, severity, location, ...}' },
            { name: 'pending_question', type: 'Text (JSON)', required: false, description: 'The last question asked: {id, slot, question}' },
            { name: 'pending_slots', type: 'Text (JSON)', required: false, description: 'List of slots still to be filled.' },
            { name: 'next_action', type: 'String(50)', required: false, description: 'continue_assessment | provide_advice | refer_doctor' },
          ]} />
        </DocSubSection>

        <DocSubSection title="OutbreakLog">
          <p className="text-gray-600 text-sm mb-3">Tracks disease case counts per pincode for outbreak detection.</p>
          <PropTable rows={[
            { name: 'pincode', type: 'String(10)', required: true, description: '6-digit Indian pincode.' },
            { name: 'disease', type: 'String(200)', required: true, description: 'Disease name as detected by the AI.' },
            { name: 'case_count', type: 'Integer', required: false, description: 'Number of cases reported. Incremented on each new report.' },
            { name: 'alert_sent', type: 'Boolean', required: false, description: 'True once an outbreak alert has been sent.' },
            { name: 'reported_at', type: 'DateTime', required: false, description: 'First case timestamp.' },
            { name: 'last_updated', type: 'DateTime', required: false, description: 'Most recent case timestamp.' },
          ]} />
          <InfoCard type="warning" title="Outbreak Threshold">
            An outbreak is triggered when <strong>5 or more cases</strong> of the same disease are reported in the
            same pincode within <strong>7 days</strong>. Configurable via <code className="font-mono text-xs bg-amber-100 px-1 rounded">OUTBREAK_THRESHOLD</code> and
            <code className="font-mono text-xs bg-amber-100 px-1 rounded mx-1">OUTBREAK_WINDOW_DAYS</code> in settings.py.
          </InfoCard>
        </DocSubSection>

        <DocSubSection title="RegistrationState">
          <p className="text-gray-600 text-sm mb-3">Tracks step-by-step WhatsApp registration progress. Deleted after registration completes.</p>
          <CodeBlock title="Registration Steps" language="text" code={`waiting_name → waiting_age → waiting_gender → waiting_pincode → complete`} />
          <PropTable rows={[
            { name: 'phone_number', type: 'String(20) UNIQUE', required: true, description: 'One registration state per phone number.' },
            { name: 'current_step', type: 'String(50)', required: false, description: 'Current step in the registration flow.' },
            { name: 'temp_name', type: 'String(100)', required: false, description: 'Collected name (before final save).' },
            { name: 'temp_age', type: 'String(5)', required: false, description: 'Collected age string.' },
            { name: 'temp_gender', type: 'String(10)', required: false, description: 'Collected gender.' },
            { name: 'temp_pincode', type: 'String(10)', required: false, description: 'Collected pincode.' },
          ]} />
        </DocSubSection>

        <DocSubSection title="MedicalMemory & ConversationMemory">
          <CodeBlock title="database/models.py" language="python" code={`class MedicalMemory(Base):
    # Structured medical profile per user
    user_id            = Column(Integer, ForeignKey("users.id"))
    diseases           = Column(Text, default="")   # chronic conditions
    allergies          = Column(Text, default="")
    medications        = Column(Text, default="")
    recurring_symptoms = Column(Text, default="")
    updated_at         = Column(DateTime)

class ConversationMemory(Base):
    # Auto-generated summaries for long conversations
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    summary         = Column(Text)   # LLM-generated summary
    created_at      = Column(DateTime)`} />
        </DocSubSection>
      </DocSection>

      {/* ── REDIS ── */}
      <DocSection title="Redis Session Memory">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">RedisSessionMemory</code> manages three key namespaces per user.
          If Redis is unavailable, it falls back to an in-memory Python dict automatically.
        </p>
        <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Redis Key</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Content</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Max Size</th>
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'session:recent:{phone}', type: 'List', content: 'Last N messages as JSON strings [{role, content}]', max: '20 messages' },
                { key: 'session:state:{phone}', type: 'String', content: 'Dialogue state JSON (slots, pending_question, stage, etc.)', max: 'Unlimited' },
                { key: 'session:context:{phone}', type: 'String', content: 'SessionContextManager serialized state (turn count, slot history)', max: 'Unlimited' },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-4 py-3 font-mono text-teal-700 text-xs">{row.key}</td>
                  <td className="px-4 py-3 text-gray-600">{row.type}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{row.content}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{row.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock title="tools/redis_session_memory.py — Usage" language="python" code={`redis_memory = RedisSessionMemory(redis_url=REDIS_URL)

# Save a message
redis_memory.save_message(phone_number, "user", "I have a fever")

# Get recent messages
history = redis_memory.get_recent_messages(phone_number, limit=10)

# Save/load dialogue state
redis_memory.save_dialogue_state(phone_number, dialogue_state_dict)
state = redis_memory.load_dialogue_state(phone_number)

# Save/load session context
redis_memory.save_session_context(phone_number, context_json)
ctx = redis_memory.load_session_context(phone_number)`} />
      </DocSection>

      {/* ── FAISS ── */}
      <DocSection title="FAISS Vector Store">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          Two separate FAISS indexes are used: one for <strong>medical knowledge</strong> (built from PDFs) and one
          for <strong>conversation memory</strong> (built from past Q&A exchanges).
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h4 className="font-semibold text-gray-900 text-sm mb-2">Medical Knowledge Index</h4>
            <p className="text-xs text-gray-500 mb-2">Built from medical PDFs in <code className="font-mono bg-gray-100 px-1 rounded">rag/documents/</code></p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Model: <code className="font-mono bg-gray-100 px-1 rounded">all-MiniLM-L6-v2</code></li>
              <li>• Index: <code className="font-mono bg-gray-100 px-1 rounded">rag/vector_store/faiss_index.bin</code></li>
              <li>• Chunks: <code className="font-mono bg-gray-100 px-1 rounded">rag/vector_store/chunks.pkl</code></li>
              <li>• Used by: RAGAgent (vaccination_rag tool)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h4 className="font-semibold text-gray-900 text-sm mb-2">Conversation Memory Index</h4>
            <p className="text-xs text-gray-500 mb-2">Built from past user Q&A exchanges at runtime</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Model: <code className="font-mono bg-gray-100 px-1 rounded">all-MiniLM-L6-v2</code></li>
              <li>• Index: <code className="font-mono bg-gray-100 px-1 rounded">memory/medical_memory_index.faiss</code></li>
              <li>• Chunks: <code className="font-mono bg-gray-100 px-1 rounded">memory/medical_chunks.pkl</code></li>
              <li>• Used by: SymptomAgent (vector_context)</li>
            </ul>
          </div>
        </div>
        <CodeBlock title="rag/retriever.py" language="python" code={`from sentence_transformers import SentenceTransformer
import faiss, pickle, numpy as np

embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
index = faiss.read_index("rag/vector_store/faiss_index.bin")

def retrieve_medical_context(query: str, top_k=3):
    query_embedding = embedding_model.encode([query])
    query_embedding = np.array(query_embedding).astype("float32")
    distances, indices = index.search(query_embedding, top_k)
    return [chunks[idx] for idx in indices[0] if idx < len(chunks)]`} />
      </DocSection>

      <DocSection title="Database Initialization">
        <CodeBlock title="Terminal" language="bash" code={`# SQLite tables are auto-created on server startup via:
# database/models.py → init_db() → Base.metadata.create_all(engine)

# To manually initialize:
cd backend
python -c "from database.models import init_db; init_db()"
# → ✅ Database tables created successfully!

# Database file location (default):
# backend/data/health_db.sqlite
# Override with DATABASE_URL env var`} />
      </DocSection>

      <DocNavigation
        prev={{ href: '/docs/api', label: 'API Reference' }}
        next={{ href: '/docs/whatsapp', label: 'WhatsApp Integration' }}
      />
    </div>
  );
}
