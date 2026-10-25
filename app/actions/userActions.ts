'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  verifyFirebaseIdToken,
  createUserSession,
  clearUserSession,
  getSessionUser,
  type SessionUser,
} from '@/lib/userAuth';
import { upsertUser } from '@/lib/db';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Called by the login page after Firebase sign-in succeeds. */
export async function startUserSession(idToken: string): Promise<ActionResult> {
  const ip = extractClientIp(await headers());
  const limit = await checkRateLimit(`user_login:${ip}`, 10, 5 * 60 * 1000, { failClosed: true });
  if (!limit.allowed) {
    return { ok: false, error: 'Too many login attempts. Please wait a few minutes and try again.' };
  }

  if (typeof idToken !== 'string') return { ok: false, error: 'Login failed. Please try again.' };

  const user = await verifyFirebaseIdToken(idToken);
  if (!user) return { ok: false, error: 'We could not verify your login. Please try again.' };

  try {
    await upsertUser(user);
  } catch (err) {
    console.error('[DATABASE ERROR in startUserSession]:', err);
    return { ok: false, error: 'Login is temporarily unavailable. Please try again shortly.' };
  }

  await createUserSession(user);
  return { ok: true };
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  return getSessionUser();
}

export async function logoutUser(): Promise<void> {
  await clearUserSession();
  redirect('/');
}
