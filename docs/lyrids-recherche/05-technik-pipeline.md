# 05 – Technik-Pipeline für Lyrids: Alignment, Stems, Beat, Render, Rechtschreibung, QA

Stand: 2026-10-10. Ziel: normaler Windows-PC, möglichst CPU-only, nur freie Lizenzen.

**Legende:** **[V]** an Primärquelle geprüft (README, Quellcode, PyPI, npm, conda-forge). **[S]** nur Suchtreffer oder Drittquelle. **[E]** eigene Annahme oder Schätzung, vor Einsatz testen.
Nicht erreichbar waren aus der Recherche-Umgebung: readthedocs, arXiv, Hugging Face, ffmpeg.org, TikTok/Meta. Dafür wurden GitHub-Rohdateien, PyPI, npm und conda-forge genutzt.

## 0. Kurzfazit

1. **"Nichts Hörbares ignorieren" wird am Gesangs-Stem gemessen, nicht am Text.** Die Abdeckung (Gesangsaktivität geteilt durch Zeit mit Text) ist die zentrale Kennzahl. Jede hörbare Stelle ohne Text blockiert den Render, bis sie Text hat oder ein ausdrückliches `ignore` mit Grund.
2. **Standard-Alignment:** faster-whisper (freie Transkription) plus WhisperX-Alignment, beide CPU-tauglich. Zweite, unabhängige Messung nur für Zweifelszeilen.
3. **Zwei Stimmen:** Lead und Backing per Stem-Trennung, je Text eine eigene Spur. Fallback: zwei getrennte Alignment-Läufe auf demselben Audio.
4. **Beat:** beat-this (MIT) liefert Beats und Downbeats, librosa die Energiekurve. Eine `beats.json` speist GSAP.
5. **Render:** eigenes HTML behalten, aber als reine Funktion der Zeit (`render(t)`); Frames per Playwright, Audio per ffmpeg. HyperFrames ist der Migrationspfad.

```
song.wav ─► Stems (Gesang | Lead | Backing | Instrumental)
  │              ├─► VAD/Energie ──► vocal_activity.json ─┐
  │              ├─► freie Transkription (Whisper) ───────┤
  │              └─► Forced Alignment (Text A, Text B) ───┤
  └─► Beats/Onsets/Energie ─► beats.json                   ▼
                          Diff + Abdeckung + QA ─► timeline.json ─► render(t) ─► ffmpeg ─► mp4
```

Gemeinsamer Nenner der Python-Pakete ist **Python 3.12**: librosa 1.0.0 braucht ≥3.12, WhisperX <3.14 [V PyPI].

## 1. Forced Alignment, Transkription, Mismatch-Erkennung (Probleme a, c)

| Tool | Stand [V] | Lizenz | Eignung für Lyrids |
|---|---|---|---|
| faster-whisper | 1.2.1 (31.10.2025) | MIT | Freie Transkription. `device="cpu", compute_type="int8"`, `word_timestamps=True`. Achtung: `WhisperModel.transcribe` hat `vad_filter=False`, `BatchedInferencePipeline` standardmäßig **True** und kann leise Ad-libs verwerfen. Hilfreich: `hallucination_silence_threshold`, `hotwords`, `condition_on_previous_text`. |
| WhisperX | 3.8.6 (25.05.2026), 3.8.7rc1 | BSD-2 | CTC-Alignment mit wav2vec2, richtet **jede Zeile innerhalb eines Start/Ende-Fensters** aus. Deutsch-Standard: `VOXPOPULI_ASR_BASE_10K_DE`. Unbekannte Zeichen laufen über eine Wildcard-Spalte, liefert Wort-`score`. README-Grenzen: Zahlen wie "2014." nicht alignbar, Überlappsprache schwach. VAD (pyannote oder `--vad_method silero`, `--vad_onset` senken, falls Sprache fehlt). |
| stable-ts | 2.19.1 (16.08.2025) | MIT | `model.align(audio, text, language)` für den ganzen Text ohne Fenster, `--align text.txt`. **Repo "indefinitely paused"**: nur als Zweitmessung. |
| Montreal Forced Aligner | 3.4.3 (08.10.2026) | MIT | Kaldi GMM-HMM, Modell *German MFA v3.0.0* (CC BY 4.0, Common Voice 16.1 plus GlobalPhone). Install per conda-forge (kaldi/kalpy haben win-64-Builds). Braucht Aussprachewörterbuch, für Slang G2P. Für Sprache gebaut, nicht für Musik [E]. `mfa align` wird in MFA 4.0 (Ende 2026 geplant) umgestellt, neu: `mfa align_hf`. Nur wählen, wenn Phonem-Genauigkeit gebraucht wird. |
| ctc-forced-aligner | 1.0.2 (02/2025) | BSD-2, **Standardmodell CC-BY-NC 4.0** | Globales CTC mit `<star>`-Token (toleriert Fremdmaterial), 1130 Sprachen, JSON-Ausgabe. Nichtkommerzielles Modell → bei monetarisiertem Konto eigenes Modell wählen (`--alignment_model`). |
| Qwen3-ForcedAligner-0.6B | 29.01.2026 | Paket `qwen-asr` Apache-2.0 [V]; Modell-Lizenz [S] | 11 Sprachen inkl. Deutsch, Wort/Zeichen-Zeitstempel, Clips bis ca. 5 min [S]. Neu und ungetestet für Gesang: nur als Kandidat. |
| TIFA (openvpi) | 2026 | – | Für Gesang gebaut, Standard-G2P aber nur Chinesisch/Japanisch/Englisch [V README] → für Deutsch ungeeignet. |

