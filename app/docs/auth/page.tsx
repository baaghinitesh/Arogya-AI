import {
  DocPageHeader, DocSection, DocSubSection, CodeBlock,
  InfoCard, StepList, DocNavigation, Breadcrumb, PropTable,
} from '@/components/docs/doc-components';

export default function AuthPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Docs', href: '/docs' }, { label: 'Authentication' }]} />
      <DocPageHeader
        badge="Authentication"
        title="Authentication"
        description="Arogya AI uses phone-based OTP authentication via Twilio Verify, with JWT tokens for session management. Email/password auth is available for web users."
      />

      <DocSection title="Authentication Overview">
        <p className="text-gray-600 leading-relaxed mb-4">
          The system supports two authentication methods. <strong>Phone OTP</strong> is the primary method — designed
          for rural Indian users who may not have email addresses. <strong>Email/password</strong> is available for
          web interface users and administrators.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
            <p className="font-semibold text-teal-800 text-sm mb-2">📱 Phone OTP (Primary)</p>
            <ul className="text-xs text-teal-700 space-y-1">
              <li>• Twilio Verify sends SMS OTP</li>
              <li>• 6-digit code, expires in 10 minutes</li>
              <li>• JWT token issued on verification</li>
              <li>• Mock code <code className="font-mono bg-teal-100 px-1 rounded">123456</code> in dev mode</li>
              <li>• Used by WhatsApp and web users</li>
            </ul>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="font-semibold text-blue-800 text-sm mb-2">📧 Email/Password (Web)</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• bcryptjs password hashing (10 rounds)</li>
              <li>• JWT session cookie (httpOnly, secure)</li>
              <li>• Stored in PostgreSQL via Drizzle ORM</li>
              <li>• Used by Next.js web interface</li>
              <li>• Activity logging for all auth events</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Phone OTP Flow (Backend)">
        <StepList steps={[
          {
            title: 'User registers their phone number',
            description: 'POST /api/register with name, age, gender, pincode, language. Creates a User record in SQLite.',
          },
          {
            title: 'Request OTP',
            description: 'POST /auth/send-otp with phone_number. Server checks registration, then calls Twilio Verify to send SMS.',
          },
          {
            title: 'Verify OTP',
            description: 'POST /auth/verify-otp with phone_number and otp. Twilio Verify checks the code. On success, a JWT is issued.',
          },
          {
            title: 'Use JWT token',
            description: 'Include the token in Authorization: Bearer <token> header for authenticated requests.',
          },
        ]} />

        <CodeBlock title="auth/twilio_verify_service.py" language="python" code={`def send_verification_otp(phone_number: str, channel: str = "sms") -> dict:
    """Send OTP via Twilio Verify."""
    client = _get_twilio_client()
    verification = client.verify.services(
        TWILIO_VERIFY_SERVICE_SID
    ).verifications.create(
        to=phone_number,
        channel=channel,   # "sms" or "whatsapp"
    )
    return {"success": True, "message": "OTP sent"}


def verify_otp_code(phone_number: str, code: str) -> dict:
    """Verify OTP code."""
    # Dev mock: code "123456" always passes
    if code == "123456":
        return {"success": True, "message": "OTP verified (Mock)"}

    verification_check = client.verify.services(
        TWILIO_VERIFY_SERVICE_SID
    ).verification_checks.create(
        to=phone_number,
        code=code,
    )
    if verification_check.status == "approved":
        return {"success": True, "message": "OTP verified"}
    return {"success": False, "message": "Invalid or expired OTP"}`} />

        <InfoCard type="warning" title="Development Mock Mode">
          When <code className="font-mono text-xs bg-amber-100 px-1 rounded">TWILIO_VERIFY_SERVICE_SID</code> is not set,
          the system falls back to a mock mode. OTP code <strong>123456</strong> will always be accepted.
          A log message is printed: <code className="font-mono text-xs bg-amber-100 px-1 rounded">🔑 [DEV MOCK OTP] Verification code for +91... is: 123456</code>
        </InfoCard>
      </DocSection>

      <DocSection title="JWT Token Management">
        <DocSubSection title="Token Structure">
          <p className="text-gray-600 text-sm mb-3">
            JWT tokens are signed with HS256 using the <code className="font-mono text-xs bg-gray-100 px-1 rounded">SECRET_KEY</code> environment variable.
            Tokens expire after 24 hours.
          </p>
          <CodeBlock title="api/auth/jwt_handler.py — Token payload" language="python" code={`# Token payload structure
{
    "phone_number": "+919876543210",
    "exp": 1748700000,   # Unix timestamp (24h from issue)
    "iat": 1748613600    # Issued at
}

# Creating a token
from api.auth.jwt_handler import create_access_token

token = create_access_token({"phone_number": phone_number})
# Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`} />
        </DocSubSection>

        <DocSubSection title="Using the Token">
          <CodeBlock title="Authenticated request" language="bash" code={`# Include in Authorization header
curl -X GET https://arogyaai.duckdns.org/api/user/+919876543210 \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Or in the Next.js web app, stored as httpOnly cookie named "session"`} />
        </DocSubSection>
      </DocSection>

      <DocSection title="Web Authentication (Next.js)">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          The Next.js frontend uses a separate auth system for web users, built with
          <code className="font-mono text-xs bg-gray-100 px-1 rounded mx-1">jose</code> (JWT) and
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">bcryptjs</code>. Sessions are stored as
          encrypted JWT cookies.
        </p>

        <DocSubSection title="Phone Session (Primary Web Auth)">
          <p className="text-gray-600 text-sm mb-3">
            After OTP verification on the web, a phone session is created with the user's full profile.
          </p>
          <CodeBlock title="lib/auth/session.ts" language="typescript" code={`export async function setPhoneSession(phoneUser: {
  phone_number: string;
  name: string;
  age?: number;
  gender?: string;
  pincode?: string;
  language?: string;
  token?: string;
}) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session: SessionData = {
    user: {
      id: \`phone_\${phoneUser.phone_number}\`,
      phone_number: phoneUser.phone_number,
      name: phoneUser.name,
      // ... other fields
    },
    expires: expiresInOneDay.toISOString(),
  };
  const encryptedSession = await signToken(session);
  cookies().set('session', encryptedSession, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });
}`} />
        </DocSubSection>

        <DocSubSection title="Session Resolution">
          <p className="text-gray-600 text-sm mb-3">
            The <code className="font-mono text-xs bg-gray-100 px-1 rounded">getUser()</code> function resolves the current
            user from the session cookie. It handles both phone sessions and email/password sessions.
          </p>
          <CodeBlock title="lib/db/queries.ts" language="typescript" code={`export async function getUser() {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie) return null;

  const sessionData = await verifyToken(sessionCookie.value);
  if (!sessionData || new Date(sessionData.expires) < new Date()) return null;

  // Phone session — no DB query needed
  if (sessionData.user.phone_number) {
    return sessionData.user;  // Returns phone session directly
  }

  // Email session — query PostgreSQL
  const user = await db.select().from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  return user[0] ?? null;
}`} />
        </DocSubSection>

        <DocSubSection title="Server Actions">
          <PropTable rows={[
            { name: 'signIn(email, password)', type: 'Server Action', required: false, description: 'Validates credentials, creates JWT session cookie. Redirects to /.' },
            { name: 'signUp(email, password)', type: 'Server Action', required: false, description: 'Hashes password, creates user in PostgreSQL, sets session.' },
            { name: 'signOut()', type: 'Server Action', required: false, description: 'Logs activity, deletes session cookie.' },
            { name: 'sendPhoneOtpAction(phone_number)', type: 'Server Action', required: false, description: 'Calls FastAPI /auth/send-otp.' },
            { name: 'verifyPhoneOtpAction(phone_number, otp)', type: 'Server Action', required: false, description: 'Calls FastAPI /auth/verify-otp, fetches profile, sets phone session.' },
            { name: 'registerPhoneUserAction(payload)', type: 'Server Action', required: false, description: 'Calls FastAPI /api/register, auto-logs in after success.' },
            { name: 'updatePassword(current, new, confirm)', type: 'Server Action', required: false, description: 'Validates and updates password hash in PostgreSQL.' },
            { name: 'deleteAccount(password)', type: 'Server Action', required: false, description: 'Soft-deletes user (sets deletedAt), clears session.' },
          ]} />
        </DocSubSection>
      </DocSection>

      <DocSection title="Activity Logging">
        <p className="text-gray-600 text-sm mb-4">
          All authentication events are logged to the <code className="font-mono text-xs bg-gray-100 px-1 rounded">activity_logs</code> table
          in PostgreSQL with timestamp, IP address, and metadata.
        </p>
        <div className="flex flex-wrap gap-2">
          {['SIGN_UP', 'SIGN_IN', 'SIGN_OUT', 'UPDATE_PASSWORD', 'DELETE_ACCOUNT', 'UPDATE_ACCOUNT', 'SHARE_CREATED', 'SHARE_ACCESSED', 'SHARE_UPDATED', 'SHARE_DELETED'].map((event) => (
            <span key={event} className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-gray-100 text-gray-700 border border-gray-200">
              {event}
            </span>
          ))}
        </div>
      </DocSection>

      <DocNavigation
        prev={{ href: '/docs/whatsapp', label: 'WhatsApp Integration' }}
        next={{ href: '/docs/deployment', label: 'Deployment Guide' }}
      />
    </div>
  );
}
