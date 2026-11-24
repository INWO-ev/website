import path from 'node:path';
import { getDb } from './db.js';
import { loadContent } from './content.js';
import { readJsonFile } from './jsonFile.js';
import { DATA_DIR } from './paths.js';

function loadSeedData<T>(fileName: string): T {
  return readJsonFile<T>(path.join(DATA_DIR, fileName));
}

export const PAGE_COLLECTION = 'pages';
export const HOME_PAGE_ID = 'home';
export const MAX_TEXT_LENGTH = 5000;

type PageDocument = Record<string, unknown> & {
  _id: string;
  title: string;
  description: string;
};

export type ContentUpdate =
  | { ok: true; path: string; value: string; updatedAt: string }
  | { ok: false; status: number; error: string };

/**
 * Every visible text of the landing page lives in one MongoDB document
 * (_id: "home" in the "pages" collection). The JSON files in src/content
 * are only the seed for the first start and the fallback when MongoDB is
 * unreachable - they are never written back.
 */
export function buildSeedPage(): PageDocument {
  return {
    _id: HOME_PAGE_ID,
    title: 'Fairconomy – INWO',
    description:
      'Fairconomy: die INWO setzt sich für eine faire Geld- und Bodenordnung ein – einfach, wirksam, gerecht.',
    version: 1,
    updatedAt: new Date(),
    nav: loadContent('nav'),
    footer: loadContent('footer'),
    facts: loadContent('facts'),
    hero: loadContent('hero'),
    zins: loadContent('zins'),
    boden: loadContent('boden'),
    zukunft: loadContent('zukunft'),
    inwo: loadContent('inwo'),
    stimmen: loadContent('stimmen'),
    aktuell: loadContent('aktuell'),
    mehr: loadContent('mehr'),
    mitmachen: loadContent('mitmachen'),
    // The lists shown in the "Aktuell" section are part of the page document
    // as well, so one document really holds every text on the landing page.
    events: loadSeedData('events.json'),
    posts: loadSeedData('posts.json'),
    videos: loadSeedData('videos.json'),
  };
}

let dbUnavailableUntil = 0;

/** Reads the landing page document. Seeds it once, falls back to files if Mongo is down. */
export async function getHomePage(): Promise<PageDocument> {
  if (Date.now() < dbUnavailableUntil) {
    return buildSeedPage();
  }

  try {
    const db = await getDb();
    const collection = db.collection<PageDocument>(PAGE_COLLECTION);
    const existing = (await collection.findOne({ _id: HOME_PAGE_ID })) as PageDocument | null;
    if (existing) {
      // Documents seeded before the Aktuell lists moved into the page
      // document get them added once, without touching edited texts.
      const missing: Record<string, unknown> = {};
      for (const [key, fileName] of Object.entries({
        events: 'events.json',
        posts: 'posts.json',
        videos: 'videos.json',
      })) {
        if (!Array.isArray(existing[key])) {
          missing[key] = loadSeedData(fileName);
        }
      }
      if (Object.keys(missing).length > 0) {
        await collection.updateOne({ _id: HOME_PAGE_ID }, { $set: missing });
        return { ...existing, ...missing };
      }
      return existing;
    }

    const seed = buildSeedPage();
    await collection.insertOne(seed);
    return seed;
  } catch (error) {
    dbUnavailableUntil = Date.now() + 15_000;
    // eslint-disable-next-line no-console
    console.warn(
      '[content] MongoDB nicht erreichbar, nutze JSON-Fallback:',
      (error as Error).message,
    );
    return buildSeedPage();
  }
}

/** Only these leaf keys may be overwritten through the editing endpoint. */
const EDITABLE_KEYS = new Set([
  'headline',
  'subline',
  'eyebrow',
  'intro',
  'title',
  'text',
  'statusNote',
  'note',
  'question',
  'answer',
  'label',
  'ctaLabel',
  'brand',
  'brandSub',
  'heading',
  'email',
  'iban',
  'youtube',
  'copyright',
  'placeholder',
  'submitLabel',
  'allLabel',
  'icalLabel',
  'rssLabel',
  'spendenLinkLabel',
  'newsletterLinkLabel',
  'readMoreLabel',
  'transcriptLabel',
  'sourceNote',
  'disabledNote',
  'value',
  'stand',
  'quelle',
  'name',
  'quote',
  'titel',
  'teaser',
  'ort',
  'blogLabel',
  'veroeffentlicht_am',
]);

