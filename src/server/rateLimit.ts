/**
 * Minimal in-memory rate limiter for the chat mockup (spec section 8.3:
 * "Rate-Limit pro IP/Sitzung"). Good enough for Phase 1 single-instance
 * deployment; replace with a shared store (e.g. Redis) once the service
 * runs behind multiple instances.
 */
export class InMemoryRateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number,
  ) {}

  /** Returns true if the request for this key is allowed. */
  check(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const existing = this.hits.get(key) ?? [];
    const recent = existing.filter((ts) => ts > windowStart);

    if (recent.length >= this.maxRequests) {
      this.hits.set(key, recent);
      return false;
    }

    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }
}
