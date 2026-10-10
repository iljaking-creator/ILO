# 02 · Motion-Recherche für Lyrids · Lyrics

Stand: 2026-10-10. Kennzeichnung: **[V]** direkt geprüft (npm-Paket, LICENSE-Datei, Typdefinitionen, GitHub-Seite), **[S]** nur Sekundärquelle bzw. Suchtreffer, **[E]** Eigenwissen oder Annahme, nicht belegt.

**Kurzfazit**
1. prompt-motion.com war aus meiner Umgebung **nicht erreichbar**. Es gibt keine erfundenen Katalogeinträge.
2. GSAP ist seit der Webflow-Übernahme kostenlos, auch kommerziell und inklusive SplitText. Die Lizenz ist aber proprietär ("no charge"), nicht Open Source.
3. Für seekbares Rendern nach Timecode passen GSAP-Timelines, anime.js 4 und Remotion am besten. Motion Canvas und Theatre.js sind möglich, aber eine andere Arbeitsweise.
4. Remotion ist laut LICENSE.md gratis für Einzelpersonen und For-Profit-Firmen bis 3 Mitarbeiter. Ab Version 5.0 ändert sich die Lizenz leicht.
5. Unten steht ein Vokabular mit 84 benannten Effekten, dazu Zuordnungs- und Variationsregeln.

## A. Katalog prompt-motion.com

| Versuch | Ergebnis |
|---|---|
| WebFetch `prompt-motion.com`, `www.prompt-motion.com` | `getaddrinfo ENOTFOUND` |
| curl über den Egress-Proxy (auch `.app`, `.io`, `promptmotion.com`) | `403` auf CONNECT, Proxy-Log: "policy denial" |
| Websuche "prompt-motion 233 motion styles" | keine Treffer zur Seite |

Dieselbe Sperre trifft auch `gsap.com`, `webflow.com`, `motion.dev` und `remotion.pro`. Meine Umgebung erreicht also nur eine kleine Allowlist (npm-Registry, GitHub, PyPI). Daraus folgt **nicht**, dass die Seite nicht existiert. Ich habe nichts erfunden und **keine** Datei `02b-prompt-motion-katalog.md` angelegt.

Hinweis: `UEBERGABE-LYRIDS.md` nennt den Motions-Katalog (233 Einträge, 59 Seiten, 118 Poster) schon als Zwischenergebnis auf deinem PC. Sinnvoll wäre, diesen Export (CSV/JSON) ins Repo zu legen. Dann kann man die Effekt-IDs aus Abschnitt C per Skript auf Katalognamen abbilden und die Katalogeinträge den Familien zuordnen.

## B. Werkzeuge für seekbare Text-Motion

**Grundprinzip:** Zeit ist Eingabe, nicht Zustand. Pro Frame wird `t = frame / fps` gesetzt, die Animation springt dorthin, ein Screenshot wird gemacht. Verboten sind `Date.now`, `performance.now`, `requestAnimationFrame`-Logik, ungesetztes `Math.random`, `repeat: -1` und CSS-Transitions. Nur so ist ein Render reproduzierbar [E]. Chrome bietet dafür `HeadlessExperimental.beginFrame` (experimentell, nur headless, Chrome-Version festnageln) [S]. Das Web-Animations-API erlaubt `getAnimations()` plus `currentTime` [S, W3C-Spec]. `puppeteer-capture` (MIT) nutzt `beginFrame` [S], HyperFrames laut Doku-Suchtreffern ebenfalls [S].