const SEGMENT_RE = /^[A-Za-z0-9_-]+$/;
const FORBIDDEN_SEGMENTS = new Set(['__proto__', 'constructor', 'prototype']);

/** Splits and validates a dot path like "zins.scenes.0.title". */
export function parseContentPath(raw: string): string[] | null {
  const path = raw.trim();
  if (!path || path.length > 200) return null;

  const segments = path.split('.');
  if (segments.length < 2 || segments.length > 10) return null;
  if (!segments.every((segment) => SEGMENT_RE.test(segment))) return null;
  if (segments.some((segment) => FORBIDDEN_SEGMENTS.has(segment))) return null;

  return segments;
}

/** Resolves a dot path to a string leaf of the document, or null. */
export function getStringAtPath(doc: unknown, segments: string[]): string | null {
  let node: unknown = doc;

  for (const segment of segments) {
    if (Array.isArray(node)) {
      if (!/^\d+$/.test(segment)) return null;
      const index = Number(segment);
      if (index < 0 || index >= node.length) return null;
      node = node[index];
      continue;
    }

    if (node && typeof node === 'object') {
      if (!Object.prototype.hasOwnProperty.call(node, segment)) return null;
      node = (node as Record<string, unknown>)[segment];
      continue;
    }

    return null;
  }

  return typeof node === 'string' ? node : null;
}

/** Stores one edited text in the landing page document. */
export async function updateHomePageText(
  rawPath: unknown,
  rawValue: unknown,
): Promise<ContentUpdate> {
  if (typeof rawPath !== 'string') {
    return { ok: false, status: 400, error: 'Pfad fehlt.' };
  }
  if (typeof rawValue !== 'string') {
    return { ok: false, status: 400, error: 'Text fehlt.' };
  }

  const segments = parseContentPath(rawPath);
  if (!segments) {
    return { ok: false, status: 400, error: 'Ungültiger Pfad.' };
  }

  const key = segments[segments.length - 1];
  if (!EDITABLE_KEYS.has(key)) {
    return { ok: false, status: 403, error: 'Dieses Feld ist nicht bearbeitbar.' };
  }

  const value = rawValue.replace(/\r\n/g, '\n').replace(/\s+$/, '');
  if (value.length > MAX_TEXT_LENGTH) {
    return {
      ok: false,
      status: 400,
      error: 'Text ist zu lang (maximal ' + MAX_TEXT_LENGTH + ' Zeichen).',
    };
  }

  try {
    const db = await getDb();
    const collection = db.collection<PageDocument>(PAGE_COLLECTION);
    let doc = (await collection.findOne({ _id: HOME_PAGE_ID })) as PageDocument | null;

    if (!doc) {
      const seed = buildSeedPage();
      await collection.insertOne(seed);
      doc = seed;
    }

    if (getStringAtPath(doc, segments) === null) {
      return { ok: false, status: 404, error: 'Textstelle nicht gefunden.' };
    }

    const updatedAt = new Date();
    await collection.updateOne(
      { _id: HOME_PAGE_ID },
      { $set: { [segments.join('.')]: value, updatedAt } },
    );

    return { ok: true, path: segments.join('.'), value, updatedAt: updatedAt.toISOString() };
  } catch (error) {
    dbUnavailableUntil = Date.now() + 15_000;
    // eslint-disable-next-line no-console
    console.warn('[content] Speichern fehlgeschlagen:', (error as Error).message);
    return {
      ok: false,
      status: 503,
      error: 'Inhalte können gerade nicht gespeichert werden. Bitte später erneut versuchen.',
    };
  }
}
