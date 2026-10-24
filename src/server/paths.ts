import path from 'node:path';

// All paths are resolved relative to the project root (process.cwd()) so that
// both `tsx src/server/index.ts` (dev) and `node dist/server/index.js` (prod)
// find the same views/content/client/data directories without a copy step.
export const ROOT_DIR = process.cwd();
export const VIEWS_DIR = path.join(ROOT_DIR, 'src', 'views');
export const CONTENT_DIR = path.join(ROOT_DIR, 'src', 'content');
export const CLIENT_DIR = path.join(ROOT_DIR, 'src', 'client');
export const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
export const DATA_DIR = path.join(ROOT_DIR, 'data');
