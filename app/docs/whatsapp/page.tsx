import {
  DocPageHeader, DocSection, DocSubSection, CodeBlock,
  InfoCard, StepList, DocNavigation, Breadcrumb, PropTable,
} from '@/components/docs/doc-components';

export default function WhatsAppPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Docs', href: '/docs' }, { label: 'WhatsApp Integration' }]} />
      <DocPageHeader
        badge="WhatsApp"
        title="WhatsApp Integration"
        description="How Arogya AI connects to WhatsApp via Twilio — handling text messages, voice audio, GPS location, and the full registration flow."
      />

      <DocSection title="Overview">
        <p className="text-gray-600 leading-relaxed mb-4">
          WhatsApp is the <strong>primary interface</strong> for Arogya AI. Users in rural India interact with the
          assistant directly through their existing WhatsApp app — no additional app download required. The integration
          uses <strong>Twilio's WhatsApp Business API</strong> with a Twilio Sandbox number for development and a
          verified business number for production.
        </p>
        <CodeBlock title="WhatsApp Message Flow" language="text" code={`User sends WhatsApp message
        │
        ▼
Twilio receives message
        │
        ▼
POST https://arogyaai.duckdns.org/whatsapp/webhook
        │
        ├── [Text message] → body extracted directly
        │
        ├── [Audio message] → MediaUrl0 downloaded
        │                   → Faster-Whisper transcription
        │                   → transcribed text used as body
        │
        └── [Location share] → Latitude/Longitude extracted
                             → passed to LocationAgent
        │
        ▼
handle_whatsapp_webhook()
        │
        ├── Normalize phone number (E.164)
        ├── Build ChatRequest
        └── Call chat_endpoint() → LangGraph pipeline
        │
        ▼
clean_whatsapp_text(response)   # strip markdown, fix bullets
        │
        ▼
TwilioService.send_whatsapp_message(to, body)
        │
        ▼
User receives WhatsApp reply`} />
      </DocSection>

      <DocSection title="Twilio Setup">
        <StepList steps={[
          {
            title: 'Create a Twilio account',
            description: 'Sign up at twilio.com. Get your Account SID and Auth Token from the Console Dashboard.',
          },
          {
            title: 'Enable WhatsApp Sandbox (development)',
            description: 'Go to Messaging → Try it out → Send a WhatsApp message. Join the sandbox by sending the join code to +1 415 523 8886.',
          },
          {
            title: 'Configure the webhook URL',
            description: 'In Twilio Console → Messaging → Settings → WhatsApp Sandbox Settings, set the "When a message comes in" URL to: https://arogyaai.duckdns.org/whatsapp/webhook',
          },
          {
            title: 'Set up Twilio Verify (for OTP)',
            description: 'Go to Verify → Services → Create a new service. Copy the Service SID into TWILIO_VERIFY_SERVICE_SID.',
          },
          {
            title: 'Add credentials to .env',
            description: 'Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER, and TWILIO_VERIFY_SERVICE_SID.',
          },
        ]} />
        <CodeBlock title=".env" language="bash" code={`TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`} />
      </DocSection>

      <DocSection title="Webhook Handler">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          The webhook handler at <code className="font-mono text-xs bg-gray-100 px-1 rounded">whatsapp/webhook_handler.py</code> is
          the entry point for all incoming WhatsApp messages. It handles three message types.
        </p>

        <DocSubSection title="Text Messages">
          <CodeBlock title="whatsapp/webhook_handler.py" language="python" code={`async def handle_whatsapp_webhook(request: Request) -> dict:
    form_data = await request.form()
    params = dict(form_data)

    raw_from = params.get("From")          # "whatsapp:+919876543210"
    body = params.get("Body", "").strip()  # User's text message
    profile_name = params.get("ProfileName", "")

    # Normalize phone number to E.164
    phone_number = whatsapp_service.format_phone_number(raw_from)
    # → "+919876543210"

    # Build and send to AI pipeline
    chat_request = ChatRequest(
        phone_number=phone_number,
        message=body,
        history=[],
    )
    chat_response = await chat_endpoint(chat_request)

    # Clean and send reply
    formatted = clean_whatsapp_text(chat_response.response)
    whatsapp_service.send_whatsapp_message(raw_from, formatted)`} />
        </DocSubSection>

        <DocSubSection title="Voice Audio Messages">
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            When a user sends a voice note, Twilio provides a <code className="font-mono text-xs bg-gray-100 px-1 rounded">MediaUrl0</code> pointing
            to the audio file. The server downloads it and transcribes it using <strong>Faster-Whisper</strong> (on-device, no API cost).
          </p>
          <CodeBlock title="Voice transcription flow" language="python" code={`num_media = int(params.get("NumMedia", "0"))

if num_media > 0:
    media_url = params.get("MediaUrl0")
    media_type = params.get("MediaContentType0", "")

    if media_type.startswith("audio/"):
        transcribed_text = await voice_service.transcribe_whatsapp_audio(
            media_url,
            media_type,
        )
        body = transcribed_text  # Replace body with transcription
        # → continues as normal text message`} />
          <InfoCard type="info" title="Supported Audio Formats">
            WhatsApp sends voice notes as <code className="font-mono text-xs bg-blue-100 px-1 rounded">audio/ogg</code> (Opus codec).
            Faster-Whisper handles this natively. The model runs on CPU in the Docker container.
          </InfoCard>
        </DocSubSection>

        <DocSubSection title="Location Sharing">
          <p className="text-gray-600 text-sm mb-3">
            When a user shares their GPS location in WhatsApp, Twilio includes <code className="font-mono text-xs bg-gray-100 px-1 rounded">Latitude</code> and
            <code className="font-mono text-xs bg-gray-100 px-1 rounded mx-1">Longitude</code> in the form data. These are passed to the
            <code className="font-mono text-xs bg-gray-100 px-1 rounded mx-1">LocationAgent</code> for precise hospital search.
          </p>
          <CodeBlock title="Location parameters" language="python" code={`# Twilio form params when user shares location:
{
    "From": "whatsapp:+919876543210",
    "Body": "",
    "Latitude": "20.2961",
    "Longitude": "85.8245",
    "Address": "Bhubaneswar, Odisha"
}

# Passed to LocationAgent:
location_result = await location_agent.analyze(
    query=state["english_text"],
    latitude=state.get("whatsapp_latitude"),
    longitude=state.get("whatsapp_longitude"),
    pincode=state["pincode"],
    ...
)`} />
        </DocSubSection>
      </DocSection>

      <DocSection title="Message Formatting">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          WhatsApp renders a subset of markdown. The <code className="font-mono text-xs bg-gray-100 px-1 rounded">clean_whatsapp_text()</code> function
          strips unsupported formatting before sending.
        </p>
        <CodeBlock title="whatsapp/message_parser.py" language="python" code={`def clean_whatsapp_text(text: str) -> str:
    """Clean AI reply for WhatsApp delivery."""
    cleaned = text.replace("\\r\\n", "\\n").replace("\\r", "\\n").strip()
    cleaned = re.sub(r"\`\`\`+", "", cleaned)      # Remove code blocks
    cleaned = re.sub(r"\\n{3,}", "\\n\\n", cleaned)  # Max 2 newlines
    cleaned = cleaned.replace("•", "- ")            # Convert bullets
    return cleaned`} />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">✅ WhatsApp Supported</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• <code className="font-mono bg-gray-100 px-1 rounded">*bold*</code> text</li>
              <li>• <code className="font-mono bg-gray-100 px-1 rounded">_italic_</code> text</li>
              <li>• <code className="font-mono bg-gray-100 px-1 rounded">~strikethrough~</code></li>
              <li>• Plain bullet lists with <code className="font-mono bg-gray-100 px-1 rounded">-</code></li>
              <li>• Emoji characters</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">❌ Stripped by clean_whatsapp_text</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Triple backtick code blocks</li>
              <li>• Excessive blank lines (3+)</li>
              <li>• Unicode bullet • (replaced with -)</li>
              <li>• Carriage returns \r</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="WhatsApp Registration Flow">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          New users who message the WhatsApp number are guided through a step-by-step registration flow entirely
          within WhatsApp. The <code className="font-mono text-xs bg-gray-100 px-1 rounded">RegistrationState</code> table
          tracks progress.
        </p>
        <div className="space-y-3 mb-4">
          {[
            { step: '1', state: 'waiting_name', prompt: 'Welcome! Please tell me your full name.' },
            { step: '2', state: 'waiting_age', prompt: 'Thank you {name}! How old are you?' },
            { step: '3', state: 'waiting_gender', prompt: 'Please select your gender: male / female / other' },
            { step: '4', state: 'waiting_pincode', prompt: 'What is your 6-digit Indian pincode?' },
            { step: '5', state: 'complete', prompt: 'Registration complete! You can now ask health questions.' },
          ].map((item) => (
            <div key={item.step} className="flex gap-3 items-start p-3 rounded-lg bg-gray-50 border border-gray-200">
              <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {item.step}
              </span>
              <div>
                <code className="text-xs font-mono text-teal-700">{item.state}</code>
                <p className="text-xs text-gray-600 mt-0.5">"{item.prompt}"</p>
              </div>
            </div>
          ))}
        </div>
        <InfoCard type="success" title="Language auto-detection during registration">
          The language agent detects the user's language from their first message and sets it as their preferred
          language automatically. Users can also explicitly state their language preference.
        </InfoCard>
      </DocSection>

      <DocSection title="TwilioService Reference">
        <PropTable rows={[
          { name: 'validate_twilio_request(request, params)', type: 'async → bool', required: false, description: 'Validates Twilio HMAC-SHA1 webhook signature. Disabled in debug mode.' },
          { name: 'format_phone_number(raw_number)', type: '→ str', required: false, description: 'Strips "whatsapp:" prefix and normalizes to E.164 using phonenumbers library.' },
          { name: 'send_whatsapp_message(to_number, body)', type: '→ dict', required: false, description: 'Sends a WhatsApp message via Twilio REST API. Returns {sid, status, to, body}.' },
        ]} />
      </DocSection>

      <DocNavigation
        prev={{ href: '/docs/database', label: 'Database & Models' }}
        next={{ href: '/docs/auth', label: 'Authentication' }}
      />
    </div>
  );
}