**Genauigkeit Deutsch, Rap, schnelle Sprache:** Einen belastbaren Benchmark für deutschen Rap habe ich nicht gefunden [E]. Belegt ist: Trennung hilft Whisper nicht immer; ein Interspeech-2025-Beitrag nennt für Whisper large-v2 36,80 WER ohne, 37,50 mit HTDemucs und 32,36 mit einem anderen Trenner (englische Musik) [S]: die Wahl des Trenners zählt. Syed et al. (arXiv 2506.15514) berichten, dass Deletionen vor allem **nicht-lexikalische Laute und Backing-Vocals** betreffen [S]. Genau das ist Problem (a). Folge: **Mix und Stem getrennt transkribieren und die Vereinigung bilden.** Zahlen ausschreiben, und pro Wort `anzeige` und `align` (phonetische Schreibweise für Slang) getrennt halten [E].

### Empfohlener Ablauf

1. **Vorbereiten:** Original behalten; Kopie 16 kHz mono für ASR.
2. **Freie Transkription** je Quelle (Mix, Gesangs-Stem, ggf. Lead/Backing), Sprache `de`; zwei Läufe, VAD aus und VAD an. Lokal: `whisperx song.wav --model large-v2 --language de --device cpu --compute_type int8 --output_format json` (Flags einzeln in README/Code belegt).
3. **Zeilen zu Fenstern:** Lyrics-Zeilen per Fuzzy-Match (rapidfuzz, MIT) den Transkript-Segmenten zuordnen, so entstehen die Fenster für WhisperX-Alignment.
4. **Alignment der gelieferten Texte** (WhisperX). Zeilen mit fehlenden Wort-Zeiten oder niedrigem `score` sind rot. Zweitmessung (stable-ts oder ctc-forced-aligner): weichen Startzeiten um mehr als 0,3 s ab, wird die Zeile "unsicher" [E].
5. **Diff-Bericht:** beide Texte normalisieren (Unicode NFKC, Kleinschreibung, Satzzeichen weg, Umlaute behalten, Zahlen ausschreiben), tokenweise vergleichen (`difflib` oder rapidfuzz-Opcodes, Wortgleichheit ab Ähnlichkeit ca. 0,8, weil ASR bei Slang abweicht [E]). Klassen:
   - `GLEICH`, `ASR_VARIANTE` (ähnlich, nur Hinweis);
   - `FEHLT_IM_TEXT`: im Transkript, nicht in der Datei, mit Zeitstempel und Hörprobe-Link. **Hart blockierend** ab 2 Wörtern oder 0,8 s [E];
   - `NICHT_IM_AUDIO`: Zeile ohne Treffer oder mit niedrigem Score.
6. **Auflösen:** Ergänzungen in `adlibs.json` (`t0,t1,text,art` mit art = Ad-lib, gesprochen, Backing) oder `ignore` mit Grund (z. B. Atem). Danach Abdeckung neu messen.

## 2. Stem-Trennung, Lead und Backing (Problem b)

