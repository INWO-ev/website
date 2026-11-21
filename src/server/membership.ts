export interface Mitgliedsantrag {
  mitgliedschaft: 'mitglied' | 'foerdermitglied';
  anrede: string;
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  strasse: string;
  plz: string;
  ort: string;
  land: string;
  email: string;
  telefon: string;
  beitrag: string;
  nachricht: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function slice(value: string, max: number): string {
  return value.slice(0, max);
}

export function parseMitgliedsantrag(
  body: Record<string, unknown>,
): { ok: true; data: Mitgliedsantrag } | { ok: false; error: string } {
  const vorname = str(body.vorname);
  const nachname = str(body.nachname);
  const strasse = str(body.strasse);
  const plz = str(body.plz);
  const ort = str(body.ort);
  const email = str(body.email).toLowerCase();

  if (!vorname || !nachname || !strasse || !plz || !ort || !email) {
    return { ok: false, error: 'Bitte fülle alle Pflichtfelder aus.' };
  }
  if (vorname.length > 100 || nachname.length > 100 || strasse.length > 200 || ort.length > 100) {
    return { ok: false, error: 'Ein Feld ist zu lang.' };
  }
  if (plz.length > 10) {
    return { ok: false, error: 'Bitte gib eine gültige Postleitzahl ein.' };
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { ok: false, error: 'Bitte gib eine gültige E-Mail-Adresse ein.' };
  }

  const mitgliedschaft = body.mitgliedschaft === 'mitglied' ? 'mitglied' : 'foerdermitglied';

  return {
    ok: true,
    data: {
      mitgliedschaft,
      anrede: slice(str(body.anrede), 40),
      vorname,
      nachname,
      geburtsdatum: slice(str(body.geburtsdatum), 10),
      strasse,
      plz,
      ort,
      land: slice(str(body.land), 80) || 'Deutschland',
      email,
      telefon: slice(str(body.telefon), 40),
      beitrag: slice(str(body.beitrag), 100),
      nachricht: slice(str(body.nachricht), 2000),
    },
  };
}

export function applicationToText(data: Mitgliedsantrag): string {
  const art = data.mitgliedschaft === 'mitglied' ? 'Vollmitglied' : 'Fördermitglied';
  return [
    'Mitgliedschaftsart: ' + art,
    'Anrede: ' + (data.anrede || '-'),
    'Name: ' + data.vorname + ' ' + data.nachname,
    'Geburtsdatum: ' + (data.geburtsdatum || '-'),
    'Adresse: ' + data.strasse + ', ' + data.plz + ' ' + data.ort + ' (' + data.land + ')',
    'E-Mail: ' + data.email,
    'Telefon: ' + (data.telefon || '-'),
    'Beitrag: ' + (data.beitrag || '-'),
    'Nachricht: ' + (data.nachricht || '-'),
  ].join('\n');
}
