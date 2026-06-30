# 🛠️ Runbook — Betrieb & Troubleshooting

Endnutzer-Kurzanleitung: [`../START_LOCAL.md`](../START_LOCAL.md). Dieses Dokument ist die
technische Referenz.

## Lokal starten

```bash
npm install          # einmalig
npm start            # = npm run build && npm run start:server  → http://localhost:8787
```

Anderer Port: `PORT=3000 npm run start:server`. Beenden: `Strg + C`.

## npm-Scripts

| Script | Wirkung |
| --- | --- |
| `npm start` | Build + Server starten. |
| `npm run start:server` | Server ohne Build (tsx). |
| `npm run build` | TypeScript-Build (`tsc`). |
| `npm run typecheck` | Typprüfung ohne Emit. |
| `npm test` | Unit-/Engine-/Media-Tests (node:test). |
| `npm run ingest` | Firmen-Website crawlen → KB (braucht `COMPANY_SITE_URL` + Supabase). |
| `npm run generate` | Higgsfield-Clips generieren (braucht `HF_CREDENTIALS`). |
| `npm run mcp` | Higgsfield-MCP-Server starten (Claude Desktop). |
| `npm run serve` | Statischer Widget-Demo-Server. |

## Umgebungsvariablen (alle optional → degradiert sauber)

`.env` anlegen (gitignored): `cp .env.example .env`.

| Variable | Schaltet frei |
| --- | --- |
| `ANTHROPIC_API_KEY` | Echten Claude-Bot (statt Demo). |
| `HF_CREDENTIALS` = `KEY_ID:KEY_SECRET` | Echte Higgsfield-Medien. |
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | Persistenz (EU/RLS). |
| `VOYAGE_API_KEY` | Semantische Suche (sonst nur lexikalische FTS). |
| `COMPANY_SITE_URL` | Quelle für KB-Ingestion. |
| `TELEGRAM_BOT_TOKEN` | Telegram-Kanal. |
| `IMAP_*` + `SMTP_*` | E-Mail-Kanal. |
| `PORT` | Server-Port (Default 8787). |

> Welcher Modus aktiv ist und welche Fähigkeiten an sind, zeigt jederzeit
> <http://localhost:8787/api/health>.

## Seiten / Endpunkte

| Pfad | Inhalt |
| --- | --- |
| `/` | Hauptseite (Firmen-Website). |
| `/galaxy.html` | Galaxie-Skill-Showcase. |
| `/tours/airbnb.html` | Airbnb Live-Room-Tour. |
| `/studio.html` | KI-Clip-Galerie. |
| `/api/health` | Modus + Fähigkeiten (JSON). |
| `/api/chat` | Chat (SSE-Stream). |
| `/api/media/gallery` | Medien-Galerie (immer verfügbar). |
| `/api/media/generate` | Generierung (gated → 503 ohne `HF_CREDENTIALS`). |
| `/api/media/status/:id` | Video-Polling. |

## Troubleshooting (bekannte Stolpersteine, bereits behoben)

- **`three.core.min.js` 404:** Das moderne `three.module.min.js` re-exportiert aus `three.core.min.js`. Beide liegen in `web/vendor/`.
- **Chat-Panel sichtbar trotz `[hidden]`:** `.kiw-panel[hidden]{display:none}` in `widget.css` setzt das UA-Verhalten durch.
- **Hero-Titel unsichtbar:** SplitText-Char-Spans + `background-clip:text` = transparent → `.hero__title` nutzt solide Farbe.
- **WebGL rendert headless nicht:** Chromium mit `--use-gl=angle --use-angle=swiftshader --ignore-gpu-blocklist --enable-webgl` starten (nur für Headless-Screenshots; echte GPU braucht das nicht).
- **`@types/node` fehlt / `process` not found:** ist in devDependencies.

## Bot für K&I anpassen

Persona/Wissen sind auf K&I zugeschnitten in `src/platform/core/persona.ts` (Seed-FAQ).
Eigene Inhalte: `COMPANY_SITE_URL` setzen und `npm run ingest` (braucht Supabase) — oder die
Seed-FAQ direkt editieren.