| Tool | Stand [V] | Lizenz | Hinweise |
|---|---|---|---|
| Demucs (htdemucs, `htdemucs_ft`) | 4.1.0 (11.07.2026) | MIT | Vocals/Drums/Bass/Other. CPU ca. 1,5× Songlänge (README), `htdemucs_ft` 4× langsamer. **Kein Lead/Backing-Split.** `demucs --two-stems=vocals -d cpu myfile.mp3`. |
| audio-separator | 0.47.0 (27.08.2026) | MIT | CLI und Python, bündelt UVR-Modelle. `pip install "audio-separator[cpu]"`. `--list_models` zeigt SDR. Vocals: `model_bs_roformer_ep_317_sdr_12.9755.ckpt` (SDR 12.9). Karaoke-Modelle (Lead entfernen): `mel_band_roformer_karaoke_aufr33_viperx_sdr_10.1956.ckpt`, `..._gabox.ckpt`, `..._becruily.ckpt`, `bs_roformer_karaoke_anvuew.ckpt`; Preset `karaoke` (3-Modell-Ensemble). DirectML (AMD/Intel) nur experimentell, RoFormer läuft dort auf der CPU. |
| UVR (GUI) | – | MIT, Credit-Pflicht | Gleiche Modelle mit Oberfläche; GPU ab GTX 1060 6 GB. Für einmaliges Probehören praktisch. |

CPU-Zeiten der RoFormer-Modelle sind nicht belegt: an **einem** Song messen [E]. Modellgewichte sind einzeln lizenziert, nicht einzeln geprüft [E].

**Zwei Texte, zwei Spuren:**
1. Stufe 1: Gesangs-Stem (BS-RoFormer). Stufe 2: Karaoke-Modell auf dem Gesangs-Stem. Welcher Ausgabe-Stem "Lead" ist, per Anhören prüfen: Bei diesen Modellen ist "vocals" der Lead, der Rest enthält das Backing [E].
2. Text A gegen Lead, Text B gegen Backing alignen; beide Läufe haben eigenen Diff und eigene Abdeckung.
3. **Fallback bei Übersprechen:** beide Texte unabhängig gegen denselben Gesangs-Stem alignen. Jeder Lauf sucht nur seine Wörter, Gleichzeitigkeit stört also nicht [E, an Song 15 testen].
4. `timeline.json` hat `tracks: [{id:"lead",...},{id:"back",...}]`; Renderer: Lead groß in der Mitte, Backing kleiner, andere Farbe, Versatz oben/unten.

**`timeline.json` (Vorschlag, einzige Quelle für den Renderer):**
```json
{"song":"07","fps":30,"duration":184.2,
 "tracks":[{"id":"lead","words":[{"t0":12.41,"t1":12.78,"anzeige":"Nacht","align":"nacht","score":0.91}]},
           {"id":"back","words":[]}],
 "adlibs":[{"t0":40.1,"t1":41.0,"text":"yeah","art":"ad-lib"}],
 "ignore":[{"t0":3.2,"t1":3.6,"grund":"Atmer"}],
 "gaps":[{"t0":60.0,"t1":68.5,"scene":"recap"}]}
```

## 3. Beat, Tempo, Onset, Drop (Problem f)

| Tool | Stand [V] | Lizenz | Urteil |
|---|---|---|---|
| **beat-this** | 1.1.0 (14.04.2026) | MIT | Beats **und Downbeats** ohne DBN, ISMIR 2024. CPU mit `--gpu=-1`, Modell `small0` nur 8,1 MB. `beat_this song.wav -o song.beats`. Python: `File2Beats(checkpoint_path="final0", device="cpu")` → `beats, downbeats`. **Erste Wahl.** |
| librosa | 1.0.0 (11.08.2026) | ISC | `beat.beat_track(y=..., sr=..., units="time")` (alle Argumente keyword-only), `onset.onset_detect`, `onset_strength`, RMS. Keine Downbeats. Für Onsets und Energiekurve. |
| madmom | 0.16.1 (2018) | Code BSD, **Modelle CC BY-NC-SA** | Nur Quellpaket, PyPI-Version laut beat-this-README nur für Python <3.10. Weglassen. |
| Essentia | 2.1b6.dev1438 (19.05.2026) | AGPL-3.0 | PyPI-Wheels nur macOS/Linux → unter Windows nur via WSL. Weglassen. |
| HyperFrames `beats` | 0.8.145 | Apache-2.0 | Einfache BPM/Beat-Liste (Zeit, Stärke), keine Downbeats. Nur bei Migration. |
| allin1 | 1.1.0 (2023) | – | Brauchte NATTEN und madmom von GitHub [S]; Drops nicht belegt. |

