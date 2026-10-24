# INWO

Dies ist die Webseite der INWO mit moderner Landingpage. Später kommt auch
ein Mitglieder-Login, eine Mitgliederverwaltung und vielleicht eine
Buchhaltungsanbindung.

Die vollständige Spezifikation steht in
[`material/INWO_Landingpage_Spezifikation.md`](material/INWO_Landingpage_Spezifikation.md)
und ist die Quelle der Wahrheit für Inhalte, Design und Umfang. Offene
Entscheidungen und Annahmen der Umsetzung stehen in
[`docs/OFFENE_PUNKTE.md`](docs/OFFENE_PUNKTE.md).

## Status

**Phase 1** (Landingpage-Prototyp) ist umgesetzt: die One-Page-Startseite
mit allen Abschnitten aus Spezifikation 5.1–5.9, fixiertem Menü,
Scroll-Fortschrittsstreifen, Reveal-Animationen und dem Gesell-Bot-Mockup.
Admin-Oberfläche, Mitgliederverwaltung und echtes RAG folgen in späteren
Phasen (Spezifikation Abschnitt 12).

## Architektur

- **Server:** Node.js 20, TypeScript, [Fastify](https://fastify.dev/)
- **Templates:** serverseitig gerendert mit [Nunjucks](https://mozilla.github.io/nunjucks/) (`src/views/`) – die Seite ist ohne JavaScript lesbar
- **Inhalte:** versionierte JSON-Dateien in `src/content/` (Startseiten-Texte) und `data/` (Seed-Daten für Events/Beiträge/Videos/Chat-Mockup)
- **Frontend:** Vanilla-CSS/JS-Module in `src/client/`, kein Framework
- **Datenbank:** MongoDB ist über Docker Compose vorbereitet (Treiber in `package.json`), wird in Phase 1 aber noch nicht für Inhalte benötigt
- **Tests:** [Vitest](https://vitest.dev/) (`tests/`), Fastify-Routen über `app.inject()`

## Setup

```bash
npm install
cp .env.example .env
npm run dev        # Dev-Server mit Live-Reload auf http://localhost:4100
```

### Mit Docker Compose

```bash
docker compose up --build
```

### Scripts

| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver (tsx watch) |
| `npm run build` | TypeScript-Build nach `dist/` |
| `npm start` | Production-Server aus `dist/` |
| `npm test` | Vitest-Testsuite |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Verzeichnisstruktur

```
src/
  server/    Fastify-App, Routen, Content-Loader, Chat-Mockup-Logik
  views/     Nunjucks-Templates (layout + partials pro Abschnitt)
  content/   Versionierte Texte der Startseite (JSON, Deutsch)
  client/    CSS- und JS-Module (vanilla, keine Build-Pipeline nötig)
data/        Seed-Daten: events.json, posts.json, videos.json, mock-bot.json
public/      Statische Platzhalter-Assets
tests/       Vitest-Tests
docs/        OFFENE_PUNKTE.md
material/    Spezifikation und Ausgangstexte der INWO
```