| Werkzeug (npm-Stand 2026-10-10) | Lizenz | Seekbar nach Timecode | Stärken / Schwächen für Lyrics |
|---|---|---|---|
| **GSAP 3.15.0** (vom 2026-04-13) | "Standard no charge license" [V]. README: "100 % FREE" inkl. SplitText, MorphSVG, DrawSVG, ScrambleText, CustomBounce/Wiggle, Physics2D [V]. Lizenztext (Stand 30.04.2025, nur Sekundärquelle): verboten ist der Einbau in No-Code-Animationstools, die Webflows Visual Builder konkurrieren, sowie Reverse Engineering [S] | **Sehr gut:** Timeline pausieren, `tl.time(t)`. HyperFrames nutzt GSAP-Timelines als Seek-Primitive [V] | Stärkste Auswahl an Eases, Stagger, Plugins. Die Lizenz ist proprietär: Vor einem Verkauf des Studios als Tool an andere neu prüfen (keine Rechtsberatung). `stagger from:"random"` und ScrambleText nutzen Zufall, `Math.random` daher mit Seed ersetzen [V Quelltext] |
| **SplitText** (in GSAP 3.15.0) | wie GSAP | wie GSAP | Optionen laut Typen [V]: `type` (chars/words/lines), `mask`, `autoSplit`, `onSplit`, `aria`, `deepSlice`, `smartWrap`, `wordDelimiter`. Emoji-sicher durch `Intl.Segmenter` plus Emoji-Regex [V Quelltext]. Schrift vor dem Split laden |
| **anime.js 4.5.0** | MIT [V] | Gut: `seek(time)` an Timer/Timeline/WAAPI [V Typen] | Enthält `splitText` und `scrambleText` [V]. Vollständig offene Alternative zu GSAP, kleineres Plugin-Angebot |
| **Motion (motion.dev) 14.1.0** | MIT [V]. `splitText` nur in Motion+ (bezahlt) [S] | `animate()`-Controls haben schreibbares `time` [V Typen] | Federn, Layout, WAAPI-Hybrid. Ohne Split-Funktion wenig Mehrwert gegenüber GSAP |
| **Remotion 4.0.534** | Gratis für Einzelpersonen, For-Profit bis 3 Mitarbeiter und Non-Profits, sonst Company License [V, LICENSE.md]. Remotion 5.0: Lizenz ändert sich leicht, **Freelancer zählen zur Teamgröße**, Betrieb eines "Bring-your-own-code"-Renderdienstes verboten [V, PR #3750]. Preise (nicht verifiziert): ca. 25 $/Seat/Monat bzw. 0,01 $/Render, min. 100 $/Monat [S] | Perfekt: `useCurrentFrame()` ist die Zeit | `@remotion/captions` (MIT) mit `createTikTokStyleCaptions` für Wort-Seiten [S]. Aber React-Umbau der HTML-Pipeline, CSS-Animationen unbrauchbar [E]. Für dich als Einzelperson bzw. bis 3 Personen kostenlos |
| **Motion Canvas 3.17.2** / **Revideo 0.11.0** | MIT [V] | Ja, Generator-Timeline, Export als PNG-Sequenz oder FFmpeg [S, motioncanvas.io] | Canvas-2D, nicht HTML/CSS. Gut für Erklärvideos, für Lyrics hoher Umbauaufwand. Revideo: Headless-`renderVideo()` [V] |
| **Theatre.js 0.7.2** | `@theatre/core` und `r3f` Apache-2.0, **`@theatre/studio` AGPL-3.0** [V] | `sequence.position` ist schreibbar [V Typen] | Visueller Keyframe-Editor, gut für Kamera oder Hintergrund. Studio nur zum Editieren nutzen, Rechtslage bei lokalem Rendern nicht geprüft |
| **Lottie / dotLottie** (`lottie-web` 5.13.0, `dotlottie-web` 0.81.0) | MIT [V]. Lizenz der einzelnen LottieFiles-Animationen **separat prüfen** [E] | `goToAndStop(frame,true)` bzw. `setFrame(frame)` [V] | Ideal für fertige Emoji, Sticker und Partikel. dotLottie hat Text-Slots (`TextSlotValue`) [V]. AE-Textanimatoren laut LottieFiles nur teilweise unterstützt [S] |
| **CSS / WAAPI / SVG-Filter** | – | Gut per `currentTime`, `animation-delay: calc(-1 * t)` + paused [S/E] | Variable-Font-Achsen, `clip-path`, `mask`, `mix-blend-mode`, `feDisplacementMap`/`feTurbulence` (Glitch). Scroll-driven `animation-timeline`: Chromium ab 115, Safari 26, Firefox nicht Standard [S]. Als Zeitachse unnötig |
| **Three.js 0.186.1** | MIT [V]. `troika-three-text` 0.52.5 MIT, `three-msdf-text-utils` ISC, `postprocessing` Zlib [V] | Gut, wenn man Uniform-Zeit selbst setzt | Extrusion, Tunnel, Reflexion, Glitch-Shader. SDF-Text per Glyph-Shader möglich, Per-Zeichen-Indizes unklar [S]. Braucht WebGL (GPU) im Headless-Browser |
| **AE-Text-Animator-Presets** | kein offener Standard | – | Muster nachbauen: Range Selector = Stagger (each/from/ease) auf SplitText-Einheiten, Randomize = Seed-Shuffle, Wiggly = CustomWiggle bzw. `simplex-noise` 4.0.3 (MIT). Presets wie "Fade Up Words", "Typewriter", "Blur By Word" existieren in AE [S] |
| **HyperFrames (HeyGen) 0.8.145** | Apache-2.0 [V] | Seek-getrieben, Adapter für GSAP, Lottie, CSS, Three.js, anime.js, WAAPI [V] | Node ≥ 22 und FFmpeg. Als Referenzarchitektur oder Ersatz für das eigene Capture-Skript prüfenswert. Windows-Unterstützung unbestätigt, auf npm erst seit 2026-03-23 |

**Meiden oder prüfen:** `typed.js` (GPL-3.0). Für Beat-Analyse **librosa 1.0.0** (ISC) oder `web-audio-beat-detector` (MIT) nehmen. `essentia`/`essentia.js` (AGPL), `aubio` (GPL) und `madmom` (Modelle nur nicht-kommerziell) sind für ein kommerzielles Konto heikel [V, Paket-Metadaten].

**Empfehlung für den Stack [E]:**
1. GSAP 3.15 plus SplitText als Hauptmotor, anime.js 4.5 als vollständig offener Plan B.
2. CSS/SVG-Filter für Looks, dotLottie für Emoji und Sticker, Three.js nur für die 3D-Familie.
3. Audioanalyse **offline** (librosa → JSON mit Beat-, Kick-, Snare- und Bass-Hüllkurve pro Frame). Nie ein Live-`AnalyserNode` im Render nutzen.
4. Text-Ebene transparent als PNG-Sequenz rendern (`omitBackground`), Hintergrund-Clip und Audio per ffmpeg zusammensetzen. So entfällt das Seeken von `<video>`-Tags im Browser.
5. Bewegungsunschärfe über Subframes (z. B. 4 pro Frame) und ffmpeg `tmix`.

## C. Motion-Vokabular (84 Effekte, Eigenentwurf)

Kürzel Bibliothek: **GS** GSAP + SplitText, **G** GSAP Kern/Plugin, **C** CSS/SVG, **L** dotLottie, **T** Three.js, **A** Audio-JSON (Beat/Bass/Kick, offline), **F** ffmpeg-Nachbearbeitung.

### Einstiege
| ID | Name | Aussehen | Passt zu | Lib. |
|---|---|---|---|---|
| E01 | Pop-In | Wort skaliert 0 auf 1,15 auf 1 | Standardwort, Hook | GS |
| E02 | Maskenschub | Wort schiebt sich aus Maske hoch | Strophe, ruhig | GS (mask) |
| E03 | Zeichen-Kaskade | Buchstaben fallen versetzt ein | lange Wörter | GS |
| E04 | Blur-Fokus | unscharf zu scharf | Melodisch, Gefühl | GS+C |
| E05 | Tracking-In | Abstand weit zu normal, Fade | Ballade | GS |
| E06 | Typewriter | Zeichen mit Cursor | Erzählpassage, Flüstern | GS |
| E07 | Scramble-Decode | Zufallszeichen lösen sich auf | Technik-, Dunkel-Texte | G (Scramble) |
| E08 | Zoom-Through | Wort fliegt aus der Kamera | Drop, Ausruf | G+C |
| E09 | Flip-In 3D | rotateX 90° zu 0° | Wortwechsel | GS+C |
| E10 | Stempel-Slam | 2× groß, Aufprall, Mini-Shake | **Punchline** | G |
| E11 | Wipe-Reveal | clip-path von links | Zeilenanfang | C |
| E12 | Squash-Stretch | Dehnen und Stauchen | verspielt | G |

### Ausstiege
| ID | Name | Aussehen | Passt zu | Lib. |
|---|---|---|---|---|
| X01 | Fade-Drift | Fade, 20 px nach oben | Standard | G |
| X02 | Maskenschub-Ab | nach unten aus der Maske | zu E02 | GS |
| X03 | Zerfall | Zeichen fliegen weg | Schluss, Drop | G (Physics2D) |
| X04 | Blur-Zoom-Out | wird groß und unscharf | Ende Hook | C |
| X05 | Kollaps | Zeichen ziehen sich zur Mitte | Pause | GS |

### Betonung auf dem Beat
| ID | Name | Aussehen | Passt zu | Lib. |
|---|---|---|---|---|
| B01 | Beat-Pump | Scale 1,12 auf Kick, 120 ms | Kick, Reimwort | G+A |
| B02 | Farbflash | Wort 1 Beat in Akzentfarbe | Schlüsselwort | G |
| B03 | Marker-Balken | Textmarker wächst hinter Wort | Kernaussage | C |
| B04 | Unterstreichen | Linie zeichnet sich | Betonung leise | G (DrawSVG) |
| B05 | Wiggle | Rotation ±3° | Ad-lib, Humor | G (CustomWiggle) |
| B06 | Gewichtssprung | Variable Font 300 auf 900 | Betonung ohne Größe | C |
| B07 | Glow-Puls | Schatten pumpt | Melodisch, Nacht | C+A |
| B08 | Outline-Fill | Kontur wird Füllung | Wortwechsel | C |

### Wort-Highlight / Karaoke
| ID | Name | Aussehen | Passt zu | Lib. |
|---|---|---|---|---|
| K01 | Farb-Sweep | Füllung läuft durchs Wort | klassisch | C+GS |
| K02 | Dimm-Fokus | aktives Wort hell, Rest 40 % | Strophe | GS |
| K03 | Aktiv-Vergrößern | aktives Wort 1,15× | Rap | GS |
| K04 | Wandernde Pille | Box springt von Wort zu Wort | Hook | G (Flip) |
| K05 | Bouncing Dot | Punkt springt über Wörter | Mitsing-Teile | G |
| K06 | Silben-Karaoke | Füllung je Silbe | Gesungene Längen | C (Silbenzeiten nötig) |
| K07 | Ein-Wort-Fokus | nur Wort groß mittig | schneller Rap, Hook | GS |

### Zeilenübergänge
| ID | Name | Aussehen | Passt zu | Lib. |
|---|---|---|---|---|
| T01 | Push-Up | alte hoch, neue von unten | Standard | G |
| T02 | Cross-Blur | alt blurt aus, neu blurt ein | Ballade | G+C |
| T03 | Wipe | vertikale Maske wechselt | Strophenwechsel | C |
| T04 | Zoom-Cut | Hartschnitt, 1,3× zu 1× | Rap, Hook | G |
| T05 | Rolodex | 3D-Trommel | Refrain | T/C |
| T06 | Stapel-Scroll | ältere Zeilen dimmen | lange Zeilen | G |
| T07 | Whip-Pan | schneller Schwenk mit Blur | Szenenwechsel | G+F |

### Kamera
| ID | Name | Aussehen | Passt zu | Lib. |
|---|---|---|---|---|
| C01 | Slow Push-In | 1,00 auf 1,08 über Strophe | Spannungsaufbau | G |
| C02 | Kick-Punch | Zoom 1,06 auf Kick | Hook, Drop | G+A |
| C03 | Parallax-Drift | Ebenen driften verschieden | Dauerhintergrund | G |
| C04 | Dutch-Tilt | ±2° Rotation | Bruch, Wut | G |
| C05 | Rack-Focus | Fokus wandert Vorder-/Hintergrund | Übergang zu Emotion | C |
| C06 | Handheld | Rauschen als Mikro-Wackeln | Raw-Stimmung | G+simplex-noise |

### Hintergrund-Reaktion
| ID | Name | Aussehen | Passt zu | Lib. |
|---|---|---|---|---|
| H01 | Bass-Pump | Clip ±3 % Scale mit Bass | Bass-lastige Songs | A+F |
| H02 | Kick-Flash | +20 % Helligkeit | Drop | A+F |
| H03 | Abschnitts-Farbe | Hue-Wechsel pro Teil | Hook vs. Strophe | F |
| H04 | Vignette-Atmen | Rand pulsiert | Ballade | C |
| H05 | Chroma-Puls | Farbversatz auf Snare | Rap | A+C |
| H06 | Letterbox-Drop | Balken fahren raus beim Drop | Drop | C |
| H07 | Stille-Dimmen | Clip dunkler, ruhiger | Whisper, Bridge | F |
| H08 | Staub/Partikel | seeded Partikel | Atmosphäre | C/L |

### Glitch
| ID | Name | Aussehen | Passt zu | Lib. |
|---|---|---|---|---|
| G01 | RGB-Split | R/G/B versetzt | Rap, Ad-lib | C |
| G02 | Slice-Glitch | Streifen verschoben | Schreien, Bruch | C |
| G03 | Mosaik-Stufen | Pixelierung in Stufen | Übergang | C+F |
| G04 | Flicker | Opazität stottert | Nervosität | G |
| G05 | Text-Corrupt | Zeichen wechseln kurz | Stottern, Echo | G (Scramble) |
| G06 | Wellen-Verzerrung | Displacement-Welle | Wasser, Traum | C (SVG) |

### 3D
| ID | Name | Aussehen | Passt zu | Lib. |
|---|---|---|---|---|
| D01 | Extrusion | tiefer 3D-Text mit Licht | Titel, Hook | T |
| D02 | Tunnel-Flug | Wörter in Z-Tiefe, Kamera fliegt | Drop | T |
| D03 | Crawl-Neigung | Text liegt schräg, driftet | Intro | C |
| D04 | Würfel | Zeilen auf Würfelseiten | Refrain | T |
| D05 | Spiegelboden | Reflexion unter dem Text | Ballade, Titel | T/C |

### Handschrift
| ID | Name | Aussehen | Passt zu | Lib. |
|---|---|---|---|---|
| S01 | Stroke-Write | Schrift zeichnet sich (Pfade aus Font via `opentype.js`) | Ballade, Zitat | G (DrawSVG) |
| S02 | Kritzel-Kreis | Kreis oder Pfeil um Wort | Schlüsselwort | G (DrawSVG) |
| S03 | Neon-Röhre | Linie leuchtet in Folge | Nacht, Party | G+C |

### Bounce / Physik
| ID | Name | Aussehen | Passt zu | Lib. |
|---|---|---|---|---|
| P01 | Drop-Bounce | fällt, springt 3× | "fallen", "down" | G (CustomBounce) |
| P02 | Feder-Overshoot | federt nach | Hook | G |
| P03 | Buchstaben-Haufen | fallen und stapeln sich | Schluss | G (Physics2D) |
| P04 | Schweben | Sinus-Auf/Ab | Haltetöne | G |

### Bass-Shake / Rhythmus
| ID | Name | Aussehen | Passt zu | Lib. |
|---|---|---|---|---|
| R01 | Bass-Shake | Text wackelt mit Bass-Hüllkurve | Trap, Bass | A+G |
| R02 | Snare-Snap | Rotationsruck | Snare-Backbeat | A+G |
| R03 | Drop-Explosion | Wörter fliegen radial weg | **Drop** | G+A |
| R04 | Echo-Stotter | Kopien mit Delay | Ad-lib-Echo | GS |

### Emoji / Deko
| ID | Name | Aussehen | Passt zu | Lib. |
|---|---|---|---|---|
| M01 | Emoji-Pop | Emoji erscheint neben Wort | Substantiv, Gefühl | L/G |
| M02 | Emoji-Regen | viele Emoji fallen | Party-Hook | L/G |
| M03 | Rebus-Ersatz | Wort wird zum Emoji | Wiederholung | G |
| M04 | Sticker-Slap | Sticker klatscht schräg auf | Ad-lib | G |
| M05 | Emoji-Orbit | Emoji kreist um Wort | Liebe, Mond | G |

### Stimmung / Sonderfälle
| ID | Name | Aussehen | Passt zu | Lib. |
|---|---|---|---|---|
| Z01 | Flüstern | klein, niedrige Deckkraft, langsam | **Whisper** | GS+C |
| Z02 | Schrei | maximal groß, Flash, Shake | Schrei, Ausbruch | G |
| Z03 | Hall-Nachhall | Kopien skalieren auf, verblassen | Langer Hall | GS |
| Z04 | Dehnung | Tracking wächst bei gehaltenem Ton | Haltetöne | GS+A |

(Zusammen 84 Einträge. IDs sind frei, sie werden später auf Katalognamen gemappt.)

## D. Regeln

**Zuordnung nach Songtyp**
| Kontext | Regel |
|---|---|
| **Rap** (> 4 Wörter/s) | Effekte ≤ 200 ms, Wörter in 2er/3er-Gruppen, Hartschnitte (T04, K07). Kein Typewriter, Scramble oder Tracking-In |
| **Melodisch/Ballade** (< 2,5 Wörter/s) | weiche Eingänge (E04, E05), Dehnung Z04, Cross-Blur, Slow Push-In, Handschrift |
| **Tempo** | Eingangsdauer = 0,25 × Beat-Länge, begrenzt auf 120 bis 400 ms. Bei > 140 BPM Betonungen im Halbzeit-Raster (jeder 2. Beat) |
| **Hook** | Intensität +1 Stufe, größere Schrift, mehr Emoji, C02/H01. Wiederkehrende Hook-Zeilen bekommen **dieselbe** Effektfolge (Wiedererkennung, Ausnahme von der Variationsregel) |
| **Strophe** | ruhig, Karaoke-Fokus (K02), weniger Dekoration |
| **Bridge / Drop** | Bridge: H07 und Reduktion. Drop: R03 + H02 + H06 |
| **Punchline** (Reimwort) | 300 bis 500 ms ruhig davor, dann E10 oder E01 mit B02 |
| **Ad-lib / Hintergrundstimme** | klein, versetzt, B05/M04/R04, nie in Hauptfarbe |
| **Whisper / Schrei** | Z01 bzw. Z02 |
| **Emoji** | pro passendem Wort (Substantiv, Gefühl) ein Emoji, mit M01 bis M05 variieren |

**Variation**
1. Gleicher Einstieg (E) frühestens nach **4 Zeilen**, gleicher Zeilenübergang (T) nicht zweimal hintereinander und höchstens jeder dritte.
2. Höchstens zwei Zeilen in Folge aus derselben Familie.
3. Betonung (B) auf höchstens 25 % der Wörter. Glitch (G) und 3D (D) höchstens einmal je 8 Zeilen. Handschrift (S) einmal je 6.
4. Pro Song eine Kernpalette aus 6 bis 8 Effekten plus 2 bis 3 **Signature-Effekte**.
5. Nur eine kontinuierliche Kamerabewegung gleichzeitig, maximal drei animierte Ebenen.
6. Auswahl per Seed aus (`songId`, `lineIndex`). So bleibt jeder Render reproduzierbar. Ein Lint-Skript prüft den Effektplan (JSON) gegen diese Abstände.
7. Lesbarkeit zuerst: Mindestanzeigezeit pro Zeile etwa 0,25 s + 0,06 s je Zeichen [E, Richtwert]. Der Text bleibt im sicheren Bereich der TikTok-Oberfläche (Wert nicht geprüft).

**Offene Fragen:** (1) Export des Katalogs bereitstellen (CSV/JSON). (2) Welche Capture-Technik nutzt das Studio (Puppeteer, Playwright, `beginFrame`)? (3) Gibt es Wort- und Silbenzeiten aus Whisper bzw. einem Aligner? (4) Firmenstatus für Remotion (Einzelperson oder bis 3 Personen)? (5) Lizenz je Lottie-Animation klären.

**Quellen:** npm-Registry (gsap, motion, animejs, remotion, @theatre/*, @lottiefiles/dotlottie-web, hyperframes, three) · https://github.com/remotion-dev/remotion/blob/main/LICENSE.md · https://github.com/remotion-dev/remotion/pull/3750 · https://github.com/heygen-com/hyperframes · https://github.com/theatre-js/theatre · https://github.com/motion-canvas/motion-canvas · https://github.com/redotvideo/revideo · https://motioncanvas.io/docs/rendering/video · https://webflow.com/blog/gsap-becomes-free · https://gsap.com/community/standard-license/ · https://www.remotion.dev/pricing · https://www.remotion.dev/docs/captions/create-tiktok-style-captions · https://motion.dev/docs/split-text · https://www.w3.org/TR/web-animations-1/ · https://docs.lottiefiles.com/en/integrations/after-effects/09_lottie-compatibility
