import path from 'node:path';
import { FastifyInstance } from 'fastify';
import { DATA_DIR } from '../paths.js';
import { readJsonFile } from '../jsonFile.js';
import { answerMockChat, MAX_MESSAGE_LENGTH } from '../chat.js';
import { InMemoryRateLimiter } from '../rateLimit.js';

function readSeedFile(fileName: string): unknown {
  return readJsonFile(path.join(DATA_DIR, fileName));
}

// Spec section 8.3: rate limit chat requests per IP to limit abuse / cost.
const chatRateLimiter = new InMemoryRateLimiter(20, 60_000);

export function registerApiRoutes(app: FastifyInstance): void {
  app.get('/api/events', async (_request, reply) => {
    reply.send(readSeedFile('events.json'));
  });

  app.get('/api/posts', async (_request, reply) => {
    reply.send(readSeedFile('posts.json'));
  });

  app.get('/api/videos', async (_request, reply) => {
    reply.send(readSeedFile('videos.json'));
  });

  app.post<{ Body: { message?: unknown } }>('/api/chat', async (request, reply) => {
    const clientKey = request.ip ?? 'unknown';
    if (!chatRateLimiter.check(clientKey)) {
      return reply.status(429).send({
        error: 'Zu viele Anfragen. Bitte warte kurz und versuche es erneut.',
      });
    }

    const message = request.body?.message;
    if (typeof message !== 'string' || message.trim().length === 0) {
      return reply.status(400).send({ error: 'Bitte gib eine Nachricht ein.' });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return reply.status(400).send({
        error: `Nachricht ist zu lang (maximal ${MAX_MESSAGE_LENGTH} Zeichen).`,
      });
    }

    const { answer, source } = answerMockChat(message);
    return reply.send({ answer, source });
  });
}
