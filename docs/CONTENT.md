# Inhalte der Landingpage bearbeiten

Alle Texte und Sektionen der Startseite liegen in **einem einzigen
MongoDB-Dokument**:

- Datenbank: die Datenbank aus `MONGODB_URI` (aktuell `inwo`)
- Collection: `pages`
- Dokument: `_id: "home"`
- Redaktioneller Zeitstempel: `updatedAt`

## Ablauf

1. `GET /` liest das Dokument bei **jedem** Seitenaufruf und baut die Seite
   daraus (kein Serverneustart nach Änderungen nötig).
2. Jeder bearbeitbare Text trägt `data-edit-path="…"` und ein kleines
   Bleistift-Icon. Ein Klick öffnet einen Dialog mit Textfeld.
3. Speichern ruft `PATCH /api/content` mit
   `{ "path": "zins.intro", "value": "…" }` auf. Serverseitig wird per
   `$set` genau dieses Textfeld im Dokument aktualisiert.
4. Die JSON-Dateien in `src/content/` sind nur der **Seed** für den ersten
   Start und der **Fallback**, falls MongoDB nicht erreichbar ist. Sie
   werden nie zurückschrieben.

## Dokumentstruktur

```
{
  _id: "home",
  title, description,          // Seitentitel & Meta-Description
  updatedAt,
  nav:      { brand, brandSub, anchors[], ctaLabel, overlayLinks[] },
  footer:   { contact{}, spenden{}, newsletter{}, social{}, links[], … },
  facts:    { … },             // Quellenangaben zu Statistiken
  hero:     { eyebrow, headline, subline, intro, primaryCta, secondaryCta },
  zins:     { title, intro, scenes[], faq[], faqHeading, readMore },
  boden:    { title, intro, statusNote, scenes[], readMore, callRef },
  zukunft:  { title, intro, stations[], schluss, sourceNote },
  inwo:     { title, intro, pitchVideo, theories[] },
  stimmen:  { enabled, title, intro, testimonials[] },
  aktuell:  { title, events, posts, videos },
  mehr:     { title, intro, tiles[] },
  mitmachen:{ title, intro, paths[], calls[], newsletter, foerdermitglied, spenden }
}
```

Pfade für den Editor sind Dot-Pfade mit Array-Indizes, z. B.
`zins.scenes.0.text` oder `mitmachen.calls.2.ctaLabel`.

## Erlaubte Felder

Nur Textfelder aus einer festen Whitelist (Überschriften, Fließtexte,
Labels, Fragen/Antworten, Kontakt-/Footer-Texte, Faktenwerte) sind
änderbar. Struktur, Links (`href`), Theme-Flags, `enabled`, `_id` und
dergleichen bleiben unter Code-Kontrolle. Zusätzlich gilt:

- maximal 5.000 Zeichen pro Feld
- nur existierende String-Felder im Dokument
- 120 Änderungen pro IP und 10 Minuten
- HTML wird beim Rendern durch Nunjucks escaped (kein Markup-Injection)

## Sicherheit / nächster Schritt

Wie gewünscht ist Bearbeiten in dieser Phase **für alle offen** – es gibt
noch keine Anmeldung. Das ist bewusst nur ein Zwischenstand; sobald das
UserManagement steht, wird `PATCH /api/content` hinter Login und Rollen
gelegt (Editor/Admin). Bis dahin sollte die Seite nicht breit beworben
werden.

## Dokument neu aufsetzen (Reset)

Dokument löschen und Seite neu aufrufen – der Seed aus
`src/content/*.json` wird dann neu eingespielt:

```bash
docker exec mongodb mongosh -u inwo -p "$MONGO_PASSWORD" \
  --authenticationDatabase inwo --quiet \
  --eval 'db.getSiblingDB("inwo").pages.deleteOne({_id:"home"})'
curl -s http://127.0.0.1:4100/ > /dev/null
```

(Passwort nicht im Klartext in Shell-History schreiben; `MONGODB_URI`
aus `.env` nutzen.)
