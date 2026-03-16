import { createHash } from 'crypto';

// In-memory store: { ipHash+facilityId -> timestamp }
// For production: use Redis or DB table instead
const rateLimitStore = new Map<string, number>();

export function hashIp(ip: string): string {
  return createHash('sha256').update(ip + process.env.RATE_LIMIT_SALT || 'salt').digest('hex');
}

/**
 * Returns true if the request is within the rate limit.
 * @param key - unique identifier (e.g. ipHash + facilityId)
 * @param windowMs - time window in milliseconds
 * @param maxRequests - max requests allowed in window
 */
export function checkRateLimit(key: string, windowMs = 24 * 60 * 60 * 1000, maxRequests = 1): boolean {
  const now = Date.now();
  const timestamps = JSON.parse((rateLimitStore.get(key) || '[]') as any);

  const recent = Array.isArray(timestamps)
    ? timestamps.filter((t: number) => now - t < windowMs)
    : [];

  if (recent.length >= maxRequests) return false;

  recent.push(now);
  rateLimitStore.set(key, JSON.stringify(recent) as any);
  return true;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || '127.0.0.1';
}
