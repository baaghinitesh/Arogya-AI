import {
  DocPageHeader, DocSection, DocSubSection, CodeBlock,
  InfoCard, DocNavigation, Breadcrumb, PropTable,
} from '@/components/docs/doc-components';

export default function ConfigurationPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Docs', href: '/docs' }, { label: 'Configuration' }]} />
      <DocPageHeader
        badge="Configuration"
        title="Configuration Reference"
        description="All environment variables, LLM tuning parameters, and runtime settings for the Arogya AI backend."
      />

      <InfoCard type="warning" title="Never commit .env to version control">
        The <code className="font-mono text-xs bg-amber-100 px-1 rounded">.env</code> file contains secrets.
        It is listed in <code className="font-mono text-xs bg-amber-100 px-1 rounded">.gitignore</code>.
        Use <code className="font-mono text-xs bg-amber-100 px-1 rounded">.env.example</code> as a template.
      </InfoCard>

      <DocSection title="Environment Variables">
        <DocSubSection title="Required">
          <PropTable rows={[
            { name: 'GROQ_API_KEY', type: 'string', required: true, description: 'Groq API key for LLM calls. Get free at console.groq.com.' },
            { name: 'TWILIO_ACCOUNT_SID', type: 'string', required: true, description: 'Twilio Account SID from console.twilio.com.' },
            { name: 'TWILIO_AUTH_TOKEN', type: 'string', required: true, description: 'Twilio Auth Token. Used for webhook signature validation.' },
            { name: 'TWILIO_WHATSAPP_NUMBER', type: 'string', required: true, description: 'Twilio WhatsApp number in format: whatsapp:+14155238886' },
            { name: 'TWILIO_VERIFY_SERVICE_SID', type: 'string', required: true, description: 'Twilio Verify Service SID for OTP. Format: VAxxxxxxxx' },
            { name: 'SECRET_KEY', type: 'string', required: true, description: 'JWT signing secret. Use a long random string (32+ chars).' },
          ]} />
        </DocSubSection>

        <DocSubSection title="Optional (with defaults)">
          <PropTable rows={[
            { name: 'DATABASE_URL', type: 'string', required: false, description: 'SQLite path. Default: sqlite:///backend/data/health_db.sqlite' },
            { name: 'REDIS_URL', type: 'string', required: false, description: 'Redis connection URL. Default: redis://localhost:6379/0. Falls back to in-memory if unavailable.' },
            { name: 'MEM0_API_KEY', type: 'string', required: false, description: 'Mem0 API key for long-term memory. System works without it.' },
            { name: 'VECTOR_DB_PATH', type: 'string', required: false, description: 'FAISS vector store path. Default: /app/rag/vector_store' },
            { name: 'DEBUG', type: 'boolean', required: false, description: 'Enable debug mode. Default: False. Enables verbose logging.' },
            { name: 'CORS_ORIGINS', type: 'string', required: false, description: 'Comma-separated allowed origins. Default: * (all origins).' },
          ]} />
        </DocSubSection>

        <CodeBlock title=".env.example" language="bash" code={`# ── LLM ──────────────────────────────────────────────
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── Long-term Memory (optional) ──────────────────────
MEM0_API_KEY=m0-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── Twilio ───────────────────────────────────────────
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── Database ─────────────────────────────────────────
REDIS_URL=redis://redis:6379/0
DATABASE_URL=sqlite:///app/data/health_db.sqlite
VECTOR_DB_PATH=/app/rag/vector_store

# ── App ──────────────────────────────────────────────
DEBUG=False
SECRET_KEY=your-super-secret-key-change-this-in-production
CORS_ORIGINS=https://arogyaai.com,https://www.arogyaai.com`} />
      </DocSection>

      <DocSection title="LLM Configuration">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          All LLM settings are in <code className="font-mono text-xs bg-gray-100 px-1 rounded">backend/config/settings.py</code>.
          Two models are used with different temperature settings per agent type.
        </p>

        <DocSubSection title="Models">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <code className="text-xs font-mono text-teal-700 font-bold">GROQ_MAIN_MODEL</code>
              <p className="text-sm font-semibold text-gray-900 mt-1">llama-3.3-70b-versatile</p>
              <p className="text-xs text-gray-500 mt-1">Used for: symptom analysis, planning, synthesis, education, outbreak alerts, dialogue state, reasoning</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <code className="text-xs font-mono text-blue-700 font-bold">GROQ_FAST_MODEL</code>
              <p className="text-sm font-semibold text-gray-900 mt-1">llama-3.1-8b-instant</p>
              <p className="text-xs text-gray-500 mt-1">Used for: language detection, memory ranking, profile extraction, summarization</p>
            </div>
          </div>
        </DocSubSection>

        <DocSubSection title="Temperature Settings">
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Setting</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Value</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Used By</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Rationale</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { setting: 'TEMP_SYMPTOM', value: '0.3', agent: 'SymptomAgent', reason: 'Low — accurate, consistent medical advice' },
                  { setting: 'TEMP_EDUCATION', value: '0.7', agent: 'EducationAgent', reason: 'Mid — natural, engaging teaching tone' },
                  { setting: 'TEMP_OUTBREAK', value: '0.2', agent: 'OutbreakAgent', reason: 'Very low — factual, precise outbreak alerts' },
                  { setting: 'TEMP_LANGUAGE', value: '0.1', agent: 'LanguageAgent', reason: 'Very low — precise language detection' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-4 py-3 font-mono text-teal-700 text-xs">{row.setting}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{row.value}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{row.agent}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocSubSection>

        <DocSubSection title="Max Token Limits">
          <CodeBlock title="config/settings.py" language="python" code={`MAX_TOKENS_SYMPTOM   = 1024   # Full medical analysis
MAX_TOKENS_EDUCATION = 1024   # Detailed disease education
MAX_TOKENS_OUTBREAK  = 512    # Concise outbreak alerts
MAX_TOKENS_LANGUAGE  = 256    # Language detection only`} />
        </DocSubSection>
      </DocSection>

      <DocSection title="Outbreak Detection Settings">
        <CodeBlock title="config/settings.py" language="python" code={`# Outbreak is triggered when:
OUTBREAK_THRESHOLD   = 5   # 5+ cases of same disease
OUTBREAK_WINDOW_DAYS = 7   # within 7 days
# in the same pincode area`} />
        <InfoCard type="info" title="Tuning Outbreak Sensitivity">
          Lower <code className="font-mono text-xs bg-blue-100 px-1 rounded">OUTBREAK_THRESHOLD</code> for more sensitive
          detection (more alerts). Increase <code className="font-mono text-xs bg-blue-100 px-1 rounded">OUTBREAK_WINDOW_DAYS</code> to
          catch slower-spreading outbreaks. For rural areas with low population, consider threshold of 3.
        </InfoCard>
      </DocSection>

      <DocSection title="Supported Languages">
        <CodeBlock title="config/settings.py" language="python" code={`SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "bn": "Bengali",
    "ta": "Tamil",
    "te": "Telugu",
    "mr": "Marathi",
    "gu": "Gujarati",
    "kn": "Kannada",
    "ml": "Malayalam",
    "pa": "Punjabi",
    # "od" handled as Odia in language agent
}`} />
        <p className="text-gray-600 text-sm mt-3">
          Language detection uses <code className="font-mono text-xs bg-gray-100 px-1 rounded">langdetect</code> as a first pass,
          with LLM fallback for mixed-language inputs (Hinglish, Banglish). The user's preferred language from their
          profile is used as a hint.
        </p>
      </DocSection>

      <DocSection title="Next.js Frontend Configuration">
        <DocSubSection title="Frontend .env Variables">
          <PropTable rows={[
            { name: 'NEXT_PUBLIC_API_BASE_URL', type: 'string', required: true, description: 'FastAPI backend URL. Default: https://arogyaai.duckdns.org' },
            { name: 'NEXT_PUBLIC_WHATSAPP_NUMBER', type: 'string', required: false, description: 'WhatsApp number for direct links. Default: 14155238886' },
            { name: 'AUTH_SECRET', type: 'string', required: true, description: 'JWT signing key for Next.js session cookies.' },
            { name: 'POSTGRES_URL', type: 'string', required: false, description: 'PostgreSQL connection for email/password auth.' },
            { name: 'MONGODB_URI', type: 'string', required: false, description: 'MongoDB for web chat session storage.' },
            { name: 'MONGODB_DB_NAME', type: 'string', required: false, description: 'MongoDB database name. Default: arogya_ai_chat' },
          ]} />
        </DocSubSection>
      </DocSection>

      <DocNavigation
        prev={{ href: '/docs/deployment', label: 'Deployment Guide' }}
      />
    </div>
  );
}
