import path from 'node:path';
import { CONTENT_DIR } from './paths.js';
import { readJsonFile, clearJsonFileCache } from './jsonFile.js';

/**
 * Loads a JSON content file from src/content and caches it in memory.
 * Content files are versioned in Git (see spec section 9.4) and are the
 * source of truth for Phase 1 - no database round-trip needed.
 */
export function loadContent<T = unknown>(name: string): T {
  return readJsonFile<T>(path.join(CONTENT_DIR, `${name}.json`));
}

export function clearContentCache(): void {
  clearJsonFileCache();
}
