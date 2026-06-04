// A simple in-memory rate limiter for serverless environments.
// Note: This resets per instance and is not distributed. It works well for a single-region deployment.
// For distributed rate limiting, consider using Upstash Redis.

const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || record.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return true; // allowed
  }

  if (record.count >= limit) {
    return false; // blocked
  }

  record.count += 1;
  return true; // allowed
}

export function clearExpiredRateLimits() {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (record.expiresAt < now) {
      rateLimitMap.delete(key);
    }
  }
}

// Optional: clean up memory occasionally if long-running
if (typeof setInterval !== 'undefined') {
  setInterval(clearExpiredRateLimits, 60000);
}
