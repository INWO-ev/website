import { FastifyInstance } from 'fastify';
import { answerMockChat, MAX_MESSAGE_LENGTH } from '../chat.js';
import { InMemoryRateLimiter } from '../rateLimit.js';
import { getHomePage, updateHomePageText } from '../contentStore.js';

// Spec section 8.3: rate limit chat requests per IP to limit abuse / cost.
const chatRateLimiter = new InMemoryRateLimiter(20, 60_000);

// Editing is intentionally open in this phase (no user management yet), so a
// generous rate limit keeps the endpoint from being hammered.
const contentEditRateLimiter = new InMemoryRateLimiter(120, 10 * 60_000);

export function registerApiRoutes(app: FastifyInstance): void {
  app.get('/api/events', async (_request, reply) => {
    const page = await getHomePage();
    reply.send(page.events);
  });

  app.get('/api/posts', async (_request, reply) => {
    const page = await getHomePage();
    reply.send(page.posts);
  });

  app.get('/api/videos', async (_request, reply) => {
    const page = await getHomePage();
    reply.send(page.videos);
  });

  app.get('/api/content', async (_request, reply) => {
    reply.send(await getHomePage());
  });

  app.patch<{ Body: { path?: unknown; value?: unknown } }>(
    '/api/content',
    async (request, reply) => {
      const clientKey = request.ip ?? 'unknown';
      if (!contentEditRateLimiter.check(clientKey)) {
        return reply.status(429).send({
          error: 'Zu viele Änderungen. Bitte warte kurz und versuche es erneut.',
        });
      }

      const result = await updateHomePageText(request.body?.path, request.body?.value);
      if (!result.ok) {
        return reply.status(result.status).send({ error: result.error });
      }

      return reply.send(result);
    },
  );

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
        error: 'Nachricht ist zu lang (maximal ' + MAX_MESSAGE_LENGTH + ' Zeichen).',
      });
    }

    const { answer, source } = answerMockChat(message);
    return reply.send({ answer, source });
  });
}
