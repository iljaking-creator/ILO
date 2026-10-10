# 01 – Emoji-Sets für Lyrids · Lyrics

Stand: 2026-10-10. Keine Rechtsberatung. "(unverifiziert)" = nicht an der Primärquelle bestätigt. Eigene Messungen: Emojibase 17.0.0 (Basis-Emoji ohne Hauttöne = 1.923), npm-Pakete, direkte HTTP-Tests der Asset-URLs, Sichtvergleich per Kontaktbogen.

## 0. Kurzfazit

1. **Primär: Noto Emoji 2D (SVG, Apache-2.0) + Animiert: Noto Animated Emoji (Lottie, CC BY 4.0)**: eine Bildsprache, statisch und animiert austauschbar, Vektor, beide Lizenzen erlauben kommerzielle Nutzung.
2. **OpenMoji meiden** (CC BY-SA 4.0): ShareAlike-Risiko für das ganze Video ist ungeklärt; Outline-Stil passt kaum zu "premium".
3. **Fluent 3D + Fluent Animated (MIT)** ist die rechtlich einfachste und edelste Alternative (eigenes "Theme"), aber Stand nur Emoji 15.1 (Okt. 2024) und Animationen dezent.
4. **Nie Emoji als Schriftzeichen rendern** (Windows-Browser nutzen Segoe UI Emoji, proprietär), nur eigene Bilddateien. Apple/Samsung/Meta-Bilder tabu.
5. Rohe CLDR-Keywords reichen für Rap nicht (21 von 57 deutschen Testwörtern ohne Treffer) → Slang-Lexikon + LLM-Pass + harte Emoji-Budgets.

## 1. Lizenzübersicht

| Set | Lizenz (Grafiken) | Pflicht | Kommerziell/monetarisiert | Formate | Art | Umfang / Stand | Quelle |
|---|---|---|---|---|---|---|---|
| **OpenMoji** | CC BY-SA 4.0 (Code LGPL-3.0) | Namensnennung, Lizenzlink, Änderungen angeben; **ShareAlike** bei Adaptionen | ja, aber SA-Risiko | SVG (Color/Black), PNG 618 und 72 | statisch | 4.495 Dateien (1.914 Standard-Basis, 405 Eigen-Extras); v17.0.0 (npm 2026-04-23) | github.com/hfg-gmuend/openmoji |
| **Twemoji (jdecked)** | CC BY 4.0 (Code MIT) | Nennung; README/About/Footer reicht laut Projekt | ja | SVG, PNG 72 | statisch | v17.0.3 (npm 2026-06-01); @twemoji/svg 15.0.0 = 3.723 Dateien | github.com/jdecked/twemoji |
| **Noto Emoji** (Repo) | Apache-2.0 "für die meisten Bilder"; Font OFL 1.1; Flaggen gemeinfrei/ausgenommen | README nennt keine; Apache-Hinweise bei Weitergabe | ja | 2D: SVG + PNG 128; 3D: PNG 128 | statisch | 1.661 von 1.923 Basis-SVG (alle Nicht-Flaggen); Emoji-16/17-Stichproben vorhanden | github.com/googlefonts/noto-emoji |
| **Noto Animated Emoji** | CC BY 4.0 | Nennung nach CC BY | ja | Lottie (1024 px, 60 fps), WebP 512, GIF 512 | animiert | **614 von 1.923** (Smileys 162/171, Personen 63/388, Tiere 96/160, Essen 68/131, Reise 74/219, Objekte 65/266, Symbole 38/224) | CDN `fonts.gstatic.com/s/e/notoemoji/latest/<cp>/lottie.json` |
| **Fluent Emoji statisch** | MIT, © Microsoft | Copyright- und Lizenztext beibehalten | ja | 3D-PNG 256 px; Color/Flat/High-Contrast SVG | statisch | Stand Emoji 15.1; letzte Inhalts-Commits Jan 2025 (Aug 2026 nur CI-Pinning) | github.com/microsoft/fluentui-emoji |
| **Fluent Emoji Animated** | MIT, © Microsoft | wie oben | ja | animiertes PNG 256 px (Git LFS, ca. 5 GB) | animiert | letzter Commit 2024-10-17; im MIT-Mirror lobehub 1.003 Dateien mit >1 Frame (363 Basis-Emoji), Rest statische Platzhalter | github.com/microsoft/fluentui-emoji-animated |

