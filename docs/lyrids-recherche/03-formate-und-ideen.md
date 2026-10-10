# Lyrids · Lyrics: Formate, Plattform-Specs und Ideenkatalog

Stand: 2026-10-10. Recherche für @lyrids.tv (9:16, Song-Audio, animierte Lyrics + Emoji, HTML + ffmpeg).

**Quellenlage (bitte lesen):** WebFetch war in dieser Umgebung nicht erreichbar (DNS-Fehler). Alle Angaben stammen aus Zusammenfassungen von Suchtreffern, keine Seite wurde direkt gelesen. Offizielle TikTok-/Meta-Dokumente wurden nicht eingesehen. Kennzeichnung: **[S]** Sekundärquelle (Blog/Tool-Anbieter), **[O]** laut Suchtreffer offizielle Seite, **[E]** eigene Einschätzung, **[?]** widersprüchlich oder unverifiziert.

## 1. Kurzfazit

1. Für die Popularität konkreter Lyric-Formate 2025/26 (Kontrollzentrum-Swipe, Sperrbildschirm, Chat-Look usw.) fand die Suche **keinen Beleg**. Die Familien unten sind Einschätzungen plus wenige Indizien. Das Testprogramm (Abschnitt 5) ersetzt die fehlenden Daten.
2. Schwache Belege gibt es für: Moodboard-/Aesthetic-Lyric-Videos (Juli 2025) [S], Kinetic Type als Standard in Short-Form [S], VHS-/Camcorder-Look 2026 [S], minimale Lyric-Edits [S].
3. Instagram bietet seit Nov. 2023 einen nativen Lyrics-Sticker in Reels [S]. Einfache Lyrics sind also Standard. Differenzierung braucht Konzept, nicht nur Schrift.
4. Specs-Konsens: 1080×1920, 30 fps, MP4/H.264 + AAC. Safe-Zones sind nur als Prozent-/Pixelwerte aus Drittquellen bekannt, TikTok veröffentlicht laut Quelle keine einzelne Pixelzahl [S][?].
5. Hook: Die ersten 1 bis 3 Sekunden gelten als entscheidend [S]. Phone-UI-Formate müssen deshalb Ton und Handlung ab Frame 0 haben.

## 2. Format-Familien: Was sie tragen

