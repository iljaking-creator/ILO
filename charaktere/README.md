# schicht.fit — Charaktere

Stand: Designphase (Briefing-Schritt 1) und Turnaround (Schritt 2) sind gelaufen.

## Empfehlung: Russ, der Waschbär (Charakter B)

Gewählte Basis: Variante **b-russ-v1** („maximal pummelig, tiefer Schwerpunkt").
Davon abgeleitet, mit der Variante als Bildreferenz:

- **Turnaround-Modelsheet** (4K, 16:9): Front, Dreiviertel, Profil, Rück — Job `6b189a00-4b0f-4122-878f-f8b2e8831a86`
- **Expression-Sheet** (2K, 16:9): erschöpft, wach, grummelig, stolz, gähnend, schlafend — Job `b81266a1-58ca-4f06-88af-2ef0b12bcaa0`

Alle 18 Konzeptvarianten (je 6 pro Charakter A/B/C) plus Job-IDs, Prompts
und URLs stehen in `manifest.json`.

## Warum liegen hier keine PNGs?

Die Cloud-Session, in der generiert wurde, durfte die Higgsfield-CDN
(`d8j0ntlcm91z4.cloudfront.net`) nicht erreichen (Egress-Policy, HTTP 403).
Die Bilder liegen in der Higgsfield-Galerie des Accounts. Lokal holen:

```bash
bash scripts/download-charaktere.sh
```

Das legt `charaktere/konzepte/*.png` sowie `charaktere/b-russ/modelsheet.png`
und `charaktere/b-russ/expressions.png` an.

## Nächste Schritte (Briefing-Schritte 3–5)

1. **Vektorisierung:** Modelsheet tracen, Pfade von Hand bereinigen → `b-russ/figur.svg`
2. **Zerlegung:** benannte Ebenen (kopf, torso, arm-l/r, bein-l/r, hand-l/r,
   fuss-l/r, schwanz, ohr-l/r, weste), Drehpunkte an Schulter/Ellenbogen/
   Hüfte/Knie/Hals, Farben als Attribute, kein `<style>`-Block
3. **Bewegungsset:** die 10 Loops aus dem Briefing (je 2 s, 24 fps, nahtlos)

Verbindliche Regeln für alles Weitere: `stil-regeln.md`, Farben: `palette.json`.