Genre-spezifische Genauigkeit (Rap/Electronic) konnte ich nicht belegen: auf zwei Songs gegen das Gehör prüfen [E].

**`beats.json` (Vorschlag):**
```json
{"version":1,"audio":"song.wav","bpm":128.0,
 "beats":[{"t":2.027,"bar":1,"beat":1,"downbeat":true,"strength":0.92}],
 "onsets":[{"t":2.31,"s":0.7}],
 "energy":{"hop":0.0333,"rms":[0.1,0.2],"low":[0.0,0.3]},
 "sections":[{"t0":0,"t1":14.2,"kind":"intro"},{"t0":14.2,"t1":42,"kind":"drop"}]}
```
**Drop/Break-Heuristik [E]:** Tiefband (ca. 20–150 Hz) glätten (1 s); "Drop" = Anstieg um mehr als X dB innerhalb eines Takts nach mindestens zwei ruhigen Takten, "Break" = Absturz. Per Gehör gegenprüfen, bei Rap eher "Hook-Einsatz".

**Nutzung mit GSAP:** Animationen **nicht als Callbacks**, sondern als reine Tweens auf Beatzeiten (`tl.fromTo(el,{scale:1.12},{scale:1,duration:0.18},b.t)`), damit Springen in der Zeit dasselbe Bild liefert. Alternativ kontinuierlich: `scale = 1 + a·exp(-k·(t − letzterBeat(t)))`, mit Binärsuche in `beats`. Downbeats treiben große Effekte (Szenenwechsel, Flash), normale Beats kleine (Puls).

## 4. Deterministisches Frame-Rendering (HTML → MP4)

| Option | Lizenz / Stand [V] | Windows | Determinismus | Aufwand |
|---|---|---|---|---|
| **Eigenes HTML + Playwright-Screenshots** | Playwright Apache-2.0 (npm 1.64.0) | ja | GSAP/JS exakt, wenn `timeline.time(t)` pro Frame gesetzt wird. CSS-Animationen und `<video>` brauchen Sonderbehandlung (`animations:"disabled"` springt zum Ende, spult nicht). | gering, vorhanden |
| **HyperFrames** | 0.8.145, Apache-2.0, Node ≥22 | ja, aber Mehr-Worker-Capture über Screenshots (BeginFrame nur Linux) | Seek je Frame, Adapter für GSAP/Lottie/WAAPI/CSS; `lint`, `check`, `beats`, `transcribe`, `--workers`, `--gpu` (HW-Encoder), `--docker` | mittel (Umbau), junges Projekt (Start laut Drittquellen 04/2026 [S]) |
| Remotion | 4.0.534, **Remotion-Lizenz**: gratis für Einzelpersonen und Firmen bis 3 Mitarbeiter; Version 5.0 ändert die Lizenz leicht | ja | sehr gut, React | hoch (Neuschreiben in React) |
| puppeteer-capture | 1.58.0, MIT | Linux und Windows | `beginFrame`, braucht `chrome-headless-shell`; "Experimental"-API | mittel |
| timecut/timesnap | letzte Version 2022 | – | nur JS-Zeit | meiden |

**Empfehlung:** eigenes HTML behalten und umbauen auf `render(t)`: kein `Date.now`, kein `requestAnimationFrame`, keine ungeseedete `Math.random`, alle Assets vorgeladen (Regeln deckungsgleich mit HyperFrames-Determinismus-Doku [V]). GSAP 3.15.0 hat `timeline.time(t)`, `seek(t)` und `gsap.updateRoot(t)` [V]. Alternative ohne Umbau: `page.clock.install()` und `runFor()` (überschreibt Date, Timer, rAF, performance [V]), deckt aber keine CSS-Animationen ab.

