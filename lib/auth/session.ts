import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NewUser } from '@/lib/db/schema';

const key = new TextEncoder().encode(process.env.AUTH_SECRET);

export type SessionData = {
  user: {
    id: number | string;
    phone_number?: string;
    name?: string;
    age?: number;
    gender?: string;
    pincode?: string;
    language?: string;
    token?: string;
  };
  expires: string;
};

export async function signToken(payload: SessionData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7 days from now')
    .sign(key);
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as SessionData;
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;
  return await verifyToken(session);
}

export async function setSession(user: NewUser) {
  const expiresInSevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session: SessionData = {
    user: { id: user.id! },
    expires: expiresInSevenDays.toISOString(),
  };
  const encryptedSession = await signToken(session);
  (await cookies()).set('session', encryptedSession, {
    expires: expiresInSevenDays,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only use secure on HTTPS (production)
    sameSite: 'lax',
  });
}

export async function setPhoneSession(phoneUser: {
  phone_number: string;
  name: string;
  age?: number;
  gender?: string;
  pincode?: string;
  language?: string;
  token?: string;
}) {
  const expiresInSevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session: SessionData = {
    user: {
      id: `phone_${phoneUser.phone_number}`,
      phone_number: phoneUser.phone_number,
      name: phoneUser.name,
      age: phoneUser.age,
      gender: phoneUser.gender,
      pincode: phoneUser.pincode,
      language: phoneUser.language,
      token: phoneUser.token,
    },
    expires: expiresInSevenDays.toISOString(),
  };
  const encryptedSession = await signToken(session);
  (await cookies()).set('session', encryptedSession, {
    expires: expiresInSevenDays,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only use secure on HTTPS (production)
    sameSite: 'lax',
  });
}

