import { FastifyInstance } from 'fastify';

const SITE_URL = process.env.SITE_URL ?? 'https://www.freischule.info';

const STATIC_PATHS = [
  '/',
  '/impressum',
  '/datenschutz',
  '/barrierefreiheit',
];

export function registerMiscRoutes(app: FastifyInstance): void {
  app.get('/sitemap.xml', async (_request, reply) => {
    const urls = STATIC_PATHS.map(
      (p) => `  <url><loc>${SITE_URL}${p}</loc></url>`,
    ).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
    reply.header('Content-Type', 'application/xml').send(xml);
  });

  app.get('/robots.txt', async (_request, reply) => {
    const body = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;
    reply.header('Content-Type', 'text/plain').send(body);
  });
}