Belege: OpenMoji README/LICENSE.txt https://github.com/hfg-gmuend/openmoji und https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/LICENSE.txt; npm https://registry.npmjs.org/openmoji/latest. Twemoji https://github.com/jdecked/twemoji, https://raw.githubusercontent.com/jdecked/twemoji/main/LICENSE-GRAPHICS, npm https://registry.npmjs.org/@twemoji/api/latest. Noto https://raw.githubusercontent.com/googlefonts/noto-emoji/main/README.md. Fluent https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/LICENSE, https://raw.githubusercontent.com/microsoft/fluentui-emoji-animated/main/README.md, Commits https://github.com/microsoft/fluentui-emoji-animated/commits/main, Mirror https://registry.npmjs.org/@lobehub/fluent-emoji-anim-1/latest.

**Noto Animated, Lizenzlage:** CC BY 4.0 stützt sich auf die offizielle FAQ (googlefonts.github.io/noto-emoji-animation, aus der Sandbox nicht abrufbar, nur über Suchzusammenfassung belegt) und konsistent auf https://pub.dev/packages/animated_emoji sowie https://github.com/rbozan/animated-emojis-rs. Ein Google-Fonts-Mitglied riet in https://github.com/google/fonts/issues/9021 (2025-01-30) zur Nennung "in den Video-Metadaten statt ins Bild eingebrannt"; eine förmliche Entscheidung gab es nicht.

**ShareAlike-Problem (OpenMoji):** Der Lizenztext verlangt bei "Adapted Material", das man teilt, dieselbe Lizenz (Abschnitt 3(b)). Ob ein Video mit skalierten/animierten Emojis darunter fällt, ist rechtlich offen (CC-FAQ aus Sandbox nicht erreichbar); im schlechtesten Fall kollidiert das mit Musik- und Markenrechten. Für monetarisierte Videos nicht eingehen. Beleg: https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/LICENSE.txt

### Weitere Sets (nicht empfohlen)

| Set | Befund | Quelle |
|---|---|---|
| EmojiTwo | CC BY 4.0, aber Stand EmojiOne 2.2.7, veraltet, statisch | https://raw.githubusercontent.com/EmojiTwo/emojitwo/master/README.md |
| Blobmoji | Noto-Fork (OFL/Apache), seit 2026-06-04 archiviert | https://github.com/C1710/blobmoji |
| LibreMoji | CC BY-SA 4.0, nur 17 von 1.909 fertig | https://raw.githubusercontent.com/LibreMoji/libremoji.github.io/master/README.md |
| Mutant Standard | CC BY-NC-SA 4.0 (NC = kein kommerzieller Einsatz), aus Drittprojekten; Primärseite nicht geprüft | https://pypi.org/project/ppb-mutant |
| JoyPixels | proprietär, kommerzielle Nutzung lizenzpflichtig (Drittübersicht, unverifiziert) | https://github.com/frewpm/currentversions |
| Firefox Fxemoji | Code Apache-2.0; Lizenz der Grafiken nicht abschließend gelesen (unverifiziert) | https://raw.githubusercontent.com/mozilla/fxemoji/gh-pages/LICENSE.md |
| LottieFiles-/Gumroad-"Gratis-Packs" | pro Asset eigene Lizenz; ein Gumroad-Paket "Animated Fluent" nennt "all rights reserved by Microsoft" → Finger weg, stattdessen Original-Repo | https://boltuix.gumroad.com/l/emoji |

Keine weitere offen lizenzierte Lottie-Emoji-Sammlung in Noto-/Fluent-Qualität gefunden. Tossface: Lizenz nicht gefunden (unverifiziert).

## 2. Sichtbefund (eigener Kontaktbogen: 🔥💰🚀💔💀👑🤬😎)

- **Noto 2D:** vertrauter Android-Look, sauber, kräftige Farben, auf Dunkel sehr lesbar. **Noto 3D** (PNG nur 128 px) wirkt glänzend/"Apple-nah", aber zu klein für 1080 px.
- **Fluent 3D:** weich, pastellig, am "premiumsten"; PNG nur 256 px, Animationen sehr zurückhaltend (leichtes Wackeln).
- **Noto Animated:** deutlich ausdrucksstärker (💔 zerbricht, 💀 bekommt Risse), vektorbasiert, ca. 1 s Länge; Lottie läuft framegenau in lottie-web 5.13.0 (MIT, npm 2025-05-21).
- **Twemoji/OpenMoji:** flach bzw. mit schwarzer Kontur, wirken eher "Icon" als "Premium".

## 3. Empfehlung

