import {
  DocPageHeader, DocSection, DocSubSection, CodeBlock,
  InfoCard, ApiEndpoint, PropTable, DocNavigation, Breadcrumb,
} from '@/components/docs/doc-components';

export default function ApiReferencePage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Docs', href: '/docs' }, { label: 'API Reference' }]} />
      <DocPageHeader
        badge="API Reference"
        title="REST API Reference"
        description="Complete reference for all Arogya AI backend endpoints. Base URL: https://arogyaai.duckdns.org (production) or http://localhost:8000 (local)."
      />

      <InfoCard type="info" title="Interactive Docs">
        FastAPI auto-generates Swagger UI at <code className="font-mono text-xs bg-blue-100 px-1 rounded">/docs</code> and
        ReDoc at <code className="font-mono text-xs bg-blue-100 px-1 rounded">/redoc</code>. Use these for live testing.
      </InfoCard>

      {/* ── CHAT ── */}
      <DocSection title="Chat">
        <ApiEndpoint method="POST" path="/api/chat" description="Send a message to the AI health assistant. This is the core endpoint — it runs the full LangGraph pipeline and returns a response in the user's language.">
          <DocSubSection title="Request Body">
            <PropTable rows={[
              { name: 'phone_number', type: 'string', required: true, description: 'User\'s phone number in E.164 format (e.g. +919876543210). Must be registered.' },
              { name: 'message', type: 'string', required: true, description: 'The user\'s message in any supported language.' },
              { name: 'history', type: 'ChatMessage[]', required: false, description: 'Optional conversation history array. Each item has role (user/assistant) and content.' },
            ]} />
          </DocSubSection>
          <DocSubSection title="Example Request">
            <CodeBlock language="json" code={`{
  "phone_number": "+919876543210",
  "message": "मुझे 2 दिनों से बुखार है और सिर दर्द भी है",
  "history": [
    { "role": "user", "content": "नमस्ते" },
    { "role": "assistant", "content": "नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?" }
  ]
}`} />
          </DocSubSection>
          <DocSubSection title="Response">
            <PropTable rows={[
              { name: 'response', type: 'string', required: true, description: 'AI-generated health guidance in the user\'s detected language.' },
            ]} />
            <CodeBlock language="json" code={`{
  "response": "मैं समझता हूं कि आपको 2 दिनों से बुखार और सिर दर्द है।\\n\\n• पर्याप्त आराम करें और खूब पानी पिएं\\n• पैरासिटामोल 500mg हर 6 घंटे में ले सकते हैं\\n• माथे पर ठंडी पट्टी रखें\\n\\n⚠️ अगर बुखार 103°F से ज्यादा हो या 3 दिन से अधिक रहे, तो तुरंत डॉक्टर से मिलें।\\n\\nक्या आपको खांसी या गले में दर्द भी है?"
}`} />
          </DocSubSection>
        </ApiEndpoint>
      </DocSection>

      {/* ── USER ── */}
      <DocSection title="User Management">
        <ApiEndpoint method="POST" path="/api/register" description="Register a new user. Creates a profile in SQLite and resolves the pincode to a location area using the India Post API.">
          <DocSubSection title="Request Body">
            <PropTable rows={[
              { name: 'phone_number', type: 'string', required: true, description: 'E.164 format phone number (e.g. +919876543210).' },
              { name: 'name', type: 'string', required: true, description: 'User\'s full name.' },
              { name: 'age', type: 'integer', required: true, description: 'User\'s age (1–120).' },
              { name: 'gender', type: 'string', required: true, description: 'male | female | other' },
              { name: 'pincode', type: 'string', required: true, description: '6-digit Indian pincode for location and outbreak tracking.' },
              { name: 'language', type: 'string', required: false, description: 'Preferred language code. Default: "en". Supported: en, hi, bn, ta, te, mr, gu, kn, ml, pa, od.' },
            ]} />
          </DocSubSection>
          <DocSubSection title="Example">
            <CodeBlock language="bash" code={`curl -X POST https://arogyaai.duckdns.org/api/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone_number": "+919876543210",
    "name": "Priya Sharma",
    "age": 32,
    "gender": "female",
    "pincode": "751001",
    "language": "od"
  }'`} />
          </DocSubSection>
          <DocSubSection title="Response">
            <CodeBlock language="json" code={`{
  "phone_number": "+919876543210",
  "name": "Priya Sharma",
  "age": 32,
  "gender": "female",
  "pincode": "751001",
  "location_area": "Bhubaneswar, Khordha, Odisha",
  "language": "od",
  "registered_at": "2025-05-30T10:30:00"
}`} />
          </DocSubSection>
        </ApiEndpoint>

        <ApiEndpoint method="GET" path="/api/user/{phone_number}" description="Fetch a registered user's profile by phone number.">
          <DocSubSection title="Path Parameter">
            <PropTable rows={[
              { name: 'phone_number', type: 'string', required: true, description: 'URL-encoded E.164 phone number (e.g. %2B919876543210).' },
            ]} />
          </DocSubSection>
          <DocSubSection title="Response">
            <CodeBlock language="json" code={`{
  "user": {
    "id": 1,
    "phone_number": "+919876543210",
    "name": "Priya Sharma",
    "age": 32,
    "gender": "female",
    "pincode": "751001",
    "location_area": "Bhubaneswar, Khordha, Odisha",
    "language": "od",
    "registered_at": "2025-05-30T10:30:00"
  }
}`} />
          </DocSubSection>
        </ApiEndpoint>
      </DocSection>

      {/* ── AUTH ── */}
      <DocSection title="Authentication">
        <ApiEndpoint method="POST" path="/auth/send-otp" description="Send an OTP to a registered phone number via Twilio Verify (SMS). Returns mock OTP 123456 in development mode.">
          <DocSubSection title="Request Body">
            <PropTable rows={[
              { name: 'phone_number', type: 'string', required: true, description: 'Registered E.164 phone number.' },
            ]} />
          </DocSubSection>
          <DocSubSection title="Response">
            <CodeBlock language="json" code={`{ "success": true, "message": "OTP sent" }
// Dev mode:
{ "success": true, "message": "OTP sent (Mock: 123456)" }`} />
          </DocSubSection>
        </ApiEndpoint>

        <ApiEndpoint method="POST" path="/auth/verify-otp" description="Verify the OTP and receive a JWT access token. Token is valid for 24 hours.">
          <DocSubSection title="Request Body">
            <PropTable rows={[
              { name: 'phone_number', type: 'string', required: true, description: 'Registered E.164 phone number.' },
              { name: 'otp', type: 'string', required: true, description: '6-digit OTP code. Use "123456" in development.' },
            ]} />
          </DocSubSection>
          <DocSubSection title="Response">
            <CodeBlock language="json" code={`{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`} />
          </DocSubSection>
        </ApiEndpoint>
      </DocSection>

      {/* ── WHATSAPP ── */}
      <DocSection title="WhatsApp Webhook">
        <ApiEndpoint method="POST" path="/whatsapp/webhook" description="Twilio webhook endpoint. Receives incoming WhatsApp messages (text or audio), processes them through the AI pipeline, and sends a reply via Twilio.">
          <InfoCard type="warning" title="Twilio Signature Validation">
            In production, Twilio signs every webhook request with an HMAC-SHA1 signature. The server validates this
            using <code className="font-mono text-xs bg-amber-100 px-1 rounded">TWILIO_AUTH_TOKEN</code>. Signature
            validation is currently disabled in debug mode.
          </InfoCard>
          <DocSubSection title="Twilio Form Parameters">
            <PropTable rows={[
              { name: 'From', type: 'string', required: true, description: 'Sender\'s WhatsApp number (e.g. whatsapp:+919876543210).' },
              { name: 'Body', type: 'string', required: false, description: 'Text message body. Empty for audio messages.' },
              { name: 'ProfileName', type: 'string', required: false, description: 'WhatsApp display name of the sender.' },
              { name: 'NumMedia', type: 'string', required: false, description: 'Number of media attachments (0 for text).' },
              { name: 'MediaUrl0', type: 'string', required: false, description: 'URL of the first media file (audio for voice messages).' },
              { name: 'MediaContentType0', type: 'string', required: false, description: 'MIME type of media (e.g. audio/ogg).' },
              { name: 'Latitude', type: 'string', required: false, description: 'GPS latitude if user shares location.' },
              { name: 'Longitude', type: 'string', required: false, description: 'GPS longitude if user shares location.' },
            ]} />
          </DocSubSection>
        </ApiEndpoint>
      </DocSection>

      {/* ── HEALTH ── */}
      <DocSection title="Health Check">
        <ApiEndpoint method="GET" path="/" description="Root health check endpoint. Returns a simple status message to confirm the server is running.">
          <CodeBlock language="json" code={`{ "message": "Rural Health Assistant API Running" }`} />
        </ApiEndpoint>
      </DocSection>

      {/* ── ERROR CODES ── */}
      <DocSection title="Error Responses">
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Meaning</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Common Cause</th>
              </tr>
            </thead>
            <tbody>
              {[
                { code: '400', meaning: 'Bad Request', cause: 'Missing required fields, invalid phone format, user already registered' },
                { code: '403', meaning: 'Forbidden', cause: 'Invalid Twilio webhook signature (production only)' },
                { code: '404', meaning: 'Not Found', cause: 'User not found for the given phone number' },
                { code: '500', meaning: 'Internal Server Error', cause: 'LLM API failure, database error, transcription failure' },
                { code: '502', meaning: 'Bad Gateway', cause: 'Failed to send WhatsApp reply via Twilio' },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-4 py-3 font-mono font-bold text-red-600">{row.code}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{row.meaning}</td>
                  <td className="px-4 py-3 text-gray-500">{row.cause}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocNavigation
        prev={{ href: '/docs/agents', label: 'AI Agents' }}
        next={{ href: '/docs/database', label: 'Database & Models' }}
      />
    </div>
  );
}
