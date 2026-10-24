import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/server/app';

describe('page routes', () => {
  let app: FastifyInstance;

  beforeAll(() => {
    app = buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / renders the one-page landing page with all section anchors', async () => {
    const response = await app.inject({ method: 'GET', url: '/' });
    expect(response.statusCode).toBe(200);
    for (const anchor of ['start', 'zins', 'boden', 'zukunft', 'inwo', 'aktuell', 'mehr', 'mitmachen']) {
      expect(response.body).toContain(`id="${anchor}"`);
    }
  });

  it('GET / hides the testimonials section when disabled', async () => {
    const response = await app.inject({ method: 'GET', url: '/' });
    expect(response.body).not.toContain('id="stimmen"');
  });

  it('GET /impressum, /datenschutz, /barrierefreiheit respond with 200', async () => {
    for (const path of ['/impressum', '/datenschutz', '/barrierefreiheit']) {
      const response = await app.inject({ method: 'GET', url: path });
      expect(response.statusCode).toBe(200);
    }
  });

  it('GET /unknown-route returns 404', async () => {
    const response = await app.inject({ method: 'GET', url: '/unknown-route' });
    expect(response.statusCode).toBe(404);
  });

  it('GET /sitemap.xml and /robots.txt respond with 200', async () => {
    const sitemap = await app.inject({ method: 'GET', url: '/sitemap.xml' });
    expect(sitemap.statusCode).toBe(200);
    expect(sitemap.headers['content-type']).toContain('xml');

    const robots = await app.inject({ method: 'GET', url: '/robots.txt' });
    expect(robots.statusCode).toBe(200);
  });
});

describe('api routes', () => {
  let app: FastifyInstance;

  beforeAll(() => {
    app = buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/events, /api/posts, /api/videos return arrays', async () => {
    for (const path of ['/api/events', '/api/posts', '/api/videos']) {
      const response = await app.inject({ method: 'GET', url: path });
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.json())).toBe(true);
    }
  });

  it('POST /api/chat matches a known keyword and returns a source', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: { message: 'Was ist Freigeld?' },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.answer).toContain('Gesell');
    expect(body.source).toBeTruthy();
  });

  it('POST /api/chat falls back politely for unmatched input', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: { message: 'xyzabc völlig unbekannte Eingabe' },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.source).toBeNull();
  });

  it('POST /api/chat rejects empty messages', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: { message: '' },
    });
    expect(response.statusCode).toBe(400);
  });

  it('POST /api/chat rejects messages over the length limit', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: { message: 'a'.repeat(1000) },
    });
    expect(response.statusCode).toBe(400);
  });

  it('POST /api/chat rate-limits excessive requests from the same client', async () => {
    let lastResponse;
    for (let i = 0; i < 25; i++) {
      lastResponse = await app.inject({
        method: 'POST',
        url: '/api/chat',
        payload: { message: 'Was ist Freigeld?' },
      });
    }
    expect(lastResponse?.statusCode).toBe(429);
  });
});
