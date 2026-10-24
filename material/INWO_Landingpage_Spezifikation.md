# INWO / Fairconomy – Neue Website: Spezifikation

> Arbeitsdokument für die Umsetzung mit Claude Code.
> Stand: 24.10.2026 · Status: Entwurf v0.1 · Sprache der Seite: Deutsch (Englisch vorbereiten)

---

## 0. Wie Claude Code mit diesem Dokument arbeiten soll

1. Lies zuerst das ganze Dokument, dann `docs/texte/` (Ausgangstexte) und `docs/referenz/` (Screenshots der alten Seite, Ideendokument von Sebastian).
2. Arbeite **phasenweise** (Abschnitt 12). Beginne mit Phase 1. Ohne Rückfrage nichts aus späteren Phasen vorwegnehmen.
3. Alles mit **[ENTSCHEIDUNG]** oder **[TEXT FOLGT]** ist offen. Trage dafür sinnvolle Platzhalter ein, fange aber **keine** eigenen Inhalte oder Fakten an. Sammle offene Punkte in `docs/OFFENE_PUNKTE.md`.
4. **Keine erfundenen Zahlen, Zitate oder Mitgliederstimmen.** Faktenaussagen nur aus Abschnitt 6 und 7 übernehmen, mit den dort genannten Kennzeichnungen.
5. Halte dich an Abschnitt 10 (Datenschutz, Barrierefreiheit, Performance). Das sind Abnahmekriterien, keine Wünsche.
6. Kleine, nachvollziehbare Git-Commits (Conventional Commits, Deutsch oder Englisch einheitlich). `README.md`, `.env.example` und Setup-Anleitung von Anfang an pflegen. Keine Geheimnisse im Repo.

---

## 1. Ziel und Kontext

**Auftraggeber:** INWO (Initiative für Natürliche Wirtschaftsordnung), Markenauftritt „Fairconomy".

**Ziel der Seite:** Besucher verstehen in wenigen Minuten, was die INWO fordert (Geldgebühr/Zinskritik, Bodenreform), warum, und wie sie mitmachen können. Die Seite löst die bisherige TYPO3-Seite ab.

**Zielgruppe:** Menschen, die auf passenden Veranstaltungen angesprochen wurden und Lesematerial erhalten haben. Wer die Adresse eingibt, hat bereits Interesse und etwas Vorwissen. Daraus folgt: kein Grundlagenkurs am Anfang, sondern schnell zum Kern (Zins, Boden), mit Tiefe zum Nachlesen.

**Zentrale Handlungsziele (in dieser Reihenfolge):**
1. Weiterlesen/Verstehen (Scroll bis Boden und Zukunft)
2. Newsletter abonnieren (niedrigschwellig)
3. Mitmachen: Fördermitglied werden oder aktiv mitarbeiten
4. Material und Hefte lesen, Veranstaltungen besuchen

**Messen:** Datenschutzfreundliche Statistik (Matomo selbst gehostet oder Plausible) mit Scrolltiefe pro Abschnitt, Klicks auf CTAs und Aufrufe über eigene Kurz-Links/QR-Codes aus Veranstaltungen (UTM-ähnliche Parameter, z. B. `?q=heft-zins`).

**Aus Sebastians Ideendokument übernommen** (siehe `docs/referenz/`):
- Großer, ruhiger Hero; „Fairconomy" nicht doppelt (Logo links oben, Schriftzug nur einmal im Text).
- Menü nicht als blauer Streifen unter dem Banner, sondern fest oben.
- Weniger Gleichrangiges: Aufruf-Kacheln, Bilder-Karussell und Werbeblöcke reduzieren oder auslagern.
- Magazin bekommt eine eigene Seite, Spendenaufruf in den Footer oder auf eine eigene Seite.
- Video im oder direkt unter dem Hero; Inhalt soll Interessenten „abholen" und pitchen.
- Konsistente Gestaltung, einheitliche Textanordnung, ansprechende Bilder in sichtbarer Größe.

**Bewusst anders als im Ideendokument:** Die vier politischen Aufrufe (Haltegebühr, Grundsteuer, CO₂-Abgabe, Zivile Sicherheitspolitik) werden nicht gestrichen, sondern in den Abschnitt „Mitmachen/Aufrufe" überführt (Abschnitt 5.9). Der dort vorgeschlagene generische Aufbau (Social-Proof-Zahlen, „Mitglied werden" als erster Button) wird nur übernommen, soweit echte Inhalte vorhanden sind.

---

## 2. Gestaltung (Design-Vorgaben)

### 2.1 Farben

Themenfarbe der INWO (Vorgabe, wörtlich):

```css
linear-gradient(#04519b, #033c73 100%, #02325f)
```

**Hinweis:** Weil die zweite Farbstufe bei `100%` liegt, hat die dritte (`#02325f`) keine sichtbare Wirkung; der Verlauf läuft effektiv von `#04519b` nach `#033c73`.
**[ENTSCHEIDUNG]** Gemeint war vermutlich ein dreistufiger Verlauf, z. B. `linear-gradient(#04519b, #033c73 50%, #02325f)`. Bis zur Klärung die Original-Zeile als Standard verwenden und beide Varianten als CSS-Variablen anlegen.

```css
:root {
  --inwo-blue-1: #04519b;
  --inwo-blue-2: #033c73;
  --inwo-blue-3: #02325f;
  --inwo-gradient: linear-gradient(#04519b, #033c73 100%, #02325f);
  --inwo-gradient-3stufig: linear-gradient(#04519b, #033c73 50%, #02325f);
  --accent: #e8452c;      /* [ENTSCHEIDUNG] Akzentfarbe für CTAs, vom roten Fairconomy-Schriftzug abgeleitet; Kontrast prüfen */
  --text-on-dark: #ffffff;
  --text-on-light: #1a1f26;
  --surface: #f5f7fa;
}
```

