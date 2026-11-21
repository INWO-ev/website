import { FastifyInstance, type FastifyReply } from 'fastify';
import { loadContent } from '../content.js';
import { getDb } from '../db.js';
import { prepareEmail } from '../mailer.js';
import { parseMitgliedsantrag, applicationToText } from '../membership.js';
import { InMemoryRateLimiter } from '../rateLimit.js';

// Max 5 Anträge pro Stunde und IP (Schutz vor Missbrauch).
const submitRateLimiter = new InMemoryRateLimiter(5, 60 * 60 * 1000);

function notifyEmail(): string {
  return process.env.NOTIFY_EMAIL ?? 'info@inwo.example';
}

function fromEmail(): string {
  return process.env.SMTP_FROM ?? 'no-reply@inwo.example';
}

function renderForm(
  reply: FastifyReply,
  opts: { success?: boolean; error?: string | null; values?: Record<string, string> },
): FastifyReply {
  const nav = loadContent('nav');
  const footer = loadContent('footer');
  return reply.view('mitgliedsantrag.njk', {
    title: 'Mitgliedsantrag – Fairconomy',
    description:
      'Online-Mitgliedsantrag der INWO – Mitglied werden oder Fördermitgliedschaft beantragen.',
    nav,
    footer,
    success: opts.success ?? false,
    error: opts.error ?? null,
    values: opts.values ?? {},
  });
}

export function registerMembershipRoutes(app: FastifyInstance): void {
  app.get('/mitgliedsantrag', async (_request, reply) => renderForm(reply, {}));

  app.post<{ Body: Record<string, unknown> }>('/mitgliedsantrag', async (request, reply) => {
    const body = request.body ?? {};
    const values = body as Record<string, string>;

    const clientKey = request.ip ?? 'unknown';
    if (!submitRateLimiter.check(clientKey)) {
      return renderForm(reply, {
        error: 'Zu viele Anfragen. Bitte warte kurz und versuche es erneut.',
        values,
      });
    }

    const parsed = parseMitgliedsantrag(body);
    if (!parsed.ok) {
      return renderForm(reply, { error: parsed.error, values });
    }

    if (!body.datenschutz) {
      return renderForm(reply, {
        error: 'Bitte stimme der Verarbeitung deiner Daten zu.',
        values,
      });
    }

    try {
      const db = await getDb();
      await db.collection('mitgliedsantraege').insertOne({
        ...parsed.data,
        datenschutzZustimmung: true,
        status: 'neu',
        submittedAt: new Date(),
      });
    } catch (error) {
      console.error('Mitgliedsantrag speichern fehlgeschlagen:', error);
      return renderForm(reply, {
        error: 'Das Speichern ist fehlgeschlagen. Bitte versuche es später erneut.',
        values,
      });
    }

    // E-Mail-Vorbereitung ist best-effort und blockiert den Erfolg nicht.
    try {
      const name = parsed.data.vorname + ' ' + parsed.data.nachname;
      await prepareEmail({
        to: notifyEmail(),
        from: fromEmail(),
        subject: 'Neuer Mitgliedsantrag: ' + name,
        text:
          'Ein neuer Mitgliedsantrag wurde über die Website eingereicht.\n\n' +
          applicationToText(parsed.data),
      });
      await prepareEmail({
        to: parsed.data.email,
        from: fromEmail(),
        subject: 'Dein Mitgliedsantrag bei der INWO',
        text:
          'Hallo ' +
          parsed.data.vorname +
          ',\n\nwir haben deinen Mitgliedsantrag erhalten. Wir melden uns in Kürze bei dir.\n\nViele Grüße\nINWO',
      });
    } catch (error) {
      console.error('E-Mail-Vorbereitung fehlgeschlagen:', error);
    }

    return renderForm(reply, { success: true });
  });
}
