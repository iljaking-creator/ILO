# 🗺️ Ortsdaten aus GeoNames (China)

[`china_orte_komplett.py`](./china_orte_komplett.py) erzeugt eine **vollständige
Ortsliste Chinas** als CSV — alles, was GeoNames für das Land führt: Städte,
Verwaltungssitze, Gemeinden, Dörfer, Weiler, aufgegebene und historische Orte.

Kein API-Schlüssel, keine Abhängigkeiten — nur die Python-Standardbibliothek.

## Nutzung

```bash
cd data
python3 china_orte_komplett.py
```

Beim ersten Lauf wird `CN.zip` (ca. 20 MB) von GeoNames geladen, danach nur noch
verarbeitet. Ergebnis:

| Datei | Inhalt |
| --- | --- |
| `china_orte.csv` | **alle** Orte (ca. 800.000+ Zeilen) |
| `china_orte_mit_ew.csv` | nur Orte mit erfasster Einwohnerzahl |

Beide Dateien und `CN.zip` sind über [`.gitignore`](../.gitignore) vom Repo
ausgeschlossen — sie sind Ableitungen, keine Quelldaten.

### Optionen

| Flag | Wirkung |
| --- | --- |
| `--out-dir ./export` | Zielordner für ZIP und CSVs (Standard: aktueller Ordner) |
| `--zip /pfad/CN.zip` | vorhandene Dump-Datei nutzen statt herunterzuladen |
| `--neu-laden` | Download erzwingen, auch wenn die ZIP schon vorliegt |
| `--land HK` | anderes GeoNames-Land (siehe unten) |

## Spalten

| Spalte | Beschreibung |
| --- | --- |
| `geonameid` | stabile GeoNames-ID (für spätere Joins/Updates) |
| `name` | Ortsname in Landesschrift (z. B. 北京) |
| `name_ascii` | ASCII-Umschrift (z. B. `Beijing`) |
| `provinz` | Provinz/Region, aufgelöst aus dem ISO-3166-2:CN-Code |
| `typ` | Ortstyp im Klartext (`Ort/Dorf`, `Provinzhauptstadt`, `Weiler/Streusiedlung`, …) |
| `einwohner` | Einwohnerzahl — **leer, wenn keine Daten vorliegen** |
| `breite` / `laenge` | Koordinaten in Dezimalgrad (WGS84) |

Die CSVs sind UTF-8-kodiert. Excel öffnet UTF-8-CSVs nicht immer automatisch
korrekt — dort über *Daten → Aus Text/CSV* importieren und UTF-8 wählen, sonst
werden die chinesischen Namen zerlegt.

## Zur Einwohnerzahl

Nur ein kleiner Teil der Orte hat eine Einwohnerzahl. Das ist **keine Lücke
dieses Skripts**: GeoNames übernimmt Bevölkerungszahlen aus offiziellen
Erhebungen, und die gibt es weltweit nur für Städte und größere Gemeinden — für
die meisten Dörfer und Weiler existiert schlicht keine erhobene Zahl. Ein
Eintrag mit Bevölkerung `0` im Dump bedeutet ebenfalls „nicht erhoben" und wird
deshalb als leeres Feld ausgegeben, nicht als Null.

Deshalb die zweite Datei: `china_orte_mit_ew.csv` enthält nur die Zeilen, mit
denen sich rechnen lässt.

## Hongkong, Macau, Taiwan

GeoNames führt diese als eigene Länderdateien — `CN.zip` enthält sie **nicht**:

```bash
python3 china_orte_komplett.py --land HK   # → hongkong_orte.csv
python3 china_orte_komplett.py --land MO   # → macau_orte.csv
python3 china_orte_komplett.py --land TW   # → taiwan_orte.csv
```

Für diese Länder bleibt die Spalte `provinz` der rohe GeoNames-Verwaltungscode —
die Klartext-Auflösung ist nur für die chinesischen Provinzen hinterlegt.

## Netzwerk

Der Download geht direkt an <https://download.geonames.org>. Hinter einem
restriktiven Proxy (z. B. in einer CI- oder Sandbox-Umgebung) kann der Host
gesperrt sein; das Skript bricht dann mit einer klaren Meldung ab. Dump dann
einmal manuell besorgen und per `--zip` übergeben:

```bash
python3 china_orte_komplett.py --zip ~/Downloads/CN.zip
```

Ein abgebrochener Download landet in `CN.zip.part` und wird erst nach
erfolgreicher ZIP-Prüfung umbenannt — eine halbe Datei kann also nicht als
gültiger Datensatz durchgehen.

## Lizenz der Daten

Die Ortsdaten stammen von [GeoNames](https://www.geonames.org) und stehen unter
**CC BY 4.0**. Bei Weitergabe der CSVs GeoNames als Quelle nennen.
