import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

export interface RateLimitOptions {
  failClosed?: boolean;
}

// In-memory fallback storage
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();
let inMemoryCleanupStarted = false;

function ensureInMemoryCleanup(): void {
  if (!inMemoryCleanupStarted && typeof setInterval !== 'undefined') {
    inMemoryCleanupStarted = true;
    setInterval(() => {
      const now = Date.now();
      for (const [k, record] of rateLimitStore.entries()) {
        const validTimestamps = record.timestamps.filter((ts) => now - ts < 30 * 60 * 1000);
        if (validTimestamps.length === 0) {
          rateLimitStore.delete(k);
        } else {
          record.timestamps = validTimestamps;
        }
      }
    }, 5 * 60 * 1000);
  }
}

function checkInMemoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  ensureInMemoryCleanup();

  const now = Date.now();
  const windowStart = now - windowMs;

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= limit) {
    const oldestInWindow = record.timestamps[0];
    const retryAfterSec = Math.ceil((oldestInWindow + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, retryAfterSec),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    retryAfterSec: 0,
  };
}

// Module-level Upstash cache & lazy client
let redisClient: Redis | null = null;
const ratelimitInstances = new Map<string, Ratelimit>();
let hasLoggedRedisMissingWarning = false;

function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redisClient;
}

function getRatelimitInstance(limit: number, windowMs: number): Ratelimit {
  const cacheKey = `${limit}:${windowMs}`;
  let instance = ratelimitInstances.get(cacheKey);
  if (!instance) {
    instance = new Ratelimit({
      redis: getRedisClient(),
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      prefix: 'homefix',
    });
    ratelimitInstances.set(cacheKey, instance);
  }
  return instance;
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  opts?: RateLimitOptions
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // If env vars are missing, use in-memory fallback
  if (!url || !token) {
    if (!hasLoggedRedisMissingWarning && process.env.NODE_ENV === 'production') {
      hasLoggedRedisMissingWarning = true;
      console.warn(
        '[RATE LIMIT] Upstash Redis credentials not configured. Falling back to in-memory rate limiting.'
      );
    }
    return checkInMemoryRateLimit(key, limit, windowMs);
  }

  // Use Upstash Redis
  try {
    const ratelimiter = getRatelimitInstance(limit, windowMs);
    const result = await ratelimiter.limit(key);

    const now = Date.now();
    const retryAfterSec = result.success ? 0 : Math.max(1, Math.ceil((result.reset - now) / 1000));

    return {
      allowed: result.success,
      remaining: result.remaining,
      retryAfterSec,
    };
  } catch (error) {
    console.error(
      '[RATE LIMIT ERROR] Upstash Redis request failed:',
      error instanceof Error ? error.message : 'Unknown error'
    );

    if (opts?.failClosed) {
      return { allowed: false, remaining: 0, retryAfterSec: 60 };
    }
    return { allowed: true, remaining: limit, retryAfterSec: 0 };
  }
}

export function extractClientIp(headers: Headers): string {
  // Vercel sets these itself from the real connection, so visitors can't fake them.
  const vercelIp = headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim();
  if (vercelIp) return vercelIp;
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'unknown-client';
}
