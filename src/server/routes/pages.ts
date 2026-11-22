import path from 'node:path';
import { FastifyInstance } from 'fastify';
import { getHomePage } from '../contentStore.js';
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
    // The whole page content is one MongoDB document; it is read on every
    // request so edits are visible immediately without a restart.
    const page = await getHomePage();
    const nav = page.nav as NavContent;

    const sections = {
      hero: page.hero,
      zins: page.zins,
      boden: page.boden,
      zukunft: page.zukunft,
      inwo: page.inwo,
      stimmen: page.stimmen,
      aktuell: page.aktuell,
      mehr: page.mehr,
      mitmachen: page.mitmachen,
    };

    const aktuellData = {
      events: loadJsonFile('events.json'),
      posts: loadJsonFile('posts.json'),
      videos: loadJsonFile('videos.json'),
    };

    return reply.view('index.njk', {
      title: page.title,
      description: page.description,
      nav,
      footer: page.footer,
      facts: page.facts,
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
      const page = await getHomePage();
      return reply.view(templateName, { title, nav: page.nav, footer: page.footer });
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
