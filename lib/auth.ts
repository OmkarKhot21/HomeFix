import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';

export const SESSION_COOKIE_NAME = 'homefix_admin_session';

// Fallback runtime secret if process.env.SESSION_SECRET is unconfigured
let fallbackRuntimeSecret: string | null = null;

function getSecretKey(): Uint8Array {
  const envSecret = process.env.SESSION_SECRET;
  if (envSecret && envSecret.trim().length >= 32) {
    return new TextEncoder().encode(envSecret.trim());
  }

  // If no persistent secret is provided, generate a secure random 32-byte secret for this runtime instance
  if (!fallbackRuntimeSecret) {
    fallbackRuntimeSecret = crypto.randomBytes(32).toString('hex');
    console.warn('[SECURITY WARNING] SESSION_SECRET not set. Using ephemeral random secret for this session.');
  }

  return new TextEncoder().encode(fallbackRuntimeSecret);
}

export async function createSessionToken(username: string): Promise<string> {
  const sanitizedUser = username.slice(0, 64);
  return await new SignJWT({ username: sanitizedUser, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<{ valid: boolean; username?: string }> {
  if (!token || typeof token !== 'string' || token.length > 2048) {
    return { valid: false };
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return { 
      valid: true, 
      username: typeof payload.username === 'string' ? payload.username : 'admin' 
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
  const expectedPassword = process.env.ADMIN_PASSWORD || 'HomeFix@2026#SecureOps';

  const userBuffer = crypto.createHash('sha256').update(username.trim()).digest();
  const expectedUserBuffer = crypto.createHash('sha256').update(expectedUsername).digest();

  const passBuffer = crypto.createHash('sha256').update(password).digest();
  const expectedPassBuffer = crypto.createHash('sha256').update(expectedPassword).digest();

  const userMatch = crypto.timingSafeEqual(userBuffer, expectedUserBuffer);
  const passMatch = crypto.timingSafeEqual(passBuffer, expectedPassBuffer);

  return userMatch && passMatch;
}