- Der **Primär-CTA** („Mitmachen") braucht hohen Kontrast zum Blau. Die Akzentfarbe ist ein Platzhalter und muss mit der INWO abgestimmt werden.
- Alle Farbkombinationen müssen **WCAG 2.1 AA** erreichen (Text mindestens 4,5:1, großer Text 3:1).
- Dunkle Abschnitte (blauer Verlauf) und helle Abschnitte (`--surface`/weiß) wechseln sich ab. Jede `<section>` bekommt `data-theme="dark"` oder `data-theme="light"`. Menü und Scroll-Streifen reagieren darauf (siehe 3.1).

### 2.2 Typografie

- Systemfonts oder **selbst gehostete** Webfonts (kein Google-Fonts-CDN, siehe Datenschutz). Eine serifenlose Schrift für Fließtext, optional eine markante Schrift für Überschriften.
- Fließtext mindestens 18 px, Zeilenlänge 60–75 Zeichen, großzügiger Zeilenabstand.
- Pro Animationseinheit **kurze Texte** (25–50 Wörter). Längeres kommt in aufklappbare Vertiefungen („Mehr dazu") oder auf Unterseiten.

### 2.3 Bildsprache

- Hero: ruhiges Naturbild (bisher: fließendes Wasser, passend zu „fließendes Geld"), Bildbereich so gewählt, dass Headline und Logo gut lesbar bleiben (Overlay mit dem Blauverlauf).
- Echte Gesichter statt Stockfotos bei Stimmen und Team.
- Bildformate WebP/AVIF mit Fallback, `srcset`, Lazy Loading unterhalb des Hero.
- Platzhalterbilder unter `public/img/placeholder/` bis echtes Material vorliegt.

---

## 3. Globale Elemente

### 3.1 Fest verankertes Menü (oben)

- **Fixiert am oberen Bildschirmrand** (`position: sticky` oder `fixed`), transparent über dem Hero, danach mit Hintergrund (`--inwo-gradient`) und leichtem Schatten. Beim Scrollen schmaler werden.
- Inhalt: **Logo links** (Fairconomy/INWO), in der Mitte 4–5 Anker (Zins · Boden · Zukunft · INWO · Aktuell), rechts **Button „Mitmachen"** (Akzentfarbe) und **DE | EN**-Umschalter.
- **Scroll-Spy:** Der aktuell sichtbare Abschnitt wird im Menü markiert (`IntersectionObserver`, `aria-current="true"`).
- **Anker-Sprünge:** `html { scroll-padding-top: <Menühöhe>; scroll-behavior: smooth; }`, bei `prefers-reduced-motion` ohne Smooth Scroll.
- Menü per Tastatur bedienbar, sichtbarer Fokus, **„Zum Inhalt springen"-Link** als erstes fokussierbares Element.

### 3.2 Hamburger-Icon (Menü-Symbol)

- Drei Striche in INWO-Blau, **ohne Hintergrund** (transparent), **rechts oben**, dezent und nicht aufdringlich. Öffnet ein **Vollbild-Overlay-Menü** mit allen Seiten (Startseite-Anker, Blog, Veranstaltungen, Hefte, Glossar, Spenden, Kontakt, Impressum).
- Auf kleinen Bildschirmen (< 900 px) ersetzt es die Anker in der Leiste, auf größeren bleibt es als Zugang zum vollständigen Menü.
- **Wichtig:** „Unsichtbar" ist als „unaufdringlich" zu verstehen, nicht als verborgen. Das Icon muss sichtbar, fokussierbar, mit `aria-label="Menü öffnen"`, `aria-expanded` und mindestens 44×44 px Klickfläche umgesetzt werden.
- **Kontrast-Falle:** Blaue Striche verschwinden auf blauem Hintergrund. Die Strichfarbe wechselt abhängig vom darunterliegenden Abschnitt (`data-theme`): auf dunklen Abschnitten weiß, auf hellen Abschnitten INWO-Blau.

### 3.3 Scroll-Fortschrittsstreifen

- Schmaler Streifen (3–4 px) am **oberen Rand direkt unter oder über dem Menü**, der mit dem Scrollen von links nach rechts wächst und zeigt, wie weit man auf der Seite ist.
- Farbe: Akzentfarbe oder Weiß, so dass er auf dem Blauverlauf sichtbar ist.
- Umsetzung: CSS Scroll-Driven Animation (`animation-timeline: scroll()`) mit JS-Fallback über `requestAnimationFrame`. Für Screenreader ausgeblendet (`aria-hidden="true"`).
- Optional: kleine Punkte oder Kapitelmarken am Streifen für die Hauptabschnitte, klickbar.

### 3.4 Footer

Kontakt, Spenden (mit Bankverbindung/IBAN und Link auf Spendenseite), Newsletter, Social/YouTube, Presse, Impressum, Datenschutz, Barrierefreiheitserklärung, Sitemap.

### 3.5 Immer erreichbar

- **Mitmachen-Button** dauerhaft im Menü (nicht nur am Seitenende).
- **Gesell-Chatbot** als schwebender Button unten rechts (siehe Abschnitt 8). Er darf den Mitmachen-Button und mobile Bedienelemente nicht überdecken.

---

## 4. Animationskonzept („Texte fliegen hinein")

**Prinzip:** Scroll-gesteuerte Szenen. Jede Szene hat eine klare Dramaturgie (Bild/Zahl, dann Satz, dann Pointe), nicht nur „Text gleitet ein".

**Technik (in dieser Reihenfolge der Präferenz):**
1. **CSS Scroll-Driven Animations** (`animation-timeline: view()`/`scroll()`) wo vom Browser unterstützt.
2. **IntersectionObserver** + CSS-Klassen als Fallback und für einfache Einblendungen.
3. **GSAP + ScrollTrigger** (selbst gehostet, nicht per CDN) nur für die aufwendigen Szenen (z. B. Zinsszene mit hochzählenden Zahlen), falls die ersten beiden nicht reichen. **[ENTSCHEIDUNG]** nach Prototyp in Phase 1.

**Regeln (verbindlich):**
- **Der Text steht im HTML**, nicht per JS erzeugt, und ist ohne JavaScript sichtbar und lesbar (Progressive Enhancement). Versteckt wird erst, wenn JS geladen ist (`html.js`).
- `prefers-reduced-motion: reduce` → keine Flug- oder Parallax-Effekte, nur sofortiges oder sehr sanftes Einblenden.
- Pro Abschnitt **ein** Bewegungsmuster (z. B. von links, von unten, Einblenden), keine Mischung aus allem.
- Texte dürfen nie unter dem fixierten Menü hängen bleiben. Animationen nur auf `transform` und `opacity` (GPU-freundlich), kein Layout-Thrashing.
- Auf Mobilgeräten kürzere Wege und weniger gleichzeitige Elemente. Ziel: 60 fps auf einem Mittelklasse-Smartphone.
- Pinning (Abschnitt „klebt" am Bildschirm, während Szenen wechseln) nur bei Zins und Boden und mit sinnvoller Scrolllänge (max. ca. 3 Bildschirmhöhen).

---

## 5. Seitenstruktur der Startseite (One-Page)

Reihenfolge von oben nach unten. Anker-IDs in Klammern.

| # | Abschnitt | Anker | Theme | Inhalt in einem Satz |
|---|-----------|-------|-------|----------------------|
| 5.1 | Hero | `#start` | dark | Headline, Subline, zwei Buttons, Video-Loop |
| 5.2 | Zins | `#zins` | light | Zinskritik in vier Szenen + Lösung Geldgebühr |
| 5.3 | Boden | `#boden` | dark | Bodenreform in vier Szenen |
| 5.4 | Zukunft | `#zukunft` | light | „Eine freie Welt mit Fairconomy" als gekürzter Ausblick |
| 5.5 | INWO | `#inwo` | dark | Kurzvorstellung + Pitch-Video |
| 5.6 | Stimmen | `#stimmen` | light | „Warum ich in der INWO bin" |
| 5.7 | Aktuell | `#aktuell` | light | Veranstaltungen, neueste Beiträge, YouTube |
| 5.8 | Weiter entdecken | `#mehr` | dark | Ressourcensteuer, Jobgarantie, Freischulen, ausgeglichene Handelsbilanz |
| 5.9 | Mitmachen | `#mitmachen` | dark | Drei Einstiegspfade, Aufrufe, Newsletter, Spenden |
| – | Footer | – | dark | siehe 3.4 |

### 5.1 Hero (`#start`)

- Vollbreit, mindestens 100 % der sichtbaren Höhe, ruhiger Hintergrund (Wasser-Loop oder Standbild), Overlay mit Blauverlauf für Lesbarkeit.
- **Headline (Vorschlag):** „Eine freie Welt mit Fairconomy" · **Subline:** „einfach – wirksam – gerecht" (bestehender Slogan) plus ein erklärender Satz zu INWO, Wer und Wie. **[TEXT FOLGT]** finale Fassung durch INWO.
- **Buttons:** Primär **„Mitmachen"** → `#mitmachen`; Sekundär **„Zukunftsausflug starten"** oder **„Mehr erfahren"** → `#zins`. **[ENTSCHEIDUNG]** Beschriftung.
- „Fairconomy" erscheint hier **einmal** als Logo oben links und einmal in der Headline, nicht zusätzlich als großer roter Schriftzug.
- **Hintergrundvideo:** stummer Loop, 10–15 s, `autoplay muted loop playsinline`, mit Standbild als Poster; auf Mobilgeräten und bei `prefers-reduced-motion` nur das Standbild. Kein Video, das etwas erklären muss.
- **Pitch-Video** (60–90 s, Abschnitt 5.5) wird **nicht** automatisch im Hero abgespielt.

### 5.2 Zins (`#zins`) – vier Szenen

Dramaturgie: Perspektive des Sparers, Kehrseite, Zahl, Lösung. Duzen. **Entwurfstexte** (INWO prüft und kürzt; Faktenhinweise in Abschnitt 6 beachten):

1. **Die Freude.** Du hast 100.000 € zusammengespart. Bei 3 % Zinsen sind das 3.000 € im Jahr. Darüber darfst du dich freuen, du hast verzichtet und vorgesorgt. Aber wie weit tragen 3.000 €? Vielleicht zwei Monate.
2. **Die Kehrseite.** Diese Zinsen müssen erst erarbeitet werden, von Unternehmen, Vermietern und Haushalten. Sie werden auf Preise und Mieten aufgeschlagen. Jeder Einkauf und jede Miete enthält einen Zinsanteil.
3. **Die Zahl.** Schätzungen kommen auf rund ein Drittel Zinsanteil im Durchschnitt der Preise (Schätzung, Herleitung hier nachlesen). Per Saldo gewinnen nur die vermögendsten etwa 10 % der Haushalte, alle anderen zahlen drauf, meist ohne es zu merken. **[QUELLE ERGÄNZEN]**
4. **Die Lösung.** Eine Gebühr auf Geld: 0,5 % im Monat, also 6 % im Jahr. Sie fällt nicht an, wenn du dein Geld ausgibst oder als Kredit verleihst. Hier einfügen: Zitat aus dem Kinderlied „Taler, Taler, du musst wandern" (Zeile liefert die INWO). Durch das größere Kreditangebot würde der Kreditzins nach der Theorie gegen 0 % sinken und mit ihm die Zinslast in den Preisen.

- Darunter eine **FAQ-Box** (Akkordeon): „Was passiert mit meinem Ersparten?", „Zahle ich dann 6 % Strafe?", „Wer bekommt die Gebühr?", „Hat so etwas schon funktioniert?" **[TEXT FOLGT]**
- Darunter ein Link „Ausführliche Begründung" mit **sprechender Beschriftung** (kein „Hier geht es zur ausführlichen Begründung" mehrfach).
- **Optional (Phase 2):** Zins-Rechner (Eingabe von Monatsausgaben, Ausgabe einer geschätzten Zinslast mit sichtbaren Annahmen, klar als Schätzung gekennzeichnet).

### 5.3 Boden (`#boden`) – vier Szenen

Gleiche Dramaturgie wie Zins, damit der Besucher das Muster wiedererkennt: Alltagsbild → Kehrseite → Zahl/Beispiel → Lösung. **[TEXT FOLGT]** (liefert INWO). Orientierung für den Inhalt:

- Lagebedingte Bodenrenten entstehen zu großen Teilen durch Gemeinschaftsleistungen (Verkehr, Bildung, Sicherheit, Kultur).
- Heute fließen sie überwiegend privat, Infrastruktur wird aus Lohn- und Verbrauchssteuern bezahlt.
- Vorschlag der INWO: Boden gehört allen, Nutzung bleibt weitgehend privat; Infrastruktur wird aus Bodenwertsteuer und Pachteinnahmen finanziert.
- Verbindung zum Aufruf „Grundsteuer: Zeitgemäß!" (Abschnitt 5.9).

### 5.4 Zukunft (`#zukunft`)

- Der Text „Eine freie Welt mit Fairconomy" (`docs/texte/eine-freie-welt.txt`) wird **gekürzt und in vier Stationen** gegliedert (Boden, Erde und Ressourcen, fließendes Geld, Außenwirtschaft/Bancor). **Pro Station höchstens 40–50 Wörter**, Vertiefung verlinkt (Hefte, Unterseiten).
- Einstieg: der „kleine Ausflug in die Zukunft" als Erzählrahmen; Schluss: „Aufbruch in ein Neues Morgen" überleitend zu `#mitmachen`.
- **Redaktionelle Hinweise zum Ausgangstext** (vor Übernahme korrigieren):
  - Tippfehler: „einZukunft", „Die weltweite Lage hat sich! komplett", „,Diese", „Gebühr auf Geld Die".
  - Offene Platzhalter: „[Link auf Heft zur Alterssicherung]", „[Link auf Heft zur Kriegswirtschaft]".
  - Vier identische Links „Hier geht es zur ausführlichen Begründung" durch sprechende Linktexte ersetzen.
  - **Tonalität für Neulinge prüfen:** Formulierungen wie „Revolution", „Selbstbereicherung von wenigen Vermögenden", „desaströse Herrschaft des US-Dollars" und „Rüstungsindustrie verstaatlicht" sind für Mitglieder motivierend, können Erstbesucher aber abschrecken. **[ENTSCHEIDUNG]** der INWO, ob die Startseite eine sachlichere Fassung bekommt und der Originalton in den Heften bleibt.
  - Der Bancor-Abschnitt (Leistungsbilanzen, Fremdschuldenverbot, Auslandsvermögenspositionen, Keynes) ist für Einsteiger zu dicht: ein Bild und ein Satz auf der Startseite, der Rest auf einer Unterseite.

### 5.5 INWO (`#inwo`)

- **Kurzvorstellung:** Wer wir sind, was wir wollen, wie wir arbeiten, wie wir uns finanzieren (Transparenz). **[TEXT FOLGT]**
- **Pitch-Video** (60–90 s), startet erst per Klick („Film ansehen"), mit Untertiteln. Ablauf als Vorschlag:
  1. 0–5 s Einstieg mit einer Frage oder einem Bild
  2. 5–25 s Ausgangsproblem als Alltagsbild
  3. 25–60 s Vision, die vier Bausteine mit je ca. 8 s
  4. 60–80 s Wer ist die INWO, was kann ich tun
- Einbindung: selbst gehostet (`<video>` mit `<track>` für Untertitel) **oder** YouTube mit **Zwei-Klick-Lösung** (siehe Datenschutz). **[ENTSCHEIDUNG]**
- Die vier Theorien/Grundlagen der INWO werden hier oder direkt davor als kompakte Karten gezeigt. **[TEXT FOLGT]** (Kurztexte liegen bei der INWO vor.)

### 5.6 Stimmen (`#stimmen`)

- 3–6 Karten: Foto, Name (oder Vorname), ein Satz „Warum ich dabei bin", optional Langfassung.
- **Nur echte Stimmen mit Einwilligung** (DSGVO, Bildrechte). Solange keine vorliegen, Abschnitt per Feature-Flag ausblenden und **keine Dummy-Zitate** veröffentlichen.

### 5.7 Aktuell (`#aktuell`)

Drei Spalten (mobil untereinander oder als Tabs):

1. **Veranstaltungskalender:** nächste 3 Termine (Datum, Titel, Ort/online, Link). „Alle Termine" → `/veranstaltungen`. iCal-Feed zum Abonnieren (`/veranstaltungen.ics`).
2. **Neueste Beiträge (Blog):** die letzten 2–3 Beiträge mit Bild, Titel, Anreißer, Datum. „Alle Beiträge" → `/blog`. RSS-Feed (`/blog/feed.xml`).
3. **YouTube:** neuestes Video je Kanal (Zwei-Klick-Einbindung). **[TEXT FOLGT]** Liste der Kanäle und Channel-IDs.

Inhalte kommen aus MongoDB (Abschnitt 9) und werden im Admin gepflegt.

### 5.8 Weiter entdecken (`#mehr`)

Kachelreihe mit je Titel, 1–2 Sätzen, Bild und Link zur Unterseite:
- Ressourcensteuer/Ressourcen-Dividende
- Jobgarantie als Sozialhilfe
- Freischulen (Weiterentwicklung der Freikonditorei)
- Ausgeglichene Handelsbilanz (Bancor)

Diese Themen sind bewusst **weit unten**. Wer bis hier scrollt, will mehr.

### 5.9 Mitmachen (`#mitmachen`)

- **Drei Einstiegspfade** (Karten):
  1. „Ich bin neu und will verstehen" → Einführung, Hefte, Video
  2. „Ich kenne Gesell und will mich vernetzen" → Veranstaltungen, Regionalgruppen, Newsletter
  3. „Ich will aktiv mitarbeiten" → Kontakt, Arbeitsgruppen, Fördermitgliedschaft
- **Aufrufe** (statt der alten vier Kacheln; je Titel, Kurztext, „Unterstützen"-Button, optional Unterschriftenzähler): Haltegebühr („Eine stabile Währung durch Haltegebühr auf Geld"), Grundsteuer („Zeitgemäß!"), sozialverträgliche CO₂-Abgabe durch Pro-Kopf-Rückverteilung, Zivile Sicherheitspolitik („Sicherheit neu denken"). **[TEXT FOLGT]** jeweils gekürzte Fassung.
- **Newsletter-Formular** (Double-Opt-in).
- **Fördermitglied werden** → Formular (Phase 3 mit Mitgliederverwaltung verknüpfen).
- **Spenden:** Verweis auf Spendenseite/Footer.

---

## 6. Faktenprüfung der Zins-Aussagen (verbindlich zu beachten)

Stand der Prüfung: 24.10.2026. Vor Veröffentlichung von der INWO final zu bestätigen.

| Aussage im Entwurf | Bewertung | Umgang auf der Seite |
|---|---|---|
| „100.000 € auf einem Tagesgeldkonto bringen 3.000 € im Jahr" | Der Marktdurchschnitt für Tagesgeld liegt aktuell bei etwa 1,7–1,8 %; Spitzenangebote um 4 % sind meist befristete Neukundenaktionen. | Formulieren als **„bei 3 % Zinsen"** (Beispielrechnung), nicht als Tagesgeld-Tatsache. |
| „Im Durchschnitt stecken 30–40 % Zinsen in den Produktpreisen" | Eine **Schätzung** (Creutz/monneta-Berechnung, für 2011 31–45 %), rechnerisch hergeleitet, unter Ökonomen umstritten. | Als **Schätzung** kennzeichnen, Herleitung verlinken, Jahr und Annahmen nennen. |
| „30–40 % des BIP fließen in den Finanzsektor" | **Nicht haltbar.** Der Finanzsektor macht in Deutschland nur einen einstelligen Prozentanteil der Bruttowertschöpfung aus (Schweiz als Finanzplatz: ca. 9 %). Zinszahlungen sind nicht gleich Einkommen des Finanzsektors. | **Streichen.** Nicht übernehmen. |
| „Nur die reichsten 10 % gewinnen vom Zinsspiel" | Vertretbar als Aussage zum **Zinssaldo nach Vermögensgruppen**, aber derzeit ohne Quelle. | Quelle ergänzen (Bundesbank-/Studiendaten) oder abschwächen. |
| „Geldgebühr von nur 0,5 %" | 0,5 % pro Monat = **6 % pro Jahr**. | Beides nennen („0,5 % im Monat, 6 % im Jahr"), das Wort „nur" weglassen. |
| „Kreditzins sinkt gegen 0 %" | Prognose der Theorie, kein Fakt. | Als **Erwartung** formulieren („würde … sinken"). |

Die Zahlen zu Tagesgeld sind zeitgebunden. **Umsetzungsregel:** Alle statistischen Angaben bekommen ein Feld `stand` (Datum) und `quelle` (URL) im Content-Modell und werden auf der Seite als Fußnote angezeigt.

---

## 7. Inhalts- und Tonregeln

- **Anrede:** Du (Texte „Eine freie Welt" duzen bereits). Der Zins-Entwurf wurde auf Du umgestellt.
- **Satzlänge kurz**, ein Gedanke pro Szene, Fachbegriffe (Bodenrente, Umlaufsicherung, Bancor) beim ersten Auftreten mit **Glossar-Tooltip**.
- **Behauptungen kennzeichnen:** Schätzung, Prognose, Position der INWO. Keine Formulierung, die Prognosen als Tatsachen darstellt.
- **Ausgewogenheit der Quellen:** Zahlen mit Quelle und Stand. Keine anonymen „Studien zeigen".
- **Politische Neutralität im Auftritt:** Die INWO vertritt Positionen. Die Seite kennzeichnet sie als solche („Die INWO fordert …").

---

## 8. Silvio-Gesell-KI-Gesprächsbot (Mockup in Phase 1, echte Funktion später)

**Ziel:** Besucher stellen Fragen und erhalten Antworten, die auf den Texten der Website und auf den Schriften Silvio Gesells beruhen, **mit Quellenangabe**.

### 8.1 Mockup (Phase 1, ohne Backend-KI)

- **Schwebender Button** unten rechts mit rundem Porträt von Silvio Gesell. Das Bild legt der Auftraggeber ins Repo: `public/img/silvio-gesell.jpg` (bis dahin neutrale Silhouette als Platzhalter, `alt` „Porträt Silvio Gesell").
- Klick öffnet ein **Chatfenster** (Dialog-Panel, `role="dialog"`, per Esc schließbar, Fokus-Falle, auf Mobil Vollbild).
- Kopfzeile mit Porträt und dem Titel **„Frag Gesell – KI-Assistent"**, darunter dauerhaft sichtbar: **„KI-Prototyp. Antworten beruhen auf Texten der INWO und auf Gesells Schriften und können Fehler enthalten."**
- Beispielfragen als Chips („Was ist Freigeld?", „Warum Bodenreform?", „Was ist der Bancor?").
- Antworten im Mockup kommen aus einer **statischen JSON-Datei** (`data/mock-bot.json`, 6–10 Beispielantworten mit Quellenlinks). Freitext fällt auf eine höfliche Standardantwort zurück („Das kann der Prototyp noch nicht beantworten").
- Die Chat-Komponente nutzt schon die **spätere API-Schnittstelle** (`POST /api/chat`), die im Mockup die JSON-Datei bedient. So muss die Oberfläche später nicht neu gebaut werden.

### 8.2 Zielarchitektur (spätere Phase)

- **RAG:** Texte der Website (aus MongoDB/Markdown) und die Werke Gesells werden in Abschnitte zerlegt, eingebettet und in einer Vektordatenbank (z. B. MongoDB Atlas Vector Search oder lokal) gespeichert. Die Antwort wird aus den gefundenen Abschnitten erzeugt.
- Konzeptionelle Basis ist das bereits besprochene RAG-Konzept (TYPO3-Chatbot über Gesells Schriften). **[ENTSCHEIDUNG]** was davon wiederverwendet wird.
- **Quellenangaben** (Werk, Kapitel/Seite oder Website-Link) bei jeder Antwort. Wenn nichts Passendes gefunden wird: ehrlich sagen, nicht erfinden.
- Gesells Werke sind gemeinfrei (gestorben 1930), **aber** konkrete Ausgaben, Transkriptionen und Übersetzungen können eigene Rechte haben. **[ENTSCHEIDUNG]** Quellausgaben klären.

### 8.3 Leitplanken

- **Kein Rollenspiel als Person.** Der Bot spricht **nicht** „als Gesell in der Ich-Form" und legt ihm keine Aussagen in den Mund, die er so nie getroffen hat. Er ist ein Assistent über Gesells Schriften und die INWO-Texte; wörtliche Zitate sind als solche markiert und belegt.
- **Transparenz:** Immer als KI erkennbar, mit Hinweis auf mögliche Fehler.
- **Datenschutz:** keine Speicherung personenbezogener Eingaben ohne Notwendigkeit, kurze Aufbewahrung von Protokollen (z. B. 30 Tage), Hinweis in der Datenschutzerklärung, **Auftragsverarbeitungsvertrag** mit dem KI-Anbieter, keine Eingabe sensibler Daten anregen.
- **Missbrauchsschutz:** Rate-Limit pro IP/Sitzung, Maximallänge der Eingabe, Kostenobergrenze pro Tag, Schutz gegen Prompt-Injection (Inhalte aus Dokumenten sind Daten, keine Anweisungen), Moderation unangemessener Anfragen.
- **Politische Haltung:** Bei Fragen, die über die gespeicherten Texte hinausgehen, weist der Bot darauf hin, anstatt Meinungen der INWO zu erfinden.

---

## 9. Technik

### 9.1 Stack (Vorschlag, **[ENTSCHEIDUNG]** bestätigen)

| Bereich | Vorschlag | Begründung |
|---|---|---|
| Laufzeit | Node.js (aktuelle LTS), TypeScript | Vorgabe des Auftraggebers, Typsicherheit |
| Server | **Fastify** (oder Express) | schlank, schnell, gute Plugin-Landschaft |
| Datenbank | **MongoDB** (offizieller Treiber, optional Mongoose) | Vorgabe des Auftraggebers |
| Templates | Serverseitig gerendert (z. B. Nunjucks/EJS oder Astro-SSR) | SEO, Geschwindigkeit, Inhalt auch ohne JS sichtbar |
| Frontend | **Vanilla JS-Module + CSS**, kein schweres SPA-Framework | wenig Ballast, volle Kontrolle über Animationen |
| Animation | CSS Scroll-Driven + IntersectionObserver, GSAP nur bei Bedarf | siehe Abschnitt 4 |
| Auth (Admin) | Sitzungen mit HTTP-only-Cookies, Passwort-Hashing (argon2), optional TOTP | später auch für Mitgliederbereich |
| Tests | Vitest/Node-Test (Unit), Playwright (E2E, Screenshots, a11y-Checks mit axe) | Qualitätsziel aus Abschnitt 10 |
| Betrieb | Docker Compose (App + MongoDB), Reverse Proxy mit TLS | reproduzierbar |

### 9.2 Repository-Struktur (Vorschlag)

```
/
├─ README.md
├─ docs/
│  ├─ INWO_Landingpage_Spezifikation.md   (dieses Dokument)
│  ├─ OFFENE_PUNKTE.md
│  ├─ texte/            (Ausgangstexte, z. B. eine-freie-welt.txt)
│  └─ referenz/         (Ideendokument, Screenshots der alten Seite)
├─ src/
│  ├─ server/           (Routen, Services, Auth)
│  ├─ views/            (Templates)
│  ├─ content/          (Abschnittstexte als Markdown/JSON, versionierbar)
│  └─ client/           (JS-Module, CSS)
├─ public/
│  ├─ img/ (placeholder/, silvio-gesell.jpg)
│  ├─ video/
│  └─ fonts/
├─ data/                (mock-bot.json, Seeds)
├─ tests/
├─ docker-compose.yml
└─ .env.example
```

### 9.3 Content-Modell (MongoDB-Sammlungen, Phase 2)

- `events`: titel, start, ende, ort, online-link, beschreibung, status (Entwurf/veröffentlicht), tags
- `posts`: titel, slug, teaser, inhalt (Markdown), bild, autor, veröffentlicht_am, status
- `videos`: kanal, videoId, titel, veröffentlicht_am, thumbnail (zwischengespeichert, Abruf per Hintergrundjob über die YouTube-Feeds)
- `testimonials`: name, text, foto, einwilligung (Datum), sichtbar
- `publications` (Hefte/Magazin): titel, beschreibung, cover, pdf, jahr
- `glossary`: begriff, kurztext, langtext, verweise
- `facts`: schlüssel, wert, einheit, stand, quelle (für Statistik-Aussagen, siehe Abschnitt 6)
- `sections`: texte der Startseite (de/en), Reihenfolge, Feature-Flags
- `users`/`members`: Phase 3
- `ledger`: Phase 4

### 9.4 Git-Versionierung

- **Code:** Git, Branch-Modell trunk-basiert (`main` + kurze Feature-Branches), Pull Requests mit Review, CI (Lint, Tests, Build).
- **Inhalte der Startseite** (`src/content/`) liegen als Dateien im Repo und sind damit **versioniert und nachvollziehbar**.
- **Redaktionelle Inhalte** (Events, Beiträge) liegen in MongoDB mit **Revisionsverlauf** je Dokument.
- **[ENTSCHEIDUNG]** ob Redakteure zusätzlich einen einfachen Git-Workflow (z. B. über eine Weboberfläche) nutzen sollen.

### 9.5 Schnittstellen

- `GET /api/events`, `GET /api/posts`, `GET /api/videos` (öffentlich, gecacht)
- `POST /api/newsletter` (Double-Opt-in), `POST /api/contact`
- `POST /api/chat` (Mockup in Phase 1, später RAG)
- `/veranstaltungen.ics`, `/blog/feed.xml`, `/sitemap.xml`
- Admin-Routen unter `/admin` (nur authentifiziert)

---

## 10. Nichtfunktionale Anforderungen (Abnahmekriterien)

### 10.1 Datenschutz (DSGVO/TTDSG)

- **Keine externen Ressourcen** beim Seitenaufruf: Schriften, Skripte, Bilder, Karten **selbst hosten**; kein Google Fonts, kein CDN.
- **YouTube:** Zwei-Klick-Lösung, erst nach Zustimmung wird `youtube-nocookie.com` geladen; davor nur Vorschaubild (lokal gespeichert) und Hinweistext.
- **Statistik:** selbst gehostet (Matomo) oder cookielos (Plausible) → kein Cookie-Banner nötig, solange keine einwilligungspflichtigen Dienste laufen. Nur technisch notwendige Cookies.
- Newsletter nur mit **Double-Opt-in**, Abmeldelink in jeder Mail, Protokollierung der Einwilligung.
- **Impressum, Datenschutzerklärung, Barrierefreiheitserklärung** als Pflichtseiten (Inhalt liefert die INWO bzw. Jurist).
- Daten von Mitgliedern (Phase 3/4) nur verschlüsselt übertragen, Zugriff protokolliert, Löschkonzept vorhanden.

### 10.2 Barrierefreiheit (WCAG 2.1 AA)

- Semantisches HTML (`header`, `nav`, `main`, `section` mit Überschriften, `footer`), logische Überschriftenhierarchie.
- Tastaturbedienung überall, sichtbarer Fokus, Skip-Link, ARIA nur wo nötig.
- Alternativtexte für Bilder, Untertitel für Videos, Transkript für das Pitch-Video.
- `prefers-reduced-motion` und `prefers-color-scheme` berücksichtigen.
- Automatisierte Prüfung (axe) in CI, manuelle Prüfung mit Screenreader vor Livegang.

### 10.3 Performance und Robustheit

- Ziele (Lighthouse mobil): Performance ≥ 90, LCP < 2,5 s, CLS < 0,1, INP < 200 ms.
- Hero-Bild/Video priorisiert laden, alles andere lazy. Gesamtgewicht der ersten Ansicht < 1 MB (ohne Hintergrundvideo).
- Seite bleibt **ohne JavaScript lesbar**. Fehlerzustände (Datenbank down) liefern eine statische Fallback-Version der Startseite.
- Responsives Layout (Mobile-first), getestet ab 320 px Breite.

### 10.4 SEO und Teilen

- Serverseitig gerendert, saubere Titel/Meta, Open-Graph- und Twitter-Karten, `sitemap.xml`, `robots.txt`.
- Strukturierte Daten: `Organization`, `Event` (Termine), `Article` (Beiträge).
- **Weiterleitungen** von alten TYPO3-URLs auf neue (Mapping-Liste in `docs/redirects.csv`).

### 10.5 Mehrsprachigkeit

- Deutsch zuerst, Englisch vorbereitet (`/en/`, `hreflang`, Textschlüssel statt hartkodierter Strings). Die alte Seite hatte bereits DE/EN.

---

## 11. Offene Punkte / Entscheidungen

| # | Punkt | Wer entscheidet |
|---|-------|-----------------|
| 1 | Verlauf: Original (`#033c73 100%`) oder dreistufig (`50%`)? | INWO |
| 2 | Akzentfarbe für CTAs | INWO / Design |
| 3 | Finale Headline, Subline, Button-Beschriftung | INWO |
| 4 | Boden-Texte (vier Szenen) | INWO |
| 5 | Quelle für „reichste 10 % gewinnen"; Herleitung der Zinsanteil-Schätzung verlinken | INWO |
| 6 | Tonalität der Zukunftstexte für Erstbesucher (sachlicher oder Originalton) | INWO |
| 7 | Kurztexte zu den vier Theorien | INWO |
| 8 | Zeile aus „Taler, Taler, du musst wandern" für Szene 4 | INWO |
| 9 | Pitch-Video: Drehbuch, Hosting (selbst oder YouTube) | INWO |
| 10 | YouTube-Kanäle und Channel-IDs | INWO |
| 11 | Stimmen mit Foto und Einwilligung | INWO |
| 12 | GSAP erlaubt oder nur CSS/IO? (nach Prototyp) | Kurt |
| 13 | Gesell-Bot: Quellausgaben/Rechte, Wiederverwendung des bestehenden RAG-Konzepts, KI-Anbieter und AVV | Kurt / INWO |
| 14 | Newsletter-/Mailversand: eigener Server oder Dienstleister (AVV) | Kurt |
| 15 | Buchhaltung: selbst bauen oder bestehende Vereinssoftware anbinden (GoBD, DATEV-Export, Spendenquittungen) | Vorstand / Kurt |
| 16 | Redaktioneller Workflow: nur Admin-Oberfläche oder auch Git? | Kurt / Redaktion |

---

## 12. Phasenplan

### Phase 1 – Landingpage und Prototyp

- Projektgerüst (Node.js, Fastify, MongoDB per Docker Compose, Linting, CI, README)
- Design-Tokens (Abschnitt 2), fixiertes Menü, Hamburger-Overlay, Scroll-Fortschrittsstreifen
- Abschnitte 5.1–5.9 mit Platzhalter- bzw. Entwurfstexten, Zins-Szenen mit Animation, Boden-Szenen als Struktur
- **Gesell-Bot-Mockup** inkl. Chatfenster und `POST /api/chat` gegen `data/mock-bot.json`
- Statische Daten für Events/Beiträge/Videos (Seeds), noch ohne Admin
- Datenschutz-/Barrierefreiheits-Grundlagen, Impressum/Datenschutz als Platzhalterseiten
- **Abnahme:** Lighthouse-Ziele erreicht, axe ohne kritische Fehler, ohne JS lesbar, auf Mobil/Desktop getestet, Prototyp-Link für die INWO zur Begutachtung

### Phase 2 – Inhalte pflegen

- Admin-Bereich mit Login, Pflege von Veranstaltungen, Beiträgen, Videos, Stimmen, Heften, Glossar
- Blog-, Kalender- und Hefte-Unterseiten, iCal- und RSS-Feeds
- Newsletter mit Double-Opt-in, Kontaktformular
- Zwei-Klick-YouTube, Hintergrundjob für Videoliste
- Optional: Zins-Rechner, Glossar-Tooltips
- Redirect-Mapping von der alten TYPO3-Seite, Livegang der neuen Startseite

### Phase 3 – Mitgliederverwaltung

- Mitgliederdaten (Stamm-, Beitrags-, Einwilligungsdaten), Beitrittsformular, Rollen und Rechte
- Beitragsverwaltung, Mahnwesen, Exporte
- Datenschutzkonzept (Löschfristen, Auskunft, Protokollierung)

### Phase 4 – Buchhaltung

- **Erst Entscheidung:** Eigenentwicklung vs. Anbindung bestehender Vereins-/Buchhaltungssoftware (rechtliche Anforderungen: GoBD, Aufbewahrungsfristen, Spendenbescheinigungen, Prüfung durch Kassenprüfer)
- Schnittstellen/Exporte (z. B. DATEV), Buchungsjournal, Beitrags- und Spendenzuordnung

### Phase 5 – Gesell-Bot produktiv

- RAG-Pipeline, Vektorsuche, Quellenangaben, Leitplanken aus Abschnitt 8.3, Kostenkontrolle, Evaluation mit einem Fragenkatalog

---

## 13. Anhang: Quellen und Ausgangsmaterial

- `docs/texte/eine-freie-welt.txt` – Texte der letzten Mitgliederversammlung („Eine freie Welt mit Fairconomy")
- `docs/referenz/PC_Gruppe_INWO_Startseite_To_Do_Liste.odt` – Ideendokument von Sebastian mit Screenshots der bisherigen Seite
- Zinsanteil in den Preisen: Berechnung von monneta (Creutz-Ansatz), für 2011 31–45 % – Schätzung, Herleitung verlinken
- Tagesgeldzinsen (Stand Oktober 2026): Marktdurchschnitt rund 1,7–1,8 %, Spitzenangebote ca. 4 % als befristete Aktionen – vor Veröffentlichung neu prüfen
- Finanzsektor-Anteil an der Wertschöpfung: für Deutschland bei Destatis prüfen; Schweiz als Vergleich ca. 9 % des BIP (Finanzplatz)
