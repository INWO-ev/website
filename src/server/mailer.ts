import { getDb } from './db.js';

export interface PreparedEmail {
  to: string;
  from: string;
  subject: string;
  text: string;
  status: 'queued';
  createdAt: Date;
}

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT);
}

/**
 * Stores a ready-to-send email in the "email_outbox" collection instead of
 * sending it directly. SMTP server details are configured later (see
 * docs/OFFENE_PUNKTE.md point 14). Once SMTP_HOST/PORT are set, a sender job
 * can flush the outbox.
 */
export async function prepareEmail(input: {
  to: string;
  from: string;
  subject: string;
  text: string;
}): Promise<void> {
  const db = await getDb();
  const doc: PreparedEmail = {
    to: input.to,
    from: input.from,
    subject: input.subject,
    text: input.text,
    status: 'queued',
    createdAt: new Date(),
  };
  await db.collection('email_outbox').insertOne(doc);
}
