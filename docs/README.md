# 📚 K&I Kundenwerke — Projekt-Dokumentation

Dieser Ordner sichert **alles Wichtige** dauerhaft im Repo ab (überlebt Container-Neustarts).
Hier findest du das Gesamtbild des Projekts, die Architektur, die getroffenen Entscheidungen
und wie alles lokal läuft.

## Was ist das hier?

Eine **lokal lauffähige, einheitliche KI-Kundenservice-Plattform** für K&I Kundenwerke:
ein gemeinsamer Claude-Agent-Kern mit dünnen Kanal-Adaptern (Web-Chat, Telegram, E-Mail,
WhatsApp/Telefon als Gerüst), eine **Higgsfield/Wan-Medien-Integration** (Bild/Video/3D)
und eine **einzigartige, lebendige Firmen-Website** inkl. einer scroll-getriebenen
**„Galaxie"-Skill-Showcase** und einer **Airbnb-Live-Room-Tour**.

Alles läuft **rein lokal** auf dem Laptop und **degradiert sauber**: voll demonstrierbar
ganz ohne Schlüssel (Demo-Modus), echter Bot mit `ANTHROPIC_API_KEY`, echte Medien mit
`HF_CREDENTIALS`, Persistenz mit Supabase.

## Inhalt dieses Ordners

| Datei | Inhalt |
| --- | --- |
| [`MASTERPLAN.md`](./MASTERPLAN.md) | Der vollständige Meisterplan (Architektur, 8-fache Fehleranalyse, Gap-Analyse, alle 3 Ausbaustufen). **Quelle der Wahrheit für das „Warum".** |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Systemarchitektur, Datenfluss, vollständige Dateikarte (was macht welche Datei). |
| [`STATUS.md`](./STATUS.md) | Aktueller Stand: was fertig ist, was verifiziert wurde, was hinter Schlüsseln/Zugängen blockiert ist, nächste mögliche Schritte. |
| [`RUNBOOK.md`](./RUNBOOK.md) | Betrieb: lokal starten, Modi, Umgebungsvariablen, Troubleshooting. |

## Verwandte Dateien im Repo-Root

| Datei | Inhalt |
| --- | --- |
| [`../START_LOCAL.md`](../START_LOCAL.md) | Kurzanleitung: in 3 Schritten lokal starten (für Endnutzer). |
| [`../README.md`](../README.md) | Repo-Übersicht / Higgsfield-Connector-Doku. |
| [`../PRIVACY.md`](../PRIVACY.md) | DSGVO/Datenschutz (Rechtsgrundlage, Auftragsverarbeiter, Retention, Erasure). |
| [`../SETUP_CLAUDE_DESKTOP.md`](../SETUP_CLAUDE_DESKTOP.md) | Higgsfield-MCP in Claude Desktop einrichten. |
| [`../RESEARCH_OPEN_SOURCE_VIDEO.md`](../RESEARCH_OPEN_SOURCE_VIDEO.md) | Recherche: sichere Open-Source-Video-Alternativen (Wan 2.2). |
| [`../src/platform/README.md`](../src/platform/README.md) | Entwickler-Doku der Plattform-Schicht. |

## Schnellstart (lokal, ohne Schlüssel)

```bash
npm install
npm start            # = npm run build && npm run start:server
```

Dann im Browser:

- **Hauptseite:** <http://localhost:8787/>
- **Galaxie-Showcase:** <http://localhost:8787/galaxy.html>
- **Airbnb-Live-Tour:** <http://localhost:8787/tours/airbnb.html>
- **KI-Clip-Galerie:** <http://localhost:8787/studio.html>
- **Status/Modus:** <http://localhost:8787/api/health>

Details in [`RUNBOOK.md`](./RUNBOOK.md) und [`../START_LOCAL.md`](../START_LOCAL.md).

---

*Entwicklungs-Branch: `claude/higgsfield-connector-lq7zdg`*
