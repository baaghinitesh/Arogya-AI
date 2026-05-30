import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  let res = NextResponse.next();

  // 1. Skip expensive JWT verification and signing completely on link pre-fetches
  const isPrefetch = request.headers.get('x-middleware-preflight') || 
                     request.headers.get('purpose') === 'prefetch';
  
  if (isPrefetch) {
    return res;
  }

  // 2. Only re-sign and update session cookie if it is close to expiring (less than 12 hours remaining)
  if (sessionCookie && request.method === 'GET') {
    try {
      const parsed = await verifyToken(sessionCookie.value);
      const expires = new Date(parsed.expires);
      const now = Date.now();
      const timeRemaining = expires.getTime() - now;

      // Only refresh and re-sign JWT if less than 12 hours are remaining
      if (timeRemaining < 12 * 60 * 60 * 1000) {
        const expiresInOneDay = new Date(now + 24 * 60 * 60 * 1000);
        res.cookies.set({
          name: 'session',
          value: await signToken({
            ...parsed,
            expires: expiresInOneDay.toISOString()
          }),
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          expires: expiresInOneDay
        });
      }
    } catch (error) {
      console.error('Error updating session:', error);
      res.cookies.delete('session');
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs'
};
