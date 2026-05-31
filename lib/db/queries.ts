import { desc, and, eq, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import { activityLogs, users } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const sessionData = await verifyToken(sessionCookie.value);
    if (!sessionData || !sessionData.user) {
      return null;
    }

    if (new Date(sessionData.expires) < new Date()) {
      return null;
    }

    // Phone sessions — fully self-contained in JWT, no DB needed
    if (sessionData.user.phone_number) {
      return sessionData.user;
    }

    // Email/password sessions — need PostgreSQL
    // Wrap in a race with a 3-second timeout so a dead DB never blocks the UI
    const dbQuery = db
      .select()
      .from(users)
      .where(and(eq(users.id, Number(sessionData.user.id)), isNull(users.deletedAt)))
      .limit(1)
      .catch(() => null); // Synchronous fallback to prevent unhandled rejections if PostgreSQL is down/slow

    const timeout = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 3000)
    );

    const result = await Promise.race([dbQuery, timeout]);
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return null;
    }

    return Array.isArray(result) ? result[0] : null;
  } catch (error) {
    // Never throw — a DB error should not crash the page
    return null;
  }
}

export async function getActivityLogs() {
  try {
    const user = await getUser();
    if (!user) {
      return [];
    }

    // Safe cast for phone-based session IDs
    const userId = typeof user.id === 'string' ? 0 : user.id;

    return await db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        timestamp: activityLogs.timestamp,
        ipAddress: activityLogs.ipAddress,
        metadata: activityLogs.metadata,
        userName: users.name
      })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.userId, users.id))
      .where(eq(activityLogs.userId, userId))
      .orderBy(desc(activityLogs.timestamp))
      .limit(10);
  } catch (error) {
    console.error('Failed to get activity logs securely:', error);
    return [];
  }
}