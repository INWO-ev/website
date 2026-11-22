import { describe, it, expect } from 'vitest';
import {
  buildSeedPage,
  getStringAtPath,
  parseContentPath,
  updateHomePageText,
  MAX_TEXT_LENGTH,
} from '../src/server/contentStore.js';

const SECTION_KEYS = [
  'nav',
  'footer',
  'facts',
  'hero',
  'zins',
  'boden',
  'zukunft',
  'inwo',
  'stimmen',
  'aktuell',
  'mehr',
  'mitmachen',
];

describe('content document', () => {
  it('builds one seed document with all landing page sections', () => {
    const seed = buildSeedPage();
    expect(seed._id).toBe('home');
    for (const key of SECTION_KEYS) {
      expect(seed[key], key).toBeTruthy();
    }
    expect(Array.isArray(seed.events)).toBe(true);
    expect(Array.isArray(seed.posts)).toBe(true);
    expect(Array.isArray(seed.videos)).toBe(true);
  });

  it('resolves nested array text paths', () => {
    const seed = buildSeedPage();
    expect(getStringAtPath(seed, ['zins', 'scenes', '0', 'title'])).toBe('Die Freude');
    expect(getStringAtPath(seed, ['hero', 'headline'])).toBe(seed.hero.headline);
  });

  it('returns null for unknown or non-string paths', () => {
    const seed = buildSeedPage();
    expect(getStringAtPath(seed, ['hero', 'missing'])).toBeNull();
    expect(getStringAtPath(seed, ['zins', 'scenes', '99', 'title'])).toBeNull();
    expect(getStringAtPath(seed, ['hero', 'primaryCta'])).toBeNull();
  });
});

describe('content path validation', () => {
  it('accepts dotted and indexed paths', () => {
    expect(parseContentPath('hero.headline')).toEqual(['hero', 'headline']);
    expect(parseContentPath('zins.scenes.2.text')).toEqual(['zins', 'scenes', '2', 'text']);
  });

  it('rejects malformed or dangerous paths', () => {
    for (const path of [
      '',
      'hero',
      'hero..headline',
      '.hero.headline',
      'hero.headline.',
      '__proto__.polluted',
      'constructor.prototype',
      'hero.headline; DROP TABLE pages',
      'a'.repeat(201) + '.x',
      'hero.some space',
    ]) {
      expect(parseContentPath(path), path).toBeNull();
    }
  });
});

describe('updateHomePageText validation', () => {
  it('rejects non-editable fields before touching the database', async () => {
    const result = await updateHomePageText('hero.primaryCta.href', 'https://example.org');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(403);
  });

  it('rejects paths outside the text structures', async () => {
    const result = await updateHomePageText('__proto__.x', 'x');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(400);
  });

  it('rejects overly long text', async () => {
    const result = await updateHomePageText('hero.headline', 'x'.repeat(MAX_TEXT_LENGTH + 1));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(400);
  });

  it('rejects non-string values', async () => {
    const result = await updateHomePageText('hero.headline', 42);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(400);
  });
});
