import fs from 'node:fs';

const cache = new Map<string, unknown>();

/**
 * Reads and parses a JSON file, caching the result by absolute path.
 * Shared by content.ts (src/content/*.json) and the seed-data routes
 * (data/*.json) so both read/caching logic lives in one place.
 */
export function readJsonFile<T = unknown>(filePath: string): T {
  const cached = cache.get(filePath);
  if (cached) return cached as T;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as T;
  cache.set(filePath, parsed);
  return parsed;
}

export function clearJsonFileCache(): void {
  cache.clear();
}
