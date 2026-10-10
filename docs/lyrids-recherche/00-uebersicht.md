# Lyrids Lyrics-Studio: Recherche-Dossier und Aufgabenplan

Stand: 2026-10-10. Die Recherche entstand in einer Cloud-Umgebung ohne Zugriff auf deinen PC, auf TikTok, Meta, GEMA, Hugging Face und prompt-motion.com. Erreichbar waren nur Websuche, npm, GitHub, PyPI und conda-forge. Jede Datei markiert, was an der Primärquelle geprüft ist und was nur aus Suchauszügen stammt.

## Dateien

| Datei | Inhalt |
|---|---|
| 01-emoji.md | Emoji-Sets, Lizenzen, Wort-zu-Emoji-Zuordnung für Deutsch und Englisch, Kuratierung |
| 02-motions.md | Bibliotheken für Textbewegung, 84 benannte Effekte in 14 Familien, Zuordnungs- und Variationsregeln |
| 03-formate-und-ideen.md | Beliebte Formate, Plattform-Maße, 62 Konzepte mit Testplan |
| 04-rechte.md | Songtext- und Audiorechte, Plattformregeln, Risikoleiter, Prüfliste pro Video |
| 05-technik-pipeline.md | Abgleich Text gegen Ton, zwei Stimmen, Beat, Rendern, Rechtschreibung, Lückenfüller |

## Die wichtigsten Ergebnisse

**Rechte sind das größte Risiko, nicht die Technik.**
- Ein Songtext ist ein eigenes geschütztes Werk. Ob die Plattform-Verträge eingeblendeten Text abdecken, ist öffentlich nicht belegt.
- Plattform-Sounds sind laut Recherche für private Nutzung gedacht. Eine GbR mit Monetarisierungsziel gilt sehr wahrscheinlich als gewerblich.
- Für TikToks Creator-Programm gilt: nur Personal-Konto, Mindestlänge 1 Minute, komplett selbst produziert. Reine Lyric-Videos mit Fremdmusik erfüllen das kaum.
- Die genannten Urteile von LG Frankfurt und BGH stammen aus Suchauszügen und sind unverifiziert. Vor Entscheidungen von einer Fachanwältin oder einem Fachanwalt prüfen lassen. Das ist keine Rechtsberatung.

**Emoji.** Empfohlen: Noto Emoji 2D plus Noto Animated Emoji, dazu optional Fluent. OpenMoji meiden, weil ungeklärt ist, ob die ShareAlike-Pflicht auf das Video durchschlägt. Apple-Emoji nie verwenden. Die Standard-Wortliste findet für etwa ein Drittel der Rap-Testwörter kein Emoji, daher Slang-Lexikon plus Zusatzschritt, und ohne gutes Emoji lieber gar keins.

**Motion.** GSAP ist kostenlos inklusive SplitText, aber proprietär. Remotion nur gratis für Einzelpersonen und kleine Firmen. Zu meiden sind typed.js, Essentia, aubio und madmom wegen Lizenzen. Alle Animationen müssen per Zeitwert abspielbar sein, sonst lassen sie sich nicht Bild für Bild rendern.

**Technik gegen deine Fehlermeldungen**
- Song 14, nichts Hörbares ignorieren: Gesangsspur getrennt transkribieren und mit dem Text vergleichen. Jede hörbare Stelle ohne Text blockiert den Render.
- Song 15, zwei Stimmen: Lead und Backing per Stem-Trennung auftrennen, je Text eine Spur.
- Franz-Video, Text passt nicht zum Ton: automatischer Abgleich von Dauer, erstem und letztem Wort und Abdeckung.
- Leerlauf: Wiederholung der Hook-Zeile über einem generativen Visualizer, Clip-Montage nur ab 8 Sekunden Lücke.
- Rechtschreibung: LanguageTool offline mit Slang-Erlaubnisliste.
- Beat: beat-this und librosa, Ergebnis als JSON für die Animation.

## Unterschiede zum bisherigen Studio-Stand
- Die lokale Sitzung hatte OpenMoji begonnen. Die Recherche rät davon ab. Prüfe vor dem Weiterbauen, ob sie Noto nehmen soll.
- Der Motions-Katalog mit 233 Einträgen liegt nur auf deinem PC. Bitte als CSV oder JSON ins Repo legen, dann lässt sich die Tabelle ergänzen.
- Alle Marktaussagen zu beliebten Formaten, etwa dem Kontrollzentrum-Swipe, sind Einschätzungen. Prüfe sie im TikTok Creative Center.

## Entscheidungen für dich
1. Noto-Look oder Fluent-3D-Look als Markenbild.
2. Dürfen Ad-libs und Atmer sichtbare Textebene werden, oder nur hörbare Wörter?
3. Ist das Konto gewerblich geplant, und wird mit Fremdsongs monetarisiert? Davon hängt die Rechtestrategie ab.
4. Welche Songs laufen über die Plattform-Sound-Funktion, und wo holst du Freigaben von Künstlern oder Labels ein?

## Aufgabenübernahme

| Aufgabe aus der Übergabe | Stand |
|---|---|
| 1 Ergebnisse der letzten Runde prüfen | braucht den PC |
| 2 Neue Clips laden, benennen, einfügen | braucht den PC |
| 3 Song 14, Song 15, Franz-Video beheben | Methode recherchiert, Umsetzung braucht den PC |
| 4 Motions und Emojis bewerten | Methode und Kriterien fertig, Katalog liegt auf dem PC |
| 5 Brückenlösung für Leerlauf | drei Varianten verglichen, Empfehlung steht |
| 6 Studio 2 Teil 2 | braucht den PC |
| 7 Ideen-Katalog | erledigt, 62 Konzepte |
| 8 Pilot-Song mit Kostenmessung | braucht den PC |
| 9 Restliche Songs, drei Fassungen, Rechteprüfung | Prüfliste fertig, Bauen braucht den PC |
