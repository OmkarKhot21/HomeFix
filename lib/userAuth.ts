import { SignJWT, jwtVerify, createRemoteJWKSet } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSecretKey } from './auth';

// Customer login: the browser signs in with Firebase (Google or phone OTP),
// sends us the Firebase ID token once, and we swap it for our own session cookie.

export const USER_COOKIE_NAME = 'homefix_user_session';
const USER_AUDIENCE = 'homefix-user';
const SESSION_DAYS = 30;

export interface SessionUser {
  uid: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}

// Google's public keys for Firebase ID tokens. jose caches them between calls.
const firebaseKeys = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

export function getFirebaseProjectId(): string | null {
  return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || null;
}

/** Verifies a Firebase ID token and returns the signed-in user's details. */
export async function verifyFirebaseIdToken(idToken: string): Promise<SessionUser | null> {
  const projectId = getFirebaseProjectId();
  if (!projectId || !idToken || idToken.length > 4096) return null;

  try {
    const { payload } = await jwtVerify(idToken, firebaseKeys, {
      algorithms: ['RS256'],
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    if (typeof payload.sub !== 'string' || payload.sub.length === 0 || payload.sub.length > 128) {
      return null;
    }

    // Require a fresh sign-in (within 10 minutes) so old tokens can't be replayed.
    const authTime = typeof payload.auth_time === 'number' ? payload.auth_time : 0;
    if (Date.now() / 1000 - authTime > 10 * 60) return null;

    const str = (v: unknown, max: number) => (typeof v === 'string' && v.length > 0 ? v.slice(0, max) : null);
    return {
      uid: payload.sub,
      name: str(payload.name, 100),
      email: str(payload.email, 200),
      phone: str(payload.phone_number, 20),
    };
  } catch {
    return null;
  }
}

export async function createUserSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({ ...user, role: 'user' })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(USER_AUDIENCE)
    .setSubject(user.uid)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set({
    name: USER_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
    path: '/',
  });
}

export async function clearUserSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE_NAME);
}

/** Returns the logged-in customer, or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_COOKIE_NAME)?.value;
  if (!token || token.length > 4096) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
      audience: USER_AUDIENCE,
    });
    if (payload.role !== 'user' || typeof payload.uid !== 'string') return null;
    const s = (v: unknown) => (typeof v === 'string' ? v : null);
    return { uid: payload.uid, name: s(payload.name), email: s(payload.email), phone: s(payload.phone) };
  } catch {
    return null;
  }
}

/** For pages that need a logged-in customer: sends everyone else to /login. */
export async function requireUser(nextPath: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}

/** Only allow redirects back into our own site. */
export function safeNextPath(value: string | null | undefined): string | null {
  if (!value) return null;
  const v = value.trim();
  if (!v.startsWith('/') || v.startsWith('//') || v.includes('\\') || v.length > 300) return null;
  return v;
}
