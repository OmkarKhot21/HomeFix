import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const SESSION_COOKIE_NAME = 'homefix_admin_session';

// Fallback runtime secret for local development only
let devEphemeralSecret: string | null = null;

export function getSecretKey(): Uint8Array {
  const envSecret = process.env.SESSION_SECRET;

  if (envSecret && envSecret.trim().length >= 32) {
    return new TextEncoder().encode(envSecret.trim());
  }

  // Strict Production Enforcement: Never allow missing secrets in production
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'FATAL CONFIGURATION ERROR: SESSION_SECRET environment variable is missing or less than 32 characters in production.'
    );
  }

  // Local development fallback only
  if (!devEphemeralSecret) {
    devEphemeralSecret = crypto.randomBytes(32).toString('hex');
    console.warn(
      '[DEV WARNING] SESSION_SECRET is not configured in .env.local. Using ephemeral in-memory secret for this session.'
    );
  }

  return new TextEncoder().encode(devEphemeralSecret);
}

export async function createSessionToken(username: string): Promise<string> {
  const sanitizedUser = username.slice(0, 64);
  return await new SignJWT({ username: sanitizedUser, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<{ valid: boolean; username?: string }> {
  if (!token || typeof token !== 'string' || token.length > 2048) {
    return { valid: false };
  }

  try {
    // Security: Pin HS256 algorithm to prevent algorithm confusion attacks
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    });

    // Only admin tokens may pass. Customer session tokens are signed with the
    // same secret but carry role 'user', so they must be rejected here.
    if (payload.role !== 'admin') {
      return { valid: false };
    }

    return {
      valid: true,
      username: typeof payload.username === 'string' ? payload.username : 'admin',
    };
  } catch {
    return { valid: false };
  }
}

export function verifyCredentials(username: string, password: string): boolean {
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return false;
  }

  // Prevent DoS through oversized payload hashing
  if (username.length > 128 || password.length > 256) {
    return false;
  }

  const expectedUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'FATAL CONFIGURATION ERROR: ADMIN_PASSWORD environment variable is missing in production.'
      );
    }
    console.warn('[DEV WARNING] ADMIN_PASSWORD not configured. Denying login.');
    return false;
  }

  const userBuffer = crypto.createHash('sha256').update(username.trim()).digest();
  const expectedUserBuffer = crypto.createHash('sha256').update(expectedUsername).digest();

  const passBuffer = crypto.createHash('sha256').update(password).digest();
  const expectedPassBuffer = crypto.createHash('sha256').update(expectedPassword).digest();

  // Constant-time comparison against side-channel timing attacks
  const userMatch = crypto.timingSafeEqual(userBuffer, expectedUserBuffer);
  const passMatch = crypto.timingSafeEqual(passBuffer, expectedPassBuffer);

  return userMatch && passMatch;
}

/**
 * Standard Security Helper: Reusable admin authorization guard
 * Throws redirect to /admin/login if not authenticated.
 * Call this inside server components and server actions to enforce defense-in-depth.
 */
export async function requireAdmin(): Promise<{ username: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const session = await verifySessionToken(token);
  if (!session.valid || !session.username) {
    redirect('/admin/login');
  }

  return { username: session.username };
}

/**
 * API Route Handler Security Guard
 * Returns authorization status without throwing an unhandled redirect.
 */
export async function verifyAdminApi(): Promise<{ authorized: boolean; username?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return { authorized: false };
  }

  const session = await verifySessionToken(token);
  return { authorized: session.valid, username: session.username };
}
