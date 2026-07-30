#!/usr/bin/env python3
"""
China: vollstaendige Ortsliste aus dem GeoNames-Datensatz.

Erzeugt eine CSV mit ALLEN in GeoNames erfassten Orten Chinas
(ca. 800.000+ Eintraege: Staedte, Gemeinden, Doerfer, Weiler).
Einwohnerzahlen sind nur dort vorhanden, wo sie offiziell erhoben
wurden - fuer die meisten Doerfer existieren weltweit keine Daten.

Nutzung:
    python3 china_orte_komplett.py

    # weitere Optionen:
    python3 china_orte_komplett.py --out-dir ./export   # Zielordner
    python3 china_orte_komplett.py --neu-laden          # Download erzwingen
    python3 china_orte_komplett.py --zip /pfad/CN.zip   # lokale Datei nutzen
    python3 china_orte_komplett.py --land HK            # Hongkong statt CN

Ergebnis:
    china_orte.csv          - alle Orte
    china_orte_mit_ew.csv   - nur Orte mit Einwohnerzahl

Datenquelle: GeoNames (https://www.geonames.org), Lizenz CC BY 4.0.
"""
from __future__ import annotations

import argparse
import csv
import io
import os
import sys
import urllib.error
import urllib.request
import zipfile
from pathlib import Path

BASIS_URL = "https://download.geonames.org/export/dump"

# Feature-Codes fuer besiedelte Orte (P = populated place)
ORTS_CODES = {
    "PPL": "Ort/Dorf",
    "PPLA": "Provinzhauptstadt",
    "PPLA2": "Verwaltungssitz Ebene 2",
    "PPLA3": "Verwaltungssitz Ebene 3",
    "PPLA4": "Verwaltungssitz Ebene 4",
    "PPLA5": "Verwaltungssitz Ebene 5",
    "PPLC": "Landeshauptstadt",
    "PPLF": "Bauerndorf",
    "PPLH": "historischer Ort",
    "PPLL": "Weiler/Streusiedlung",
    "PPLQ": "aufgegebener Ort",
    "PPLR": "Ort mit Religionszentrum",
    "PPLS": "Ortsgruppe",
    "PPLW": "zerstoerter Ort",
    "PPLX": "Stadtteil",
    "STLMT": "Siedlung",
}

# Provinzcodes (ISO 3166-2:CN)
PROVINZEN = {
    "01": "Anhui", "02": "Zhejiang", "03": "Jiangxi", "04": "Jiangsu",
    "05": "Jilin", "06": "Qinghai", "07": "Fujian", "08": "Heilongjiang",
    "09": "Henan", "10": "Hebei", "11": "Hunan", "12": "Hubei",
    "13": "Xinjiang", "14": "Xizang (Tibet)", "15": "Gansu",
    "16": "Guangxi", "18": "Guizhou", "19": "Liaoning",
    "20": "Nei Mongol", "21": "Ningxia", "22": "Beijing",
    "23": "Shanghai", "24": "Shanxi", "25": "Shandong",
    "26": "Shaanxi", "28": "Tianjin", "29": "Yunnan",
    "30": "Guangdong", "32": "Chongqing", "33": "Sichuan",
    "31": "Hainan",
}

# Laendercodes, die dieses Skript kennt. GeoNames fuehrt Hongkong, Macau und
# Taiwan als eigene Dateien - "CN.zip" enthaelt sie nicht.
LAENDER = {
    "CN": "china",
    "HK": "hongkong",
    "MO": "macau",
    "TW": "taiwan",
}

# Spaltenindizes im GeoNames-Format (Tab-getrennt, 19 Spalten).
SP_GEONAMEID, SP_NAME, SP_ASCII = 0, 1, 2
SP_BREITE, SP_LAENGE = 4, 5
SP_FEATURE_CLASS, SP_FEATURE_CODE = 6, 7
SP_ADMIN1, SP_EINWOHNER = 10, 14
SP_MIN = SP_EINWOHNER + 1  # so viele Spalten braucht eine verwertbare Zeile

KOPF = ["geonameid", "name", "name_ascii", "provinz",
        "typ", "einwohner", "breite", "laenge"]


