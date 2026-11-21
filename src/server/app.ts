import path from 'node:path';
import Fastify, { FastifyInstance } from 'fastify';
import fastifyFormbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import nunjucks from 'nunjucks';
import { VIEWS_DIR, CLIENT_DIR, PUBLIC_DIR } from './paths.js';
import { registerPageRoutes } from './routes/pages.js';
import { registerApiRoutes } from './routes/api.js';
import { registerMiscRoutes } from './routes/misc.js';
import { registerMembershipRoutes } from './routes/membership.js';

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: false });

  app.register(fastifyFormbody);

  app.register(fastifyView, {
    engine: { nunjucks },
    templates: VIEWS_DIR,
    options: { autoescape: true, noCache: process.env.NODE_ENV !== 'production' },
    production: process.env.NODE_ENV === 'production',
  });

  // Client assets (CSS/JS) and public placeholders are served as plain static files.
  app.register(fastifyStatic, {
    root: CLIENT_DIR,
    prefix: '/assets/',
    decorateReply: false,
  });

  app.register(fastifyStatic, {
    root: PUBLIC_DIR,
    prefix: '/public/',
    decorateReply: false,
  });

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).view('404.njk', { title: 'Seite nicht gefunden' });
  });

  registerPageRoutes(app);
  registerApiRoutes(app);
  registerMiscRoutes(app);
  registerMembershipRoutes(app);

  return app;
}

export function clientAssetPath(file: string): string {
  return path.posix.join('/assets', file);
}
