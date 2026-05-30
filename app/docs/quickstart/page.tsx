import {
  DocPageHeader, DocSection, DocSubSection, CodeBlock,
  InfoCard, StepList, DocNavigation, Breadcrumb, PropTable,
} from '@/components/docs/doc-components';

export default function QuickStartPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Docs', href: '/docs' }, { label: 'Quick Start' }]} />
      <DocPageHeader
        badge="Getting Started"
        title="Quick Start"
        description="Get the Arogya AI backend server running locally in under 10 minutes."
      />

      <DocSection title="Prerequisites">
        <PropTable rows={[
          { name: 'Python', type: '3.10+', required: true, description: 'Required for the FastAPI backend.' },
          { name: 'Docker + Docker Compose', type: 'v24+', required: false, description: 'Recommended for production-like local setup with Redis.' },
          { name: 'Redis', type: '7+', required: false, description: 'Used for session memory. Falls back to in-memory dict if unavailable.' },
          { name: 'Groq API Key', type: 'string', required: true, description: 'Free at console.groq.com — powers all LLM calls.' },
          { name: 'Twilio Account', type: 'credentials', required: false, description: 'Required for WhatsApp and OTP. Mock mode available for dev.' },
          { name: 'Mem0 API Key', type: 'string', required: false, description: 'Long-term memory. Optional — system works without it.' },
        ]} />
      </DocSection>

      <DocSection title="Option A — Docker Compose (Recommended)">
        <StepList steps={[
          { title: 'Clone the repository', description: 'Get the server code onto your machine.' },
          { title: 'Copy and fill the .env file', description: 'Set your Groq API key and Twilio credentials.' },
          { title: 'Build and start all services', description: 'Docker Compose starts Redis, the FastAPI backend, and Nginx.' },
          { title: 'Verify the server is running', description: 'Hit the health check endpoint to confirm everything is up.' },
        ]} />

        <CodeBlock title="Terminal" language="bash" code={`# 1. Clone
git clone https://github.com/arogyaai/ArogyaAI-server.git
cd ArogyaAI-server

# 2. Configure environment
cp .env.example .env
# Edit .env with your keys (see Configuration section)

# 3. Start all services
docker compose up --build -d

# 4. Verify
curl http://localhost:8000/
# → {"message": "Rural Health Assistant API Running"}`} />

        <InfoCard type="info" title="Services started by Docker Compose">
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li><strong>backend</strong> — FastAPI on port 8000</li>
            <li><strong>redis</strong> — Redis 7 on port 6379 (internal)</li>
            <li><strong>nginx</strong> — Reverse proxy on ports 80/443</li>
            <li><strong>certbot</strong> — SSL certificate management</li>
          </ul>
        </InfoCard>
      </DocSection>

      <DocSection title="Option B — Local Python (Development)">
        <CodeBlock title="Terminal" language="bash" code={`# 1. Create virtual environment
cd ArogyaAI-server/backend
python -m venv venv
source venv/bin/activate        # Windows: venv\\Scripts\\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set environment variables
cp ../.env.example ../.env
# Edit ../.env with your keys

# 4. Start Redis (if not using Docker)
redis-server &

# 5. Run the FastAPI server
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000`} />

        <InfoCard type="warning" title="Working directory matters">
          Always run uvicorn from inside the <code className="font-mono text-xs bg-amber-100 px-1 rounded">backend/</code> directory.
          The app uses relative paths for the SQLite database and FAISS vector store.
        </InfoCard>
      </DocSection>

      <DocSection title="Build the RAG Vector Store">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          The RAG agent uses a FAISS index built from medical PDF documents. You must build this before the
          <code className="font-mono text-xs bg-gray-100 px-1 rounded mx-1">vaccination_rag</code> tool will work.
        </p>
        <CodeBlock title="Terminal" language="bash" code={`# From backend/ directory
# 1. Place your medical PDFs in:
#    backend/rag/documents/

# 2. Build the vector store
python rag/build_vector_store.py

# Output files created:
#   rag/vector_store/faiss_index.bin
#   rag/vector_store/chunks.pkl`} />
      </DocSection>

      <DocSection title="Send Your First Message">
        <DocSubSection title="Via REST API">
          <CodeBlock title="curl" language="bash" code={`# First register a user
curl -X POST http://localhost:8000/api/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone_number": "+919876543210",
    "name": "Rahul Kumar",
    "age": 28,
    "gender": "male",
    "pincode": "110001",
    "language": "hi"
  }'

# Then send a chat message
curl -X POST http://localhost:8000/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone_number": "+919876543210",
    "message": "मुझे बुखार और सिर दर्द है",
    "history": []
  }'`} />
        </DocSubSection>

        <DocSubSection title="Expected Response">
          <CodeBlock title="Response" language="json" code={`{
  "response": "मैं समझता हूं कि आपको बुखार और सिर दर्द है।\\n\\n• पर्याप्त आराम करें और हाइड्रेटेड रहें\\n• पैरासिटामोल 500mg ले सकते हैं\\n• ठंडे पानी की पट्टी माथे पर रखें\\n\\n⚠️ अगर बुखार 103°F से ज्यादा हो या 3 दिन से अधिक रहे, तो तुरंत डॉक्टर से मिलें।\\n\\nक्या आपको कोई और लक्षण हैं जैसे खांसी या गले में दर्द?"
}`} />
        </DocSubSection>
      </DocSection>

      <DocSection title="Interactive API Docs">
        <p className="text-gray-600 text-sm mb-4">
          FastAPI auto-generates interactive documentation. Once the server is running, visit:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { url: 'http://localhost:8000/docs', label: 'Swagger UI', desc: 'Interactive API explorer with request builder.' },
            { url: 'http://localhost:8000/redoc', label: 'ReDoc', desc: 'Clean, readable API reference documentation.' },
          ].map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-teal-200 hover:shadow-sm transition-all"
            >
              <p className="font-semibold text-teal-700 text-sm mb-1">{item.label}</p>
              <p className="text-xs text-gray-400 font-mono mb-2">{item.url}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </a>
          ))}
        </div>
      </DocSection>

      <DocNavigation
        prev={{ href: '/docs', label: 'Overview' }}
        next={{ href: '/docs/architecture', label: 'System Architecture' }}
      />
    </div>
  );
}