def fortschritt(block: int, blockgroesse: int, gesamt: int) -> None:
    """Einfache Fortschrittsanzeige fuer urlretrieve."""
    geladen = block * blockgroesse
    if gesamt > 0:
        prozent = min(100, geladen * 100 // gesamt)
        print(f"\r  {prozent:3d}%  ({geladen // 1024:,} / {gesamt // 1024:,} KB)",
              end="", flush=True)
    else:
        print(f"\r  {geladen // 1024:,} KB", end="", flush=True)


def ist_gueltiges_zip(pfad: Path) -> bool:
    try:
        with zipfile.ZipFile(pfad) as z:
            return z.testzip() is None
    except (zipfile.BadZipFile, OSError):
        return False


def lade_datensatz(land: str, zip_pfad: Path, neu_laden: bool) -> None:
    """Laedt <LAND>.zip herunter, falls noch keine gueltige Datei vorliegt."""
    if zip_pfad.exists() and not neu_laden:
        if ist_gueltiges_zip(zip_pfad):
            print(f"{zip_pfad} bereits vorhanden - ueberspringe Download.")
            return
        raise SystemExit(
            f"{zip_pfad} ist beschaedigt (kein gueltiges ZIP).\n"
            f"Mit --neu-laden erneut herunterladen oder die Datei loeschen."
        )

    url = f"{BASIS_URL}/{land}.zip"
    print(f"Lade {url} ... (ca. 20 MB)")

    # Erst in eine .part-Datei schreiben: ein abgebrochener Download darf
    # spaeter nicht als "bereits vorhanden" durchgehen.
    teil_pfad = zip_pfad.with_name(zip_pfad.name + ".part")
    zip_pfad.parent.mkdir(parents=True, exist_ok=True)
    try:
        urllib.request.urlretrieve(url, teil_pfad, reporthook=fortschritt)
    except urllib.error.HTTPError as exc:
        teil_pfad.unlink(missing_ok=True)
        raise SystemExit(f"\nDownload fehlgeschlagen: HTTP {exc.code} fuer {url}")
    except (urllib.error.URLError, OSError) as exc:
        teil_pfad.unlink(missing_ok=True)
        raise SystemExit(f"\nDownload fehlgeschlagen: {exc}")
    print()

    if not ist_gueltiges_zip(teil_pfad):
        teil_pfad.unlink(missing_ok=True)
        raise SystemExit(
            f"Heruntergeladene Datei ist kein gueltiges ZIP - "
            f"Netzwerk/Proxy pruefen und erneut versuchen."
        )

    os.replace(teil_pfad, zip_pfad)
    print("Download abgeschlossen.")


def oeffne_datentabelle(z: zipfile.ZipFile, land: str):
    """Findet die Datentabelle im Archiv (CN.zip -> CN.txt)."""
    name = f"{land}.txt"
    if name not in z.namelist():
        txt = [n for n in z.namelist() if n.lower().endswith(".txt")
               and not n.lower().startswith("readme")]
        if not txt:
            raise SystemExit(f"{name} nicht im Archiv gefunden.")
        name = txt[0]
    return z.open(name)


def verarbeite(land: str, zip_pfad: Path, out_dir: Path) -> tuple[int, int]:
    slug = LAENDER.get(land, land.lower())
    datei_alle = out_dir / f"{slug}_orte.csv"
    datei_ew = out_dir / f"{slug}_orte_mit_ew.csv"
    out_dir.mkdir(parents=True, exist_ok=True)

    alle = 0
    mit_ew = 0

    with zipfile.ZipFile(zip_pfad) as z, \
         open(datei_alle, "w", newline="", encoding="utf-8") as f_alle, \
         open(datei_ew, "w", newline="", encoding="utf-8") as f_ew:

        w_alle = csv.writer(f_alle)
        w_ew = csv.writer(f_ew)
        w_alle.writerow(KOPF)
        w_ew.writerow(KOPF)

        with oeffne_datentabelle(z, land) as roh:
            for zeile in io.TextIOWrapper(roh, encoding="utf-8"):
                sp = zeile.rstrip("\r\n").split("\t")
                if len(sp) < SP_MIN:
                    continue

                if sp[SP_FEATURE_CLASS] != "P":
                    continue

                admin1 = sp[SP_ADMIN1]
                provinz = (PROVINZEN.get(admin1, admin1 or "unbekannt")
                           if land == "CN" else (admin1 or "unbekannt"))
                feature_code = sp[SP_FEATURE_CODE]
                typ = ORTS_CODES.get(feature_code, feature_code)
                einwohner = sp[SP_EINWOHNER] if sp[SP_EINWOHNER] not in ("", "0") else ""

                reihe = [sp[SP_GEONAMEID], sp[SP_NAME], sp[SP_ASCII], provinz,
                         typ, einwohner, sp[SP_BREITE], sp[SP_LAENGE]]
                w_alle.writerow(reihe)
                alle += 1
                if einwohner:
                    w_ew.writerow(reihe)
                    mit_ew += 1

    print("\nFertig.")
    print(f"  {datei_alle}: {alle:,} Orte")
    print(f"  {datei_ew}: {mit_ew:,} Orte mit Einwohnerzahl")
    print(f"  ({alle - mit_ew:,} Orte ohne verfuegbare Einwohnerzahl)")
    return alle, mit_ew


def parse_args(argv: list[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Vollstaendige Ortsliste eines Landes aus dem GeoNames-Datensatz."
    )
    p.add_argument("--land", default="CN",
                   help="GeoNames-Laendercode (Standard: CN; auch HK, MO, TW)")
    p.add_argument("--zip", dest="zip_pfad",
                   help="Pfad zur <LAND>.zip (Standard: <LAND>.zip im Ausgabeordner)")
    p.add_argument("--out-dir", default=".", help="Zielordner fuer die CSVs")
    p.add_argument("--neu-laden", action="store_true",
                   help="Datensatz erneut herunterladen, auch wenn er vorliegt")
    return p.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    land = args.land.upper()
    out_dir = Path(args.out_dir)
    zip_pfad = Path(args.zip_pfad) if args.zip_pfad else out_dir / f"{land}.zip"

    lade_datensatz(land, zip_pfad, args.neu_laden)

    alle, _ = verarbeite(land, zip_pfad, out_dir)
    if alle == 0:
        print("Warnung: keine Orte gefunden - stimmt der Laendercode?",
              file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