**Frames und Mux** (ffmpeg-Optionen `crf`, `preset`, `-movflags +faststart`, `loudnorm` in der ffmpeg-Doku belegt):
```
ffmpeg -framerate 30 -i frames/%06d.jpg -i song.wav -c:v libx264 -preset slow -crf 17 \
  -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest out.mp4
```
Playwright: `page.screenshot({type:'jpeg', quality:95})` (JPEG-Standard ist 80, PNG verlustfrei, aber langsamer [V]).

**Plattform-Werte (nur Drittquellen [S], Angaben widersprechen sich):** 1080×1920, 9:16, H.264/MP4, 30 fps (bis 60 möglich), AAC 48 kHz; Bitraten genannt 2–25 Mbit/s, Dateigröße mobil 72–288 MB. Ich empfehle 30 fps, CRF 16–18, optional `-maxrate 12M -bufsize 24M` [E]. Offizielle Seiten von TikTok/Meta waren nicht abrufbar.

**Lautheit:** Ein offizielles Ziel konnte ich nicht belegen; nur eine Drittseite nennt –14 LUFS für Reels [S]. Pragmatisch: Zweipass `loudnorm` (`I=-14:TP=-1:LRA=11`, erst `print_format=json` messen, dann `measured_*` plus `linear=true`) nur, wenn der Song mehr als ca. 2 LU abweicht; True Peak ≤ –1 dBTP [E]. Mit `ebur128`/`volumedetect` kontrollieren.

**Geschwindigkeit [E, nicht belegt]:** 60 s × 30 fps = 1800 Frames; bei 0,1–0,3 s je Screenshot ca. 3–9 min CPU. An einem 10-s-Test messen und hochrechnen. Ohne GPU keine WebGL-lastigen Effekte einplanen (Remotion-Doku: blur, Schatten, Gradients, WebGL laufen sonst langsam [V]).

## 5. Rechtschreibung offline (Problem e)

| Tool | Stand [V] | Lizenz | Urteil |
|---|---|---|---|
| **LanguageTool** (selbst gehostet) | 6.8 (05.05.2026), Java ≥17 | LGPL 2.1+ | Rechtschreibung **und** Grammatik, de-DE/en-US, lokal, HTTP-Server (`java -cp languagetool-server.jar org.languagetool.server.HTTPServer --port 8081` laut Projektdoku [S]). N-Gramm-Daten optional (ca. 8 GB, nur en/de/fr/es [S]), für Wortlisten nicht nötig. |
| language_tool_python | 3.4.0 (14.05.2026), Python ≥3.10 | GPL-3.0 (Wrapper) | Lädt LT 6.8 selbst. `disabled_rules`, `enabled_rules`, `disabled_categories`, `picky`, `new_spellings`, `new_spellings_persist`; Treffer mit `rule_id`, `message`, `offset`, `replacements` [V Quellcode]. |
| pyspellchecker | 0.9.1 | MIT | Schnelle Zweitprüfung, 'de' und 'en', aber ohne Grammatik und mit vielen Fehlalarmen bei deutschen Komposita [E]. |
| Hunspell-Wörterbücher | LibreOffice `de_DE_frami` | GPL 2/3 | Reine Wortprüfung; Python-Anbindung unter Windows unbequem (`hunspell` zuletzt 2018). |

**Slang und Allow-Listen:**
1. `allow_global.txt` (Markenname, Künstler, wiederkehrender Slang) plus `allow_<songnr>.txt`. Beim Start über `new_spellings=[...]`, `new_spellings_persist=False`, damit LTs eigene Wortliste nicht dauerhaft verschmutzt (Wrapper schreibt sonst in die Spelling-Datei [V]).
2. Stilregeln abschalten, die zu Lyrics nicht passen (Satzanfang, Kommas): erst einen Lauf machen, `rule_id`s sammeln, dann gezielt in `disabled_rules` eintragen. Keine Regel-IDs raten.
3. Absichtliche Abweichung markieren (eigene Konvention `{=gibts}`), alles Übrige ist Fehler.
4. **Geprüft wird der Anzeigetext aus `timeline.json`**, nicht die Quelldatei. Zusätzlich Vergleich Anzeige gegen Quelle: jede nicht erklärte Änderung ist ein Fehler.
5. Sprache je Zeile (`[de]`/`[en]`) im Lyrics-File markieren, damit LT die richtige Sprache nimmt [E].

## 6. QA-Checkliste pro Video (automatisierbar)

