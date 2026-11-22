import { MongoClient, type Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export function getMongoUri(): string {
  return process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/inwo';
}

/** Lazily connects to MongoDB and returns the database named in the URI path. */
export async function getDb(): Promise<Db> {
  if (db) return db;

  const uri = getMongoUri();
  const candidate = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  try {
    await candidate.connect();
  } catch (error) {
    await candidate.close().catch(() => undefined);
    throw error;
  }

  client = candidate;
  db = candidate.db();
  return db;
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
