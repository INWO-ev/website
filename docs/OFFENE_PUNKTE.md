# Offene Punkte / Entscheidungen

Quelle: `material/INWO_Landingpage_Spezifikation.md` Abschnitt 11, ergänzt um
Annahmen aus der Phase-1-Umsetzung. Alle `[TEXT FOLGT]`- und
`[ENTSCHEIDUNG]`-Markierungen im Code (`src/content/*.json`) verweisen auf
diese Liste.

| # | Punkt | Wer entscheidet | Status Phase 1 |
|---|-------|-----------------|-----------------|
| 1 | Verlauf: Original (`#033c73 100%`) oder dreistufig (`50%`)? | INWO | Original als Default aktiv, beide Varianten als CSS-Variable angelegt (`--inwo-gradient`, `--inwo-gradient-3stufig`) |
| 2 | Akzentfarbe für CTAs | INWO / Design | Platzhalter `#e8452c` verwendet, nur als Button-Hintergrund (nicht als Fließtextfarbe wegen Kontrast) |
| 3 | Finale Headline, Subline, Button-Beschriftung | INWO | Entwurf aus Spezifikation 5.1 übernommen, als Entwurf markiert |
| 4 | Boden-Texte (vier Szenen) | INWO | Entwurfstexte aus den Stichpunkten der Spezifikation 5.3 erstellt, `status: "entwurf"` im Content |
| 5 | Quelle für „reichste 10 % gewinnen“; Herleitung der Zinsanteil-Schätzung verlinken | INWO | Als offene Quelle markiert in `src/content/facts.json` (`zinsgewinner`) |
| 6 | Tonalität der Zukunftstexte für Erstbesucher (sachlicher oder Originalton) | INWO | **Annahme der Umsetzung:** sachlichere Fassung für die Startseite gewählt (Begriffe wie „Revolution“, „Selbstbereicherung“, „desaströse Herrschaft“ gedämpft), Originalton bleibt in `material/Eine freie Welt.txt` für die Hefte erhalten. INWO muss diese Annahme bestätigen. |
| 7 | Kurztexte zu den vier Theorien | INWO | Platzhalter in `src/content/inwo.json` |
| 8 | Zeile aus „Taler, Taler, du musst wandern“ für Zins-Szene 4 | INWO | Platzhalter in `src/content/zins.json` |
| 9 | Pitch-Video: Drehbuch, Hosting (selbst oder YouTube) | INWO | Button vorhanden, kein Video eingebunden |
| 10 | YouTube-Kanäle und Channel-IDs | INWO | Platzhalter in `data/videos.json` |
| 11 | Stimmen mit Foto und Einwilligung | INWO | Abschnitt per Feature-Flag deaktiviert (`enabled: false` in `src/content/stimmen.json`), keine Dummy-Zitate veröffentlicht |
| 12 | GSAP erlaubt oder nur CSS/IO? (nach Prototyp) | Kurt | Phase 1 ohne GSAP umgesetzt (CSS Scroll-Driven Animation + IntersectionObserver reichen für die aktuelle Dramaturgie) |
| 13 | Gesell-Bot: Quellausgaben/Rechte, Wiederverwendung des bestehenden RAG-Konzepts, KI-Anbieter und AVV | Kurt / INWO | Nur Mockup mit statischem `data/mock-bot.json` umgesetzt, kein echtes RAG |
| 14 | Newsletter-/Mailversand: eigener Server oder Dienstleister (AVV) | Kurt | Formular vorhanden, kein Versand implementiert (Phase 2) |
| 15 | Buchhaltung: selbst bauen oder bestehende Vereinssoftware anbinden | Vorstand / Kurt | nicht Teil von Phase 1 |
| 16 | Redaktioneller Workflow: nur Admin-Oberfläche oder auch Git? | Kurt / Redaktion | nicht Teil von Phase 1 |

## Nachträgliche Entscheidungen von Kurt (nach Phase-1-Review)

- **DE|EN-Sprachumschalter entfernt:** Abschnitt 10.5 der Spezifikation sah
  eine vorbereitete Mehrsprachigkeit vor; Kurt hat entschieden, darauf zu
  verzichten (Besucher übersetzen sich die Seite selbst). Der Umschalter im
  Menü wurde ersatzlos durch den Dark/Light-Toggle ersetzt.
- **Seitenweiter Dark/Light-Modus ergänzt:** Zusätzlich zum abwechselnden
  Hell/Dunkel-Rhythmus der Abschnitte (Abschnitt 2.1/5) gibt es jetzt einen
  Umschalter im Menü, der die ganze Seite auf ein durchgehend dunkles
  Farbschema stellt (Standard) bzw. auf das ursprüngliche helle Schema
  zurückschaltet. Die Wahl wird per `localStorage` gemerkt.

## Weitere offene Fakten (Abschnitt 6 der Spezifikation)

- Tagesgeldzinsen sind zeitgebunden und müssen vor Livegang neu geprüft werden.
- Die Aussage „30–40 % des BIP fließen in den Finanzsektor“ wurde **nicht**
  übernommen (laut Spezifikation nicht haltbar).
- Alle Statistik-Aussagen tragen `stand` und `quelle` in
  `src/content/facts.json` und werden im Rendering als Fußnote angezeigt.
