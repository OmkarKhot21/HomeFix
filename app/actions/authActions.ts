'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyCredentials, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';
import { adminLoginSchema } from '@/lib/validations';

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

  // Schema Validation via Zod
  const rawData = {
    username: formData.get('username'),
    password: formData.get('password'),
    next: formData.get('next') || undefined,
  };

  const parseResult = adminLoginSchema.safeParse(rawData);
  if (!parseResult.success) {
    return { error: parseResult.error.issues[0]?.message || 'Invalid input credentials.' };
  }

  const { username, password, next } = parseResult.data;

  const isValid = verifyCredentials(username, password);
  if (!isValid) {
    return { error: 'Invalid credentials. Access denied.' };
  }

  const token = await createSessionToken(username);
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Strict CSRF protection
    maxAge: 60 * 60 * 12, // 12 hours
    path: '/',
  });

  // Safe open-redirect protected destination
  const targetDestination = next || '/admin';
  redirect(targetDestination);
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect('/admin/login');
}