Ergebnis: `qa_report.json` plus `.md`; bei rot Abbruch (Exit-Code ≠ 0). Freigabe zum Posten bleibt manuell. Schwellen sind Startwerte [E].

| # | Prüfung | Methode | Regel |
|---|---|---|---|
| 1 | **Identität Song↔Text↔Video** (Problem c) | Manifest je Songnummer mit SHA-256 von Audio und Text; drei 20-s-Fenster transkribieren und mit der Textdatei vergleichen | Ähnlichkeit ≥ 0,6, sonst Stopp. Vermutete Ursachen: Nummern-/Dateiverwechslung, falsche Songversion, veralteter Zwischenstand [E] |
| 2 | Dauer | `ffprobe` Video- und Audiostrom | \|Δ\| ≤ 1 Frame + 50 ms; Frames = round(Dauer × fps) |
| 3 | Erstes/letztes Wort | erstes Gesangs-Onset (VAD) gegen erstes Wort; letztes Wort-Ende gegen Gesangsende | ±0,3 s; Wort-Ende ≤ Audio-Ende |
| 4 | Alignment-Güte | WhisperX-`score`, Wörter ohne Zeitstempel | Zeile rot bei ≥ 30 % ohne Zeit oder Score < 0,3 |
| 5 | **Abdeckung** (Problem a) | Gesangsaktivität (Silero-VAD aus faster-whisper oder `silencedetect` auf dem Stem) ∩ Textzeiten (je Wort ±0,15 s) | ≥ 97 %; jede ungedeckte Lücke ≥ 0,4 s samt Transkript-Schnipsel auflisten |
| 6 | Text ohne Ton | Diff-Klasse `NICHT_IM_AUDIO` | 0 offene |
| 7 | **Stille-Lücken** (Problem d) | Lücke = kein Text **und** kein Gesang (nur "kein Text" würde nicht notierten Gesang als Leerlauf behandeln). `ffmpeg -i vocals.wav -af silencedetect=noise=-35dB:d=2 -f null -` | Lücke > **N = 2,0 s** → Füllszene Pflicht; 0,8–2,0 s nur Mikro-Füllung (Beat-Puls, Echo des letzten Worts) |
| 8 | Render gegen Plan | Playwright liest zu 10 zufälligen Zeitpunkten den sichtbaren DOM-Text und vergleicht mit `timeline.json` (kein OCR nötig) | 100 % gleich |
| 9 | Rechtschreibung | LT über alle Anzeigestrings | 0 Treffer nach Allow-Liste |
| 10 | Ton-Endkontrolle | `loudnorm print_format=json` bzw. `ebur128` | Ziel ±1 LU, True Peak ≤ –1 dBTP |
| 11 | Bild | `freezedetect` (`d=2`), `blackdetect` | keine Standbilder > 2 s, kein Schwarz |
| 12 | Ende-zu-Ende | Audio aus dem fertigen MP4 erneut transkribieren, mit Lyrics vergleichen | Ähnlichkeit wie Punkt 1 |
| 13 | Beat-Plausibilität | BPM 60–200, Beats decken die ganze Dauer ab | sonst Warnung |

## 7. Drei Entwürfe zur Überbrückung von Instrumentalpassagen (Problem d)

Alle drei laufen aus derselben Regel (Punkt 7) und aus `beats.json`; Auswahl der Szene nach dem Prinzip "seltenste zuerst" (Nutzungszähler je Szene/Clip, wie in der Übergabe verlangt).

| | A: Clip-Montage auf dem Beat | B: Generativer Beat-Visualizer | C: Lyrik-Echo / Hook-Recap |
|---|---|---|---|
| Inhalt | Clips aus dem Vorrat, Schnitt auf Downbeats, seltenste zuerst | Canvas/CSS/Lottie-Formen, OpenMoji-Bursts, Farbwechsel mit Energiekurve | Riesige Typo mit Schlüsselwörtern/Hook der letzten Zeilen, Emoji pro Takt, Vorschau "gleich: …", Fortschrittsring zur nächsten Zeile |
| Aufwand | mittel (Auswahl, Beschnitt, Farbanpassung) | mittel | **gering bis mittel**, nutzt vorhandene Textdaten |
| Optik | sehr abwechslungsreich, aber uneinheitlich | stimmig, abstrakt | stimmig, textlich, hält die Aufmerksamkeit auf dem Lied |
| Risiko | Rechte und Dateigröße der Clips; Qualität schwankt | wirkt austauschbar | bei sehr langen Lücken zu wiederholend |
| Determinismus | Videoelemente brauchen Seek-Sonderbehandlung | voll (reine Funktion von t) | voll |