| Familie | Warum es funktioniert | Beleg |
|---|---|---|
| Phone-UI (Kontrollzentrum, Sperrbildschirm, Notizen, iMessage/WhatsApp, Anruf) | Vertraute Geste, Zuschauer „spielt mit"; erste Sekunde hat Handlung statt Titel; Neugier („was wird getippt?") | [E]; nur ein 2023er Notizen-Overlay-Trick [S] gefunden |
| Streaming-Player-Look (synced Lyrics) | Gewohnter Lesefluss, geringe Hürde; wirkt aber generisch und konkurriert mit Instagrams nativem Sticker | [S] Sticker; Rest [E] |
| Kinetic Typography | Bewegung am Beat hält Aufmerksamkeit, macht Betonung sichtbar | [S] „vom Experiment zum Standard" |
| Karaoke / Untertitel | Mitsingen, wortgenaues Lesen, klare Hierarchie | [S] (Tool-Anbieter) |
| Cinematic über Footage | Stimmung, Premium-Anmutung; Text nutzt Tiefe und Blend-Modi | [E] |
| Handschrift / Moodboard | Persönlich, „Tagebuch"-Gefühl, Schriftwahl nach Stimmung | [S] Moodboard-Trend 07/2025 |
| Retro / VHS / Y2K | Nostalgie, starker Wiedererkennungs-Look, Rauschen kaschiert Stockmaterial | [S] VHS-Filter-Trend, Camcorder-Hintergründe |
| Brutalist / Print | Harter Kontrast, passt zu Rap, sofort lesbar | [E] |
| Anime / Illustration | Fan-Communities, klare Figur als Anker; Grafiken nur eigene oder lizenzfreie | [E] |
| Minimal | Ruhe wirkt hochwertig bei Sad/Mel; weniger Ablenkung | [S] („minimal lyrics edit") |
| Code / Terminal, Game / Quiz | Nischen-Neugier; Quiz treibt Kommentare | [E] |
| Lückenfüller | Bildschirm bleibt in Instrumentals „aktiv", Retention bleibt hoch | [E] |

## 3. Plattform-Specs

| Parameter | TikTok | Instagram Reels | YouTube Shorts |
|---|---|---|---|
| Auflösung | 1080×1920, 9:16 [S]; Mindestwerte (z. B. 540×960) variieren [?] | 1080×1920, 9:16 [S] | vertikal 9:16 [S] |
| Framerate | 30 fps empfohlen [S] | 23 bis 60 fps akzeptiert (laut Zusammenfassung der Meta-Doku) [?] | keine Angabe gefunden |
| Codec/Bitrate | MP4/MOV, H.264 + AAC; keine offizielle Bitrate, 5 bis 10 Mbit/s als Faustwert [S] | H.264/AAC, VBR bis 25 Mbit/s, Audio AAC 48 kHz ≤128 kbit/s [?] | keine Angabe gefunden |
| Max. Länge | Upload bis 60 min, In-App 10 min; Verfügbarkeit je Konto unterschiedlich [S][?] | 90 s, 3 min oder 20 min je nach Quelle und Konto [?] | bis 3 min [O: support.google.com/youtube/answer/15424877] |
| Musik-Limit | Sound-Bibliothek, Rechte siehe Hinweis unten | Meta-Sound-Collection, nur Instagram/Facebook [S] | Shorts >1 min mit aktivem Content-ID-Claim werden blockiert; Bibliotheks-Songs oft nur 90 s [O: …/answer/13486873] |

**Safe-Zones (1080×1920).** TikTok liefert laut Quelle Overlay-Vorlagen je Platzierung statt einer festen Zahl [S]. Drittquellen nennen oben ca. 150 px, rechts ≥120 px, unten 350 bis 400 px frei [S][?]. Meta nennt für Reels-**Anzeigen** 14 % oben, 35 % unten, 6 % seitlich (≈270/670/65 px), rechts unten zusätzlich die Aktionsleiste (≈40 %). Für organische Reels gibt es keine offiziellen Werte [S][?]. Zuschnitte: Home-Feed 4:5 (1080×1350, y 285 bis 1635), Profilraster 3:4 (1080×1440) oder 1:1 (y 420 bis 1500), Quellen widersprechen sich [?]; Cover manuell setzen.

**Empfehlung [E, aus obigen Zahlen abgeleitet]: Lyrids-Textzone x 70 bis 960, y 300 bis 1250.** Schlüsselwort/Hook zusätzlich in y 420 bis 1250 (überlebt 1:1-Crop). Hintergrund immer vollflächig. Bei Phone-UI: Status-/Inselbereich darf verdeckt werden, bedienbare Elemente (Kacheln, Slider, Bubbles) gehören in die Textzone.

**Lautheit.** Kein offizieller TikTok-/Instagram-Wert gefunden. Üblich sind −14 LUFS integriert, True Peak −1 dBTP [S]; manche empfehlen lauter (−12 bis −13) [S][?]. Vorschlag [E]: ffmpeg `loudnorm=I=-14:TP=-1:LRA=11` (zweistufig), einmal gegen −12 testen. Master als AAC 192 bis 256 kbit/s, 48 kHz (Plattform kodiert neu).

**Hook-Regeln (1. Sekunde).** Aus [S]-Konsens („erste 1 bis 3 s entscheiden", Hook-Rate = Anteil ≥3 s Sehzeit) plus [E]:
1. Kein Logo, kein Schwarzbild, kein Titel-Intro. Frame 0 zeigt bereits Text/Motiv, Audio setzt ≤0,1 s ein.
2. Song ab der stärksten Stelle (Chorus/Punchline), Schnitt auf dem Beat; nie ab Songanfang, wenn dort ein ruhiges Intro liegt.
3. Erstes Lyric-Wort ≤0,3 s; im ersten Drittel jede 0,5 bis 1 s sichtbare Änderung.
4. Setup eines Formats (Swipe, Countdown) darf nie vor dem Ton liegen: Ton zuerst, Handlung läuft schon.
5. Loop: Schlussbild führt in Frame 0 zurück (Replays erhöhen Wiedergabezeit).
6. Instagram gewichtet laut Sekundärquellen Wiedergabezeit, Likes/Reichweite und Sends/Reichweite (Mosseri, Jan. 2025); „Schwellen" wie 50 % Skip sind unbelegt [?].

**Rechte-Hinweis.** Deutsche Quellen: Plattformlizenzen decken oft nur private Nutzung, auch Privatkonten wurden abgemahnt (Verlag, 2.500 € Forderung), SoundGuardian mahnt seit 2025 ab [S]. Songtext-Rechte (Verlag) sind nicht gesondert belegt. Keine Rechtsberatung, vor Skalierung klären.

## 4. Ideenkatalog (62 Konzepte)

**Familien:** PH Phone-UI · LF Lückenfüller · KT Kinetic Type · KA Karaoke/Untertitel · CI Cinematic · HW Handschrift · RE Retro/Y2K · BR Brutalist/Print · AN Anime · MI Minimal · CO Code · GA Game/Quiz. **Song:** Rap, Mel (melodisch), Sad, Hype, Party. **D** = Schwierigkeit: 1 HTML/CSS + einfache GSAP-Timeline; 2 mehrere Ebenen, SVG/Canvas, vorberechnete Audio-Daten (FFT-JSON); 3 Masken/3D/Vorab-Rendering (Blender). UI immer in **eigenem** Design, keine Fremdlogos.

| ID | Name | Fam. | Beschreibung | Bausteine | Song | D | Hook 0 bis 1 s |
|---|---|---|---|---|---|---|---|
| P01 | Kontrollzentrum-Swipe | PH | Panel fährt herunter, Finger schaltet WLAN aus, Nachtmodus an, Helligkeit/Lautstärke hoch, dann startet der Song. | Kacheln, Slider (CSS), GSAP-Timeline, Klicksounds | Rap, Hype | 2 | Panel offen, Finger tippt bei 0,2 s, Beat steigt mit Lautstärke-Slider |
| P02 | Sperrbildschirm | PH | Jede Zeile trifft als Benachrichtigung ein, Musik-Widget zeigt Fortschritt. | Uhr, Notification-Cards, backdrop-filter | Mel, Sad | 1 | Erste Notif schiebt bei 0,2 s rein |
| P03 | Notizen-Beichte | PH | Text tippt sich in eine Notiz, Zeilen werden gestrichen und ersetzt. | Linienpapier, Typing, Cursor, Markierung | Sad, Mel | 1 | Cursor tippt sofort den stärksten Satz |
| P04 | Chat-Duell | PH | Rap-Bars als Nachrichten zwischen zwei Kontakten, Adlibs als Antworten. | Bubbles, „schreibt…"-Punkte, Zeitstempel | Rap | 1 | Erste Blase zitiert die Punchline |
| P05 | Sprachnachricht | PH | Song läuft als Sprachnachricht, Wellenform wandert, Transkript darunter. | Waveform (SVG), Play-Button, Transkript | Sad, Mel | 2 | Daumen drückt Play bei 0,1 s |
| P06 | Synced-Player | PH | Aktive Zeile hell, Nachbarzeilen gedimmt, Fortschrittsbalken, Cover-Verlauf. | Auto-Scroll, Opacity-Staffel, Gradient | Mel, Party | 1 | Chorus-Zeile groß ab 0 s |
| P07 | Eingehender Anruf | PH | Anruf von „Lyrids", Annehmen, Song kommt aus dem Lautsprecher, Live-Untertitel = Lyrics. | Call-Screen, Slide-Geste, Untertitelbox | Mel, Party | 1 | Klingelton ist der Intro-Beat, Wisch bei 0,5 s |
| P08 | Song erkannt | PH | Erkennungs-Pulsringe, Treffer-Karte mit Cover, dann Lyrics. | Pulsringe (CSS), Karte, Gradient | Hype, Party | 1 | Pulsringe + Audio ab 0 s |
| P09 | Kamera-Aufnahme | PH | Sucher mit REC-Timer, Fokusrahmen; Blitz-Flash beim Drop; Lyrics als Live-Untertitel. | Fokusquadrat, REC-Punkt, Pinch-Zoom | Hype, Rap | 2 | Fokus rastet bei 0,3 s ein |
| P10 | Such-Autocomplete | PH | Suchfeld tippt eine Zeile, die Vorschläge sind die nächsten Zeilen. | Input, Vorschlagsliste, Typing | Sad, Mel | 1 | Provokante Suchfrage schon halb getippt |
| P11 | Akku-3-%-Blackout | PH | Warnung, Sparmodus färbt UI gelb, Display flackert aus und bootet in den Song. | Pop-up, Flicker, eigenes Boot-Icon | Hype, Rap | 2 | Warn-Pop-up + Ping bei 0 s |
| P12 | Emoji-Tastatur | PH | Zeilen werden getippt, am Zeilenende wählt der Finger ein Emoji. | Keyboard-Raster, Tap-Ripple, Emoji-Pop | Party, Mel | 2 | Emoji-Tap auf Kick bei 0,2 s |
| L01 | Ring-Visualizer | LF | Spektrumring um Cover/Emoji, Radius folgt dem Pegel. | FFT-JSON, Canvas, GSAP | Hype, Rap | 2 | Ring reißt bei 0 s auf Kick auf |
| L02 | Driftende Emojis | LF | Zum Text passende Emojis schweben parallax durchs Bild und pulsen mit dem Bass. | Sprite-Layer, Noise-Drift, Parallax | Party, Mel | 1 | Riesiges Emoji schlägt bei 0 s ein |
| L03 | Drop-Countdown | LF | Große Ziffern/Takte zählen zum Drop, Bild verengt sich. | Zahlen-Slam, Vignette, Shake | Hype, Party | 1 | „3" steht bei 0 s |
| L04 | Abspann-Roll | LF | Credits scrollen im Instrumental („Musik", „Text", „Besetzung: Dein Herz"). | Scroll-Container, Serifen, 2 Spalten | Sad, Mel | 1 | Credits laufen schon, erste Zeile = Hook-Satz |
| L05 | Kommentar-Strom | LF | Erfundene Kommentare (generische Nicknames) scrollen hoch, reagieren auf Beat und Drop. | Kommentar-Cards, Herz-Zähler | alle | 1 | Kommentar mit Frage bei 0,3 s |
| L06 | Live-Chat-Flut | LF | Stream-Chat mit Emote-Spam, explodiert beim Drop. | Chat-Zeilen, Emote-Sprites, Speed-Ramp | Hype, Party | 1 | Emote-Wand bei 0 s |
| L07 | Wellenlinie | LF | Horizontale Linie zeichnet die Audiowelle und löst sich in eine Lyric-Zeile auf. | SVG-Path, FFT, Morph | Mel, Sad | 2 | Linie schlägt bei 0,2 s aus |
| L08 | Plattenteller | LF | Platte dreht, Tonarm setzt auf, Rillenglanz folgt dem Bass. | Rotation, Tonarm-SVG, Lichtreflex | Sad, Mel | 1 | Tonarm knackt bei 0,2 s auf |
| L09 | Skyline-Equalizer | LF | Fenster einer Skyline leuchten nach Frequenzbändern. | Rechteck-Skyline, 8 bis 16 FFT-Bänder, Glow | Rap, Hype | 2 | Alle Fenster blitzen bei 0 s |
| L10 | Sternbilder | LF | Sterne verbinden sich in Pausen zu Umrissen des nächsten Schlüsselworts. | Canvas-Punkte, Linien-Draw, Twinkle | Sad, Mel | 2 | Erste Sternlinie bei 0,2 s |
| L11 | Regen am Fenster | LF | Tropfen laufen, Zeilen erscheinen als Beschlag, Finger wischt frei. | Canvas-Tropfen, Blur-Maske | Sad | 3 | Hand wischt Wort frei bei 0,3 s |
| L12 | Fake-Ladebalken | LF | „Drop lädt… 87 %", Balken füllt sich passend zum Instrumental. | Progress-Bar, Zahlen-Tween, Glitch | Hype, Party | 1 | Balken steht bei 60 % |
| L13 | Reim-Marker | LF | Reimwörter werden farbig markiert und per Bogen verbunden. | Span-Highlights, SVG-Bögen | Rap | 2 | Zwei Reimwörter leuchten bei 0,3 s |
| L14 | Lava-Gradient | LF | Fließende Farbblobs, Energie steuert Tempo und Farbe. | Gradient-Blobs, Blur, Grain | Mel, Sad | 1 | Farbausbruch auf Kick bei 0 s |
| K01 | Beat-Slam | KT | Wörter schlagen auf den Kick ein, Kamera zuckt, Größe folgt der Betonung. | GSAP scale/shake, Wort-Timestamps | Rap, Hype | 2 | Erstes Wort füllt bei 0 s den Screen |
| K02 | Text-Tunnel | KT | Wörter fliegen durch einen 3D-Tunnel auf den Betrachter zu. | CSS-3D translateZ, Perspektive | Hype | 2 | Wort rast bei 0 s heran |
| K03 | Text als Fenster | KT | Riesige Buchstaben maskieren einen laufenden Hintergrundclip. | background-clip, Mask, Video | Rap, Mel | 2 | Buchstabe öffnet sich bei 0,3 s zum Clip |
| K04 | Erpresserbrief | KT | Ausgeschnittene Buchstaben in Wechselfonts, Papiertextur, Stop-Motion-Wackeln. | Zufallsfonts, Rotation, 8-fps-Stepping | Rap | 1 | Zettel klatscht bei 0 s auf |
| K05 | Gummiband-Silben | KT | Buchstaben dehnen sich elastisch pro Silbe, lange Töne werden sichtbar gezogen. | GSAP elastic, Per-Letter-Split | Mel, Party | 2 | Erster langer Ton dehnt ab 0 s |
| K06 | Echo-Stapel | KT | Chorus-Wort wiederholt sich als schrumpfende Echo-Ebenen. | Layer-Klone, Stagger | Hype, Party | 1 | Wort mit sechs Echos bei 0,1 s |
| K07 | Textpfad | KT | Zeilen laufen entlang einer Spirale oder Welle, Kamera folgt. | SVG textPath, Pfad-Animation | Mel, Sad | 2 | Pfad schwingt bei 0 s ins Bild |
| S01 | Karaoke-Füllung | KA | Wort für Wort füllt sich farbig, zwei Zeilen sichtbar. | clip-path, Wort-Timings | alle | 1 | Sweep läuft bei 0 s schon |
| S02 | Kino-Untertitel | KA | 2,39:1-Letterbox, Filmkorn, Untertitel unten wie im Film. | Balken, Grain, Serifen | Sad, Rap | 1 | Szene + Untertitel bei 0 s |
| S03 | Zweisprachig | KA | Original groß, Übersetzung klein darunter (Reichweite DE/EN). | Zwei Textebenen | alle | 1 | Beide Zeilen ab 0 s |
| S04 | Ein-Wort-Takt | KA | Pro Wort ein Vollbild-Wort, harte Cuts im Beat. | Cuts, Farbwechsel, Fonts | Rap, Hype | 1 | Erstes Wort exakt auf Kick |
| C01 | Text hinter Objekt | CI | Wörter laufen hinter einem freigestellten Motiv (Tiefe). | Vorab-Maske, z-Layer | Mel, Sad | 3 | Motiv schneidet bei 0 s durch den Schriftzug |
| C02 | Trailer-Titelkarten | CI | Trailer-Stil mit Hook-Satz-Karten, Stille, dann Drop. | Karten, Korn, Slow-Zoom | Hype | 2 | Karte mit Hook-Satz bei 0 s, ohne Schwarzblende |
| C03 | 2,5D-Foto | CI | Standbild mit Tiefenebenen, Kamerafahrt, Zeilen schweben im Raum. | Layer-PNGs, GSAP-Kamera, Partikel | Sad, Mel | 2 | Kamera schiebt bei 0 s los |
| C04 | Footage + Blend | CI | Dunkel getönter Clip, Text mit mix-blend-mode, Wort-Highlight im Beat. | Video-BG, Grading, Blend | alle | 1 | Starker Clip-Frame + Wort bei 0 s |
| H01 | Tagebuch-Schrift | HW | Stift schreibt die Zeilen live aufs Papier. | stroke-dashoffset, Pfad-Schrift, Papier | Sad, Mel | 2 | Stift setzt bei 0 s an |
| H02 | Kritzel-Notizen | HW | Pfeile, Unterstreichungen und Doodles umkreisen Schlüsselwörter. | SVG-Doodles, Draw-on | Rap, Party | 2 | Kreis um Wort bei 0,2 s |
| H03 | Post-it-Wand | HW | Pro Zeile klebt ein Zettel, die Wand füllt sich zum Chorus. | Zettel-Cards, Schatten, Rotation | Party, Mel | 1 | Zettel klatscht bei 0 s |
| R01 | VHS-Camcorder | RE | REC-Punkt, Datumsstempel, Tracking-Rauschen, Zeilen als Kamera-Untertitel. | SVG-Filter, Scanlines, Chroma-Versatz | Sad, Mel | 2 | Tracking-Glitch + REC bei 0 s |
| R02 | Y2K-Chrome | RE | Chrom-Verlauf, Sterne, Bubble-Schrift, Glitzer. | Gradients, SVG-Sterne | Party, Hype | 2 | Chrom-Wort blitzt bei 0 s |
| R03 | Retro-Desktop | RE | 90er-Fenster mit Fehlermeldungen, Ladebalken, Player-Visualizer. | Window-Chrome (eigen), Pixelfont | Hype, Rap | 2 | Fehlerfenster poppt bei 0 s |
| R04 | Kassette | RE | Spulen drehen, handbeschriftetes Etikett, Lyrics auf Booklet-Zettel. | SVG-Spulen, Rotation, Papier | Sad, Mel | 2 | Play-Taste klackt bei 0 s |
| R05 | 8-Bit-Dialog | RE | RPG-Dialogbox tippt jede Zeile mit Blip-Sound. | Pixelfont, Typing, Sprite | Party, Hype | 1 | Box sagt Hook-Satz bei 0 s |
| B01 | Brutalist-Raster | BR | Riesige Systemschrift, harte Rahmen, rohe Farbfelder. | CSS-Grid, Mono-Fonts, Borders | Rap | 1 | Wort füllt Bild, Hard-Cut bei 0 s |
| B02 | Swiss-Poster | BR | Asymmetrisches Raster, große Ziffern, Flächenfarben. | CSS-Grid, Zahlen-Tween | Mel, Party | 2 | Plakat baut sich in 0,5 s auf |
| B03 | Extrablatt | BR | Zeitung mit Lyric als Schlagzeile, Ticker unten. | Spalten, Halbton, Ticker | Rap | 2 | Zeitung klatscht bei 0 s auf |
| A01 | Visual-Novel | AN | Illustrierte Figur (eigene Grafik) spricht die Zeilen, Speedlines beim Drop. | Sprite, Textbox, Speedlines | Mel, Hype | 2 | Figur ruft Hook-Satz bei 0 s |
| A02 | Manga-Panels | AN | Seite aus Panels, Sprechblasen, Halbton, Impact-Effekte. | clip-path-Panels, Halftone | Hype, Rap | 3 | Panel-Zoom auf Kick |
| M01 | Ein Wort, ruhig | MI | Ein Wort auf Farbfläche, sanftes Atmen, sehr viel Weißraum. | Typografie, langsame Easings | Sad | 1 | Wort schon voll sichtbar bei 0 s |
| M02 | Atmende Zeile | MI | Eine Zeile pulsiert zwischen Unschärfe und Schärfe im Atemrhythmus. | filter blur, GSAP | Sad, Mel | 1 | Zeile scharf bei 0 s |
| M03 | Taschenlampe | MI | Dunkler Raum, Lichtkegel enthüllt Wort für Wort. | radial-gradient-Maske, Pfad | Sad, Mel | 1 | Lichtkegel findet Wort bei 0 s |
| T01 | Terminal | CO | Befehl `play track`, Lyrics als Konsolen-Log, Fortschritt in %. | Mono-Font, Typing, Blink | Rap, Hype | 1 | Befehl läuft bei 0 s, grüne Zeile |
| T02 | Code-Editor | CO | Lyrics als Code mit Syntax-Farben, Adlibs als Kommentare, „Build failed" beim Drop. | Highlight-Farben, Zeilennummern | Rap | 2 | Fehlerwelle bei 0 s |
| X01 | Quest-HUD | GA | Lebensbalken, Quest-Log, „Achievement freigeschaltet" beim Drop. | HUD-Elemente, Popups | Hype, Party | 2 | Achievement-Pop bei 0 s |
| X02 | Lückentext-Quiz | GA | Zeile mit fehlendem Wort, drei Optionen, Countdown, Auflösung im Gesang; treibt Kommentare. | Option-Cards, Timer-Ring | alle | 2 | Frage + Optionen ab 0 s |
| X03 | Reim-Duell | GA | Zwei Seiten kontern abwechselnd, Lebensbalken sinken. | Split-Screen, HP-Balken, Shake | Rap | 2 | „Runde 1"-Stempel bei 0 s |

Zusatzidee: Lückenfüller L01 bis L14 lassen sich als Bausteine in jedes andere Format einsetzen (Intro, Instrumental, Outro).

## 5. Rotation und Testplan

**Rotation [E, nicht aus Daten]:**
- Pro 10 Videos: 6 mit bewährten Formaten (max. 2 Familien), 3 aus rotierenden Serien, 1 Experiment.
- Dasselbe Template frühestens nach 3 bis 4 anderen Videos wiederholen. Eine ganze Familie höchstens 40 % der Videos pro Woche.
- Gewinner (siehe Regel unten) alle 3 bis 4 Videos wiederholen, aber das Szenario wechseln (Kontrollzentrum, dann Sperrbildschirm, dann Anruf). Liegt ein Format zweimal in Folge unter dem Konto-Median, 2 bis 3 Wochen pausieren.
- Konstante Marke: Palette, Soundlogo, kleiner Handle innerhalb der Safe-Zone. Lückenfüller separat rotieren.

**Testplan:**
1. **Baseline (Woche 1 bis 2):** 6 bis 8 Videos im bisherigen Format. Median von Aufrufen, Ø Wiedergabezeit/Länge und Shares/Aufrufe bestimmen.
2. **Formattest (Woche 3 bis 6):** 3 bis 4 Formate parallel, je **6 bis 8 Videos**, Zuweisung zufällig über Songtyp-Quoten (Rap, Mel, Sad, Hype, Party gleichmäßig). Konstant halten: Länge ±5 s, Uhrzeit-Fenster, Caption-Schema, Hashtag-Anzahl, Cover-Regel. Nur eine Variable je Test.
3. **Hook-Test:** im Siegerformat zwei Hook-Varianten (z. B. Chorus vs. Strophe, Text-Slam vs. ruhig) à 5 bis 6 Videos.
4. **Auswertung nach 72 h und 7 Tagen.** Wegen stark schiefer Verteilung Median statt Mittelwert. Mit n=6 bis 8 sind nur große Unterschiede (ca. ≥1,5×) erkennbar. Vorschlag: Sieger = Median ≥1,5× Baseline und ≥2/3 der Videos über Baseline-Median; Verlierer = ≤0,7×.
5. Gleiche Song-Kombination nicht doppelt in zwei Formaten testen (Cannibalization unbekannt [?]).

**Messwerte (Feldnamen je App-Version prüfen):**
- TikTok Studio [E]: Aufrufe, Ø Wiedergabedauer (÷ Länge), Anteil komplett gesehen, Retention-Kurve (Absprungsekunde), Traffic „Für dich"-Anteil, Neue Zuschauer, Shares, Saves, Kommentare, Follower-Gewinn.
- Instagram Insights [E]: Reichweite, Wiedergaben, Ø Wiedergabezeit, Sends/Shares pro Reichweite, Saves, Likes pro Reichweite, Nicht-Follower-Anteil, Follower-Gewinn.
- Pro Video protokollieren: ID, Format, Song, Songtyp, Länge, Datum/Uhrzeit, Hook-Variante, Ton gesperrt/stummgeschaltet (ja/nein), alle Messwerte. Primärmetrik: Wiedergabe-% (Retention), Sekundär: Shares/Aufrufe, Follower pro 1.000 Aufrufe.

## 6. Offene Fragen
- Woher stammt das Audio (TikTok-Sound-Bibliothek oder eigene Datei) und gibt es Lizenzen für Songs und Texte?
- Business- oder Creator-Konto (Analytics-Umfang, Sound-Einschränkungen)?
- Aktuelle Baseline-Zahlen (Median Aufrufe, Ø Wiedergabezeit) und Zielvideolänge?
- Direkt prüfen: TikTok Creative Center und Beispielvideos in der App, um die Popularität der Phone-UI-Formate zu belegen.
- Safe-Zone-Overlay-Vorlagen von TikTok und Meta-Hilfecenter-Seiten prüfen (nicht gelesen).

## 7. Quellen (Suchtreffer, nicht direkt gelesen)
- YouTube Shorts: https://support.google.com/youtube/answer/15424877 · Musik: https://support.google.com/youtube/answer/13486873
- Reels-Specs/Safe-Zones: https://www.hopperhq.com/blog/instagram-reel-size/ · https://www.trymypost.com/blog/instagram-reels-safe-zones-text-placement-2026 · https://adkit.so/tools/safe-zones/meta
- TikTok-Specs/Safe-Zones: https://www.trymypost.com/blog/tiktok-ad-specs-2026-safe-zones · https://affroom.com/blog/tiktok-safe-zone/ · https://postfa.st/sizes/tiktok/video/2025
- TikTok-Länge: https://sociality.io/blog/tiktok-video-length/ · https://openclip.app/guides/tiktok-video-length
- Reels-Länge: https://www.inro.social/blog/instagram-reels-can-now-be-20-minutes-long-new-time-limit-explained-2025
- Lautheit: https://openclip.app/learn/loudness-standard · https://thepostflow.com/post-production/post-production-workflows/export-settings-youtube-instagram-tiktok/
- Hook/Algorithmus: https://nestscale.com/?p=47200 · https://www.eclincher.com/articles/how-the-instagram-algorithm-works-in-2026
- Lyric-Stile: https://artdependence.com/articles/karaoke-meets-aesthetic-building-moodboard-style-lyric-videos-for-tiktok · https://invideo.io/make/lyric-video-maker/ · https://www.tiktok.com/discover/lyric-video-edits
- Instagram-Lyrics-Sticker (Nov. 2023): https://onlinemarketing.de/unternehmensnews/instagram-lyrics-jetzt-auch-in-den-reels
- Rechte: https://www.zdfheute.de/ratgeber/instagram-musik-reels-gema-urheberrecht-schadensersatz-100.html · https://www.it-recht-kanzlei.de/nutzung-musik-instagram-tiktok-soundguardian.html
