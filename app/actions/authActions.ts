'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyCredentials, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';

export interface AuthState {
  error?: string;
}

export async function loginAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const reqHeaders = await headers();
  const clientIp = extractClientIp(reqHeaders);

  // Rate Limiting: Max 5 attempts per 15 minutes per IP
  const rateLimitKey = `auth_login:${clientIp}`;
  const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

  if (!rateLimit.allowed) {
    return {
      error: `Security Lockout: Too many login attempts. Please wait ${Math.ceil(
        rateLimit.retryAfterSec / 60
      )} minute(s) before trying again.`,
    };
  }

  const username = formData.get('username');
  const password = formData.get('password');

  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return { error: 'Username and password are required.' };
  }

  const cleanUser = username.trim();
  const cleanPass = password;

  if (cleanUser.length === 0 || cleanPass.length === 0) {
    return { error: 'Username and password cannot be empty.' };
  }

  if (cleanUser.length > 128 || cleanPass.length > 256) {
    return { error: 'Invalid input format.' };
  }

  const isValid = verifyCredentials(cleanUser, cleanPass);
  if (!isValid) {
    return { error: 'Invalid credentials. Access denied.' };
  }

  const token = await createSessionToken(cleanUser);
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Upgraded to strict to defeat CSRF completely
    maxAge: 60 * 60 * 12, // 12 hours
    path: '/',
  });

  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect('/admin/login');
}
