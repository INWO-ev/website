import { FastifyInstance } from 'fastify';
import { getHomePage } from '../contentStore.js';
import { getChatDisclaimer, getSuggestedQuestions } from '../chat.js';

interface NavContent {
  brand: string;
  brandSub: string;
  anchors: { id: string; label: string }[];
  ctaLabel: string;
  ctaHref: string;
  overlayLinks: { label: string; href: string }[];
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
      events: page.events,
      posts: page.posts,
      videos: page.videos,
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
