import Link from 'next/link';
import {
  DocPageHeader,
  DocSection,
  FeatureCard,
  InfoCard,
  CodeBlock,
  DocNavigation,
  Breadcrumb,
} from '@/components/docs/doc-components';
import {
  CpuChipIcon,
  ServerIcon,
  CircleStackIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  CloudArrowUpIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';

const sections = [
  { href: '/docs/quickstart', icon: CommandLineIcon, label: 'Quick Start', color: 'from-teal-500 to-cyan-500', desc: 'Get the server running locally in minutes.' },
  { href: '/docs/architecture', icon: CpuChipIcon, label: 'Architecture', color: 'from-blue-500 to-cyan-500', desc: 'LangGraph state machine, agent pipeline, and data flow.' },
  { href: '/docs/agents', icon: BeakerIcon, label: 'AI Agents', color: 'from-emerald-500 to-teal-500', desc: '14 specialized agents — planner, symptom, RAG, outbreak, and more.' },
  { href: '/docs/api', icon: ServerIcon, label: 'API Reference', color: 'from-sky-500 to-blue-500', desc: 'All REST endpoints with request/response schemas.' },
  { href: '/docs/database', icon: CircleStackIcon, label: 'Database', color: 'from-cyan-500 to-teal-500', desc: 'SQLite models, Redis session memory, FAISS vector store.' },
  { href: '/docs/whatsapp', icon: ChatBubbleLeftRightIcon, label: 'WhatsApp', color: 'from-green-500 to-emerald-500', desc: 'Twilio webhook, voice transcription, and message flow.' },
  { href: '/docs/auth', icon: ShieldCheckIcon, label: 'Authentication', color: 'from-teal-500 to-emerald-500', desc: 'OTP via Twilio Verify, JWT tokens, and session management.' },
  { href: '/docs/deployment', icon: CloudArrowUpIcon, label: 'Deployment', color: 'from-blue-500 to-sky-500', desc: 'Docker Compose, Nginx, SSL, and EC2 bootstrap.' },
  { href: '/docs/configuration', icon: WrenchScrewdriverIcon, label: 'Configuration', color: 'from-slate-500 to-gray-600', desc: 'All environment variables and tuning parameters.' },
];

export default function DocsOverviewPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Docs', href: '/docs' }, { label: 'Overview' }]} />

      <DocPageHeader
        badge="v1.0.0 — Stable"
        title="Arogya AI Documentation"
        description="Complete technical reference for the Arogya AI platform — a multilingual, AI-powered health assistant for rural India, delivered over WhatsApp and the web."
      />

      {/* Hero stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { value: '14', label: 'AI Agents' },
          { value: '11', label: 'Languages' },
          { value: '6', label: 'API Routes' },
          { value: '9', label: 'DB Tables' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <DocSection title="What is Arogya AI?">
        <p className="text-gray-600 leading-relaxed mb-4">
          Arogya AI is a production-grade, stateful healthcare chatbot built for the Indian population. Users interact
          via <strong>WhatsApp</strong> (primary) or a <strong>Next.js web interface</strong> (fallback). The backend is a
          FastAPI server powered by a <strong>LangGraph multi-agent pipeline</strong> that routes each message through
          specialized AI agents — symptom analysis, disease education, outbreak detection, hospital search, and more.
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          The system supports <strong>11 Indian languages</strong> including Hindi, Bengali, Tamil, Telugu, Odia, and
          Marathi. It automatically detects the user's language, translates internally to English for AI processing,
          and translates the response back — preserving conversational styles like Hinglish and Banglish.
        </p>
        <InfoCard type="success" title="Key Design Principle">
          Every message passes through a deterministic LangGraph state machine. Memory is layered: Redis for
          short-term session context, SQLite for persistent health records, FAISS for semantic vector search, and
          Mem0 for long-term cross-session memory.
        </InfoCard>
      </DocSection>

      <DocSection title="Browse the Docs">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-teal-200 hover:shadow-md transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{s.label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </Link>
          ))}
        </div>
      </DocSection>

      <DocSection title="Tech Stack at a Glance">
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '⚡', title: 'FastAPI + Uvicorn', description: 'Async Python web framework with Gunicorn workers in production.' },
            { icon: '🧠', title: 'LangGraph + LangChain', description: 'Stateful multi-agent orchestration with typed state graphs.' },
            { icon: '🤖', title: 'Groq LLM (Llama 3)', description: 'llama-3.3-70b-versatile for reasoning; llama-3.1-8b-instant for fast tasks.' },
            { icon: '🗄️', title: 'SQLite + SQLAlchemy', description: 'Persistent user profiles, health records, conversations, and dialogue state.' },
            { icon: '⚡', title: 'Redis', description: 'Session memory, dialogue state cache, and session context per user.' },
            { icon: '🔍', title: 'FAISS + SentenceTransformers', description: 'Vector similarity search over medical knowledge chunks.' },
            { icon: '🧬', title: 'Mem0', description: 'Long-term cross-session memory for personalized health context.' },
            { icon: '📱', title: 'Twilio', description: 'WhatsApp messaging, OTP verification via Twilio Verify.' },
            { icon: '🎤', title: 'Faster-Whisper', description: 'On-device voice transcription for WhatsApp audio messages.' },
            { icon: '🐳', title: 'Docker + Nginx', description: 'Containerized deployment with SSL termination on EC2.' },
          ].map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
          ))}
        </div>
      </DocSection>

      <DocSection title="Repository Structure">
        <CodeBlock
          language="text"
          title="ArogyaAI-server/"
          code={`ArogyaAI-server/
├── backend/
│   ├── api/
│   │   ├── main.py              # FastAPI app, CORS, router registration
│   │   ├── routes/              # chat, user, auth, health, conversation
│   │   ├── schemas/             # Pydantic request/response models
│   │   └── auth/                # JWT handler
│   ├── agents/                  # 14 specialized AI agents
│   ├── orchestrator/
│   │   └── langgraph_coordinator.py  # LangGraph state machine
│   ├── database/
│   │   ├── models.py            # SQLAlchemy ORM models
│   │   ├── db_handler.py        # Session factory
│   │   ├── conversation_manager.py
│   │   └── login_manager.py
│   ├── auth/
│   │   ├── otp_service.py
│   │   └── twilio_verify_service.py
│   ├── whatsapp/
│   │   ├── webhook_handler.py   # Twilio webhook entry point
│   │   ├── twilio_handler.py    # Twilio client wrapper
│   │   └── message_parser.py
│   ├── rag/
│   │   ├── retriever.py         # FAISS vector search
│   │   └── build_vector_store.py
│   ├── tools/                   # Tool implementations for agents
│   ├── services/
│   │   ├── maps_service.py      # Hospital/clinic search
│   │   └── voice_service.py     # Whisper transcription
│   ├── data/                    # SQLite DB, keyword lists
│   ├── memory/                  # FAISS index + chunks
│   ├── config/
│   │   ├── settings.py          # All env vars + Groq client
│   │   └── logger.py
│   ├── requirements.txt
│   └── Dockerfile
├── nginx/nginx.conf             # Reverse proxy + SSL
├── docker-compose.yml
├── .env.example
└── scripts/                     # EC2 bootstrap, cert renewal`}
        />
      </DocSection>

      <DocNavigation next={{ href: '/docs/quickstart', label: 'Quick Start' }} />
    </div>
  );
}
