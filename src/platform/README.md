# K&I Kundenwerke – KI-Kundenservice-Plattform

Eine einheitliche Multi-Channel-KI-Plattform: **ein** Kern (Claude-Agent +
Wissensbasis + Datenhaltung), viele dünne **Kanal-Adapter** (Web-Chat, Telegram,
E-Mail; WhatsApp & Telefon als Phase-2-Gerüst).

## Betriebsmodi (graceful degradation)

| Modus            | Voraussetzung                         | Verhalten                                              |
| ---------------- | ------------------------------------- | ----------------------------------------------------- |
| `demo`           | keine Keys                            | deterministische Antworten aus lokaler Seed-FAQ       |
| `anthropic-only` | nur `ANTHROPIC_API_KEY`               | **echter** Claude-Bot, In-Memory-Persistenz, lexikalische KB |
| `live`           | + Supabase (EU)                       | Persistenz, Audit, Retention, DB-Retrieval            |

Optional erweiterbar: `VOYAGE_API_KEY` (semantische Suche), `COMPANY_SITE_URL`
(echte Wissensbasis), `TELEGRAM_BOT_TOKEN`, IMAP/SMTP (E-Mail).

## Schnellstart

```bash
npm install
cp .env.example .env          # Keys eintragen (oder leer lassen für Demo)

# Server starten (Web-Chat + /api/health + statisches Widget)
npm run start:server          # http://localhost:8787/demo.html

# Tests
npm test
```

### Demo (ohne Keys)
`npm run start:server` → `http://localhost:8787/demo.html` öffnen → der Chat unten
rechts antwortet aus der Seed-FAQ. `GET /api/health` zeigt `mode:"demo"`.

### anthropic-only (echter Bot – primärer Test-Lauf)
`.env`: nur `ANTHROPIC_API_KEY=…` → Neustart. Health zeigt `mode:"anthropic-only"`;
Antworten kommen von Claude, fundiert auf der Seed-/lexikalischen Wissensbasis.

### live (mit Datenbank)
Supabase-Projekt (EU) anlegen, Schema anwenden:
1. `src/platform/db/schema.sql` via Supabase-SQL/MCP `apply_migration` einspielen.
2. `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in `.env`.
3. `get_advisors` prüfen (RLS aktiv, Security-Advisor sauber).
4. Optional Wissensbasis befüllen: `COMPANY_SITE_URL=…` setzen, dann `npm run ingest`.

## Kanäle aktivieren

| Kanal     | Aktivierung                                      | Status ohne Zugang        |
| --------- | ------------------------------------------------ | ------------------------- |
| Web-Chat  | immer aktiv (`/api/chat`, Widget `web/widget.js`) | aktiv                     |
| Telegram  | `TELEGRAM_BOT_TOKEN` (von @BotFather)            | aus (graceful)            |
| E-Mail    | `IMAP_*` + `SMTP_*`                              | aus (graceful)            |
| WhatsApp  | Phase 2 (Meta Cloud API / Twilio + HTTPS)        | Gerüst (`channels/whatsapp.ts`) |
| Telefon   | Phase 2 (Twilio Voice + STT/TTS + HTTPS)         | Gerüst (`channels/phone.ts`)    |

Widget einbinden (eine Zeile, siehe `web/embed.html`):
```html
<script src="https://DEIN-HOST/widget.js" data-api-base="https://DEIN-HOST"></script>
```

## Architektur

```
channels/{web,telegram,email} → AgentEngine.handle():
    Verlauf laden → KB-Retrieval → System-Prompt (Persona + KB, anti-injection)
    → Claude (Tools: capture_lead, request_human_handoff) → Tool-Loop → Persist
```

Wichtige Dateien: `core/engine.ts`, `core/claude.ts`, `server/app.ts`,
`db/schema.sql`, `config.ts`. Sicherheit/Datenschutz: siehe `../../PRIVACY.md`.

## Genuin blockiert ohne externe Zugänge
Telegram-/E-Mail-/WhatsApp-/Telefon-Livebetrieb, Live-Persistenz (Supabase),
semantische Suche (Voyage), echte KB-Inhalte (Website-URL), öffentliches Hosting/
HTTPS für Webhook-Kanäle. Alles hinter Config-Flags – blockiert nichts anderes.