**Gewinner:** **C als Basis, B als Hintergrund-Ebene** (Typo über Visualizer): komplett generativ, deterministisch und unabhängig vom Clip-Vorrat. **A nur für Lücken ≥ 8 s** als Aufwertung (alle 2 Takte neuer Clip, seltenste zuerst). Szenenwechsel auf Downbeats, kleine Bewegung auf jedem Beat. Schwellen (2,0 s und 8 s) an Song 7 und 10 prüfen [E].

## 8. Blender und Clipchamp: wenig zu holen

- **Blender:** Headless-Rendern ist möglich (`-b`), taugt für vorgerenderte Loops (3D-Hintergrund, Partikel) als Clip-Baustein. Audio-Reaktivität ("Bake Sound to F-Curves") läuft im Hintergrundmodus nicht ohne Weiteres, weil der Operator einen Graph-Editor braucht [S]; Umweg: einmal in der Oberfläche backen, dann rendern. Auf einem PC ohne GPU sind Cycles-Renders langsam [E]. Text/Lyrics gehören nicht dorthin: Determinismus und Rechtschreibprüfung gingen verloren. **Nur für optionale Bildloops.**
- **Clipchamp:** kostenloser 1080p-Export [S], Auto-Untertitel (Deutsch nicht bestätigt [S]), aber keine Skript-Schnittstelle und damit keine reproduzierbare Pipeline. Nur für schnelle Handkorrekturen oder Gegenschnitt, **nicht in die Produktion einbauen.**

## 9. Offene Fragen und Unsicheres

- GPU vorhanden und welche? Entscheidet über RoFormer-Geschwindigkeit, `--gpu` bei HyperFrames, größere Whisper-Modelle.
- Welche Python-Version läuft heute im Studio? (3.12 empfohlen.)
- Für welchen Aufbau ist die Remotion-Lizenz relevant (Einzelperson vs. Firma)? Version 5.0 ändert sie.
- Nicht belegt: CPU-Laufzeiten (RoFormer, Whisper large-v3, Render), Genauigkeit auf deutschem Rap, Modell-Lizenz des Qwen-Aligners, offizielle TikTok/Reels-Spezifikation und Lautheitsziele.
- Entscheidung gesucht: Dürfen Ad-libs und Atmer als eigene Textebene sichtbar werden (z. B. "(yeah)")? Das bestimmt die Regel `ignore`.

## Quellen (geprüft)

GitHub-Rohdateien: m-bain/whisperX (README, `alignment.py`, `__main__.py`), jianfch/stable-ts (README), SYSTRAN/faster-whisper (README, `transcribe.py`, `vad.py`), MahmoudAshraf97/ctc-forced-aligner, openvpi/TIFA, MontrealCorpusTools/Montreal-Forced-Aligner (`installation.rst`, `alignment.rst`, `align.py`) und mfa-models (German v3.0.0), adefossez/demucs, nomadkaraoke/python-audio-separator (README, `models.json`), Anjok07/ultimatevocalremovergui, CPJKU/beat_this, CPJKU/madmom, librosa/librosa, remotion-dev/remotion (LICENSE, encoding, gpu, performance), heygen-com/hyperframes (README, `determinism.mdx`, `rendering.mdx`, `cli.mdx`), microsoft/playwright (`clock.md`, `params.md`), languagetool-org/languagetool (README, CHANGES), FFmpeg/FFmpeg (`filters.texi`, `encoders.texi`, `muxers.texi`), LibreOffice/dictionaries. Register: pypi.org (alle genannten Pakete), registry.npmjs.org (remotion, hyperframes, playwright, puppeteer-capture, timecut), conda.anaconda.org/conda-forge (MFA, kalpy, kaldi). Paket-Quelltext: language_tool_python 3.4.0 (sdist), gsap 3.15.0 (npm). Suchtreffer [S]: arXiv 2506.15514, Interspeech-2025-Beitrag zu Lyrics-Transkription, TikTok-/Reels-Spezifikationsseiten Dritter, Clipchamp-Preisseiten, Blender-Foren.
