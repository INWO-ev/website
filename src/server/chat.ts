import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR } from './paths.js';

export interface MockBotEntry {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  source: string;
}

export interface MockBotData {
  disclaimer: string;
  fallback: string;
  entries: MockBotEntry[];
}

let cache: MockBotData | undefined;

function loadMockBotData(): MockBotData {
  if (!cache) {
    const filePath = path.join(DATA_DIR, 'mock-bot.json');
    cache = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as MockBotData;
  }
  return cache;
}

export const MAX_MESSAGE_LENGTH = 500;

/**
 * Phase 1 mockup: matches the visitor's message against a small keyword list
 * instead of a real RAG pipeline (see spec section 8.1/8.2). Replaced later
 * by POST /api/chat backed by vector search over INWO texts and Gesell's works.
 */
export function answerMockChat(message: string): {
  answer: string;
  source: string | null;
} {
  const data = loadMockBotData();
  const normalized = message.toLowerCase().trim();

  let best: MockBotEntry | undefined;
  let bestScore = 0;

  for (const entry of data.entries) {
    const score = entry.keywords.filter((kw) => normalized.includes(kw.toLowerCase())).length;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best && bestScore > 0) {
    return { answer: best.answer, source: best.source };
  }
  return { answer: data.fallback, source: null };
}

export function getChatDisclaimer(): string {
  return loadMockBotData().disclaimer;
}

export function getSuggestedQuestions(): string[] {
  return loadMockBotData().entries.slice(0, 4).map((entry) => entry.question);
}
