import path from 'node:path';
import { FastifyInstance } from 'fastify';
import { loadContent } from '../content.js';
import { DATA_DIR } from '../paths.js';
import { readJsonFile } from '../jsonFile.js';
import { getChatDisclaimer, getSuggestedQuestions } from '../chat.js';

interface NavContent {
  brand: string;
  brandSub: string;
  anchors: { id: string; label: string }[];
  ctaLabel: string;
  ctaHref: string;
  overlayLinks: { label: string; href: string }[];
}

function loadJsonFile<T>(fileName: string): T {
  return readJsonFile<T>(path.join(DATA_DIR, fileName));
}

export function registerPageRoutes(app: FastifyInstance): void {
  app.get('/', async (_request, reply) => {
    const nav = loadContent<NavContent>('nav');
    const footer = loadContent('footer');
    const facts = loadContent('facts');

    const sections = {
      hero: loadContent('hero'),
      zins: loadContent('zins'),
      boden: loadContent('boden'),
      zukunft: loadContent('zukunft'),
      inwo: loadContent('inwo'),
      stimmen: loadContent('stimmen'),
      aktuell: loadContent('aktuell'),
      mehr: loadContent('mehr'),
      mitmachen: loadContent('mitmachen'),
    };

    const aktuellData = {
      events: loadJsonFile('events.json'),
      posts: loadJsonFile('posts.json'),
      videos: loadJsonFile('videos.json'),
    };

    return reply.view('index.njk', {
      title: 'Fairconomy – INWO',
      description:
        'Fairconomy: die INWO setzt sich für eine faire Geld- und Bodenordnung ein – einfach, wirksam, gerecht.',
      nav,
      footer,
      facts,
      sections,
      aktuellData,
      chat: {
        disclaimer: getChatDisclaimer(),
        suggestedQuestions: getSuggestedQuestions(),
      },
    });
  });

  const placeholderPage = (
    routePath: string,
    templateName: string,
    title: string,
  ): void => {
    app.get(routePath, async (_request, reply) => {
      const nav = loadContent('nav');
      const footer = loadContent('footer');
      return reply.view(templateName, { title, nav, footer });
    });
  };

  placeholderPage('/impressum', 'impressum.njk', 'Impressum – Fairconomy');
  placeholderPage('/datenschutz', 'datenschutz.njk', 'Datenschutz – Fairconomy');
  placeholderPage(
    '/barrierefreiheit',
    'barrierefreiheit.njk',
    'Barrierefreiheitserklärung – Fairconomy',
  );
}
