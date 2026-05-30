'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import {
  User,
  users,
  activityLogs,
  type NewUser,
  type NewActivityLog,
  ActivityType,
} from '@/lib/db/schema';
import { comparePasswords, hashPassword, setSession, getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUser } from '@/lib/db/queries';
import {
  validatedAction,
  validatedActionWithUser
} from '@/lib/auth/middleware';

async function logActivity(
  userId: number,
  type: ActivityType,
  ipAddress?: string,
  metadata?: string
) {
  const newActivity: NewActivityLog = {
    userId,
    action: type,
    ipAddress: ipAddress || '',
    metadata: metadata || null
  };
  await db.insert(activityLogs).values(newActivity);
}

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100)
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  const foundUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (foundUser.length === 0) {
    return {
      error: 'Invalid email or password. Please try again.',
      email,
      password
    };
  }

  const user = foundUser[0];

  const isPasswordValid = await comparePasswords(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    return {
      error: 'Invalid email or password. Please try again.',
      email,
      password
    };
  }

  await Promise.all([
    setSession(user),
    logActivity(user.id, ActivityType.SIGN_IN)
  ]);

  redirect('/');
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, password } = data;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      error: 'Failed to create user. Please try again.',
      email,
      password
    };
  }

  const passwordHash = await hashPassword(password);

  const newUser: NewUser = {
    email,
    passwordHash,
    name: null
  };

  const [createdUser] = await db.insert(users).values(newUser).returning();

  if (!createdUser) {
    return {
      error: 'Failed to create user. Please try again.',
      email,
      password
    };
  }

  await Promise.all([
    logActivity(createdUser.id, ActivityType.SIGN_UP),
    setSession(createdUser)
  ]);

  redirect('/');
});

export async function signOut() {
  const user = (await getUser()) as User;
  await logActivity(user.id, ActivityType.SIGN_OUT);
  (await cookies()).delete('session');
}

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100)
});

export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    const isPasswordValid = await comparePasswords(
      currentPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: 'Current password is incorrect.'
      };
    }

    if (currentPassword === newPassword) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: 'New password must be different from the current password.'
      };
    }

    if (confirmPassword !== newPassword) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: 'New password and confirmation password do not match.'
      };
    }

    const newPasswordHash = await hashPassword(newPassword);

    await Promise.all([
      db
        .update(users)
        .set({ passwordHash: newPasswordHash })
        .where(eq(users.id, user.id)),
      logActivity(user.id, ActivityType.UPDATE_PASSWORD)
    ]);

    return {
      success: 'Password updated successfully.'
    };
  }
);

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(100)
});

export const deleteAccount = validatedActionWithUser(
  deleteAccountSchema,
  async (data, _, user) => {
    const { password } = data;

    const isPasswordValid = await comparePasswords(password, user.passwordHash);
    if (!isPasswordValid) {
      return {
        password,
        error: 'Incorrect password. Please try again.'
      };
    }

    await Promise.all([
      db
        .update(users)
        .set({ deletedAt: new Date() })
        .where(eq(users.id, user.id)),
      logActivity(user.id, ActivityType.DELETE_ACCOUNT)
    ]);

    (await cookies()).delete('session');
    redirect('/sign-in');
  }
);

const updateAccountSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().min(3).max(255)
});

export const updateAccount = validatedActionWithUser(
  updateAccountSchema,
  async (data, _, user) => {
    const { name, email } = data;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].id !== user.id) {
      return {
        name,
        email,
        error: 'Email is already in use.'
      };
    }

    await Promise.all([
      db.update(users).set({ name, email }).where(eq(users.id, user.id)),
      logActivity(user.id, ActivityType.UPDATE_ACCOUNT)
    ]);

    return {
      success: 'Account updated successfully.'
    };
  }
);

// ── PHONE NUMBER & OTP AUTH SERVER ACTIONS ────────────────────────────────

import { setPhoneSession } from '@/lib/auth/session';

export async function sendPhoneOtpAction(phone_number: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('sendPhoneOtpAction error:', error);
    return { success: false, message: 'Failed to connect to backend server' };
  }
}

export async function verifyPhoneOtpAction(phone_number: string, otp: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number, otp }),
    });
    const data = await response.json();
    
    if (data.success) {
      // Fetch user profile from backend
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${phone_number}`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const user = profileData.user;
        
        // Save session
        await setPhoneSession({
          phone_number: user.phone_number,
          name: user.name,
          age: user.age,
          gender: user.gender,
          pincode: user.pincode,
          language: user.language,
          token: data.token,
        });
      } else {
        // Fallback if profile not found (should not happen if registered)
        await setPhoneSession({
          phone_number,
          name: 'Registered User',
          token: data.token,
        });
      }
    }
    
    return data;
  } catch (error) {
    console.error('verifyPhoneOtpAction error:', error);
    return { success: false, message: 'Failed to verify OTP' };
  }
}

export async function registerPhoneUserAction(payload: {
  phone_number: string;
  name: string;
  age: number;
  gender: string;
  pincode: string;
  language: string;
}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || 'Registration failed' };
    }
    
    const data = await response.json();
    
    // Auto-login after registration
    await setPhoneSession({
      phone_number: data.phone_number,
      name: data.name,
      age: data.age,
      gender: data.gender,
      pincode: data.pincode,
      language: data.language,
      token: 'registered_via_web',
    });
    
    return { success: true, user: data };
  } catch (error) {
    console.error('registerPhoneUserAction error:', error);
    return { success: false, message: 'Failed to register user' };
  }
}

export async function updateUserLanguageAction(language: string) {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.phone_number) {
      return { success: false, error: 'Not authenticated' };
    }

    const phone_number = session.user.phone_number;

    // Call FastAPI backend to update the language in SQLite
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/update-language`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number, language }),
    });

    if (response.ok) {
      // Re-sign session cookie with updated language
      await setPhoneSession({
        phone_number,
        name: session.user.name || '',
        age: session.user.age,
        gender: session.user.gender,
        pincode: session.user.pincode,
        language: language,
        token: session.user.token,
      });
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.detail || 'Failed to update language on backend' };
    }
  } catch (error) {
    console.error('updateUserLanguageAction error:', error);
    return { success: false, error: 'Failed to update user language' };
  }
}
