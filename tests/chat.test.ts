import { describe, it, expect } from 'vitest';
import { answerMockChat } from '../src/server/chat';
import { InMemoryRateLimiter } from '../src/server/rateLimit';

describe('answerMockChat', () => {
  it('matches a keyword and returns the stored source', () => {
    const { answer, source } = answerMockChat('Warum Bodenreform?');
    expect(answer).toContain('Boden');
    expect(source).toBeTruthy();
  });

  it('is case-insensitive', () => {
    const lower = answerMockChat('was ist freigeld');
    const upper = answerMockChat('WAS IST FREIGELD');
    expect(lower.answer).toBe(upper.answer);
  });

  it('returns the fallback with no source for unmatched input', () => {
    const { answer, source } = answerMockChat('irrelevant query about weather');
    expect(source).toBeNull();
    expect(answer.length).toBeGreaterThan(0);
  });
});

describe('InMemoryRateLimiter', () => {
  it('allows requests up to the limit and then blocks', () => {
    const limiter = new InMemoryRateLimiter(3, 10_000);
    expect(limiter.check('client-a')).toBe(true);
    expect(limiter.check('client-a')).toBe(true);
    expect(limiter.check('client-a')).toBe(true);
    expect(limiter.check('client-a')).toBe(false);
  });

  it('tracks separate clients independently', () => {
    const limiter = new InMemoryRateLimiter(1, 10_000);
    expect(limiter.check('client-a')).toBe(true);
    expect(limiter.check('client-b')).toBe(true);
    expect(limiter.check('client-a')).toBe(false);
  });
});