**(1) Sets**
- **Primär statisch: Noto Emoji 2D SVG** (Alle Nicht-Flaggen vorhanden, Vektor, beliebig skalierbar).
- **Animiert: Noto Animated (Lottie)** für die 614 verfügbaren, bei Betonung statisch→animiert tauschen; ohne Animation bleibt das statische Noto-Pendant im gleichen Stil.
- **Optionales Zweit-Theme:** Fluent 3D + Fluent Animated, nie im selben Video mischen. Fluent-Animation nur via Git LFS (offizielles Repo, Raw liefert nur Zeiger).
- Pipeline: Lottie per lottie-web mit `goToAndStop(frame)` pro Videoframe rendern (deterministisch); WebP/APNG vorher in PNG-Frames wandeln (Eignung von ffmpeg für animiertes WebP nicht geprüft).
- QA: bekannte defekte Noto-Lottie-Dateien (z. B. Issue https://github.com/google/fonts/issues/6242) beim Kuratieren aussortieren.

**(2) Kuratierung**
1. Startmenge: 1.923 Basis-Emoji. Streichen: Flaggen, Komponenten, Hauttonvarianten (nur Standardgelb), Tastenkappen, Uhren, Tierkreis, Regional-Indikatoren. Richtwert danach ca. 1.200 (unverifiziert).
2. **Duplikate clustern:** Annotation-Überlappung (Jaccard der DE+EN-Keywords > 0,5) plus Bildähnlichkeit (pHash oder CLIP-Embedding). Pro Cluster ein Gewinner (z. B. 😂 statt 🤣, 🔥 statt ❤️‍🔥), Rest auf `alias`.
3. **Automatische Checks** (Render bei 160 px auf dunkel/hell/bunt): Bounding-Box ≥ 70 % der Fläche, Lesbarkeit bei 48 px (SSIM zum 160-px-Bild), Kontrast gegen Hintergrund; Lottie: Dauer 0,6-2,5 s, Loop-Differenz erster/letzter Frame, Dateigröße < 300 kB.
4. **Menschliche Sichtung:** HTML-Kontaktbogen, Tasten A (Kern), B (ok), X (raus). Ergebnis als `curated.json` (hex, Tier, Cluster, animiert ja/nein, DE/EN-Anker) ins Repo. Ziel: Tier A ca. 300-400 Emoji, davon möglichst viele mit Animation (Richtwerte).
5. Bei neuen Noto-Versionen nur Neuzugänge nachsichten.

**(3) Wort→Emoji (DE und EN)**
- **Stufe 1, Lexikon:** Emojibase 17.0.0 `de/data.json` und `en/data.json` (MIT, aus CLDR, Unicode-3.0), Lemmatisierung mit simplemma 2.0.0 (MIT), Komposita per Kopf-Suffix (Geldschein→Geld). Sprache pro Token bestimmen (Code-Switching). Ad-libs ("yeah", "skrrt") verwerfen.
- **Testlücken:** DE ohne Treffer: kohle, cash, gang, hood, straße, schwester, flex, swag, hustle, drip, beef, squad, hass, benz, club, weed, knast, babe, thron, hölle, gott (21/57). EN: hood, street, sister, mama, hustle, beef, squad, hate, weed, jail, throne, heaven, hell, god (14/54). Außerdem unscharf: "night" liefert 😙😪 vor 🌙, "fire" Feuerwehr-Emoji vor 🔥 → Ranking nach exaktem Label-Treffer zuerst.
- **Stufe 2, Slang-Lexikon** (YAML, von Hand + LLM-Vorschlägen; Seed 300-500 Einträge): Kohle/Cash/Paper/Bread→💸; Gang/Squad/Crew→👥; Flex→💪; Drip/Ice→🧊💎; Whip/Karre/Benz→🚗; Hood/Block→🏙️. Je Eintrag Gewicht und `sensitive`-Flag.
- **Stufe 3, Embeddings** (mehrsprachig, z. B. BGE-M3 oder multilingual-e5; Lizenzen nicht geprüft, Hugging Face aus Sandbox gesperrt): Wort im Zeilenkontext gegen Emoji-Beschreibung (Label + Keywords DE/EN), nur im kuratierten Set, Schwelle und Abstand zum Zweitplatzierten an ca. 200 manuell gelabelten Wörtern kalibrieren.
- **Stufe 4, LLM-Pass** (Claude, strukturierte JSON-Ausgabe, ganzer Song auf einmal): klärt Sinn (Kohle = Geld, nicht Brennstoff), Ironie, Metaphern; wählt Emoji oder "keins", Konfidenz + Begründung. Ergebnis cachen (Lemma+Sinn), im Studio freigeben, pro Artist als Mapping-Memory speichern.
- **Kein passendes Emoji:** kein Emoji. Stattdessen typografische Betonung (Farbe, Skalierung). Stimmungs-Emoji (✨💫😮‍💨) nur aus Whitelist, max. 1 pro Songteil. Negation/Sarkasmus: überspringen.
- **Sensibles** (Drogen, Waffen, Gewalt, Sex): neutral abbilden oder weglassen, um Monetarisierung zu schützen (Plattformregeln hier nicht geprüft).
- **Anti-Overload (Heuristik, einstellbar):** nur Inhaltswörter (Nomen/Verb/Adjektiv) mit Konfidenz ≥ 0,7; max. 1 Emoji pro Wort, max. 2 pro Zeile; Mindestabstand 1,2 s; höchstens ca. 1 Emoji je 6-8 Wörter und in max. 35 % der Zeilen; dasselbe Emoji nicht erneut innerhalb 10 s (außer Hook); nie mehr als 1 animiertes gleichzeitig; Refrain nutzt dieselbe Zuordnung wie beim ersten Mal.

Belege: https://registry.npmjs.org/emojibase-data/latest, https://pypi.org/pypi/simplemma/json, https://raw.githubusercontent.com/unicode-org/cldr/main/common/annotations/de.xml.

**(4) Credits**
- **Pflichtinhalt** (CC BY 4.0 Abschn. 3(a)): Urheber, Copyright-Hinweis, Lizenzhinweis mit Link, Haftungsausschluss-Hinweis, Link zum Werk, Änderungsangabe; "in jeder angemessenen Weise je nach Medium" ist erlaubt. Beleg: https://raw.githubusercontent.com/jdecked/twemoji/main/LICENSE-GRAPHICS (gleiche Klausel steht in der BY-SA-Variante unter https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/LICENSE.txt)
- **Caption (eine Zeile):** `Emoji: Noto Emoji © Google (Apache-2.0), Animated Noto Emoji © Google (CC BY 4.0)`
- **Bio:** "Credits & Lizenzen" + Link auf eine Credits-Seite (URL noch festlegen), dort pro Set: Urheber, Lizenz-Link, Quell-Link, "Änderungen: skaliert, als Videoframes gerendert".
- **Video-Metadaten:** `ffmpeg -metadata comment="..."` (Empfehlung des Google-Mitglieds, s. oben).
- **Repo:** `NOTICE` mit Lizenztexten (Apache-2.0, CC BY 4.0, ggf. MIT von Fluent: Copyright + Lizenztext mitliefern).
- Ob Caption/Bio/Metadaten bei Plattformvideos als "angemessen" gelten, ist nicht von Google entschieden; konservativ alle drei nutzen.

## 4. Plattform-Fallstricke

- **Apple Color Emoji:** proprietär; laut Emojipedia gibt es keine Lizenzmodelle für Dritte, und Apple hat Apps wegen Apple-Emoji abgelehnt. https://blog.emojipedia.org/who-owns-emoji/ und https://blog.emojipedia.org/apples-emoji-crackdown/
- **Samsung, Meta/Facebook, Gboard Emoji Kitchen, TikTok-/Instagram-eigene Emoji und Sticker:** proprietär (unverifiziert, hier nicht einzeln geprüft).
- **Google-Android-Emoji:** nur das offene Noto-Repo nutzen, keine Screenshots aus Android/Gboard.
- **Windows-Browser:** Emoji-Zeichen im HTML werden dort üblicherweise mit Segoe UI Emoji gerendert (unverifiziert), einer Schrift mit "All Rights Reserved" von Microsoft; Lizenz für Videorenderings unklar. Deshalb Emoji als `<img>`/Lottie, nicht als Text. https://learn.microsoft.com/en-us/typography/font-list/segoe-ui-emoji
- **Unicode-Fallen:** FE0F und ZWJ-Sequenzen beim Dateinamen-Mapping (bei Noto Animated liefern z. B. `2764` und `2764_fe0f` beide 200: immer beide Schreibweisen prüfen); Versionsstand je Set (Fluent nur bis 15.1).
- **Drittseiten** (Emojipedia, Flaticon, "GIF-Packs"): Urheber unklar, nicht verwenden.
- **Musik ist separat:** Emoji-Lizenzen decken keine Musikrechte.

## 5. Offene Fragen

1. Offizielle Noto-Animated-FAQ und Attribution-Wortlaut direkt prüfen (Seite gesperrt).
2. Juristische Klärung: reicht Caption/Bio/Metadaten; ist OpenMoji-SA bei Video wirksam.
3. Fluent-Animated-Zahlen stammen aus einem Mirror; im Originalrepo (LFS) nachzählen.
4. Embedding-Modell-Lizenzen und Plattform-Moderation zu sensiblen Emoji prüfen.
5. Entscheidung: Noto-Look (empfohlen) oder Fluent-3D-Look als Marken-Stil?
