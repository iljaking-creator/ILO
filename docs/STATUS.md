# ✅ Projekt-Status

*Stand: 2026-06-30 · Branch `claude/higgsfield-connector-lq7zdg`*

## Gesamtbild

Alle geplanten Stufen sind **umgesetzt, getestet, committet und gepusht**. Die Plattform
läuft lokal in allen drei Modi (demo / anthropic-only / live).

## Meilensteine (alle abgeschlossen)

| # | Meilenstein | Status |
| --- | --- | --- |
| M0 | Scaffolding (Config, Modi, Fehler, Typen, Hono-Health) | ✅ |
| M1 | Kern-Engine + ClaudeClient + Web-Chatbot (MVP) | ✅ |
| M2 | Supabase-Datenebene (Schema + RLS + Repo) | ✅ |
| M3 | KB-Ingestion (Crawl, Chunk, Embed, Ingest) | ✅ |
| M4 | Telegram- + E-Mail-Kanäle (token-gated) | ✅ |
| M5 | Härtung, Tests, Doku | ✅ |
| A | Higgsfield/Wan in Plattform integriert | ✅ |
| B | Einzigartige Cinematic-Dark-WebGL-Firmenwebsite | ✅ |
| Galaxy | `galaxy.html` + `galaxy.js`/`galaxy.css` (Skill-Showcase) | ✅ |
| Branchen | Airbnb Live-Room-Tour (`tours/`) + Restaurant/Termin-Karten | ✅ |
| Setup | Firma lokal eingerichtet, Persona/FAQ erweitert, `START_LOCAL.md` | ✅ |

## Verifiziert (real)

- `npm run build` — TypeScript sauber.
- `npm test` — **15/15 Tests grün** (unit, engine, media).
- Alle Seiten liefern HTTP 200; Demo-Bot antwortet aus der Seed-FAQ.
- **Playwright-Headless-Screenshots** (SwiftShader) bestätigen:
  - Galaxie rendert Shader-Planeten über alle Scroll-Stationen (Gasriese, Ringplanet, Nebel, Glass-Panels).
  - Airbnb-Tour pinnt & schwenkt horizontal (Räume mit Lichtwechsel, Hotspots, Caption-Cards).
  - Keine Konsolen-/Modul-404-Fehler; Hauptseite unverändert.

## Was hinter Schlüsseln/Zugängen blockiert ist (alles hinter Config-Flags, blockiert nichts anderes)

| Funktion | Benötigt | Ohne → |
| --- | --- | --- |
| Echter Bot (Claude) | `ANTHROPIC_API_KEY` | Demo-Antworten aus Seed-FAQ |
| Echte KI-Medien | `HF_CREDENTIALS` (`KEY_ID:KEY_SECRET`) | Galerie/Platzhalter + 503-Hinweis |
| Persistenz/Leads (EU/RLS) | `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | In-Memory |
| Semantische Suche | `VOYAGE_API_KEY` | Nur lexikalische FTS |
| Echte KB-Inhalte | `COMPANY_SITE_URL` + `npm run ingest` | Seed-FAQ |
| Telegram live | `TELEGRAM_BOT_TOKEN` | Kanal aus |
| E-Mail live | `IMAP_*` + `SMTP_*` | Kanal aus |
| WhatsApp/Telefon | Meta/Twilio + Nummer + öffentliches HTTPS | Phase-2-Gerüst |

## Mögliche nächste Schritte (offen, auf Wunsch)

1. **Echte Higgsfield-Visuals** generieren und in Galaxie/Tour einbetten (MCP ist verbunden, kostet Credits — steht im Konflikt zur „rein lokal/gratis"-Präferenz, daher nur auf ausdrückliche Freigabe).
2. **Airbnb-Tour mit echten Fotos/360°/Room-Clips** bestücken (Vorlage steht).
3. **Echten Bot lokal scharf schalten** mit `ANTHROPIC_API_KEY`.
4. Weitere Branchen-Demos ausbauen (Restaurant/Termin sind bereits als Karten angelegt).

## Wichtige Constraints (eingehalten)

- Entwicklung nur auf `claude/higgsfield-connector-lq7zdg`; nie ohne Erlaubnis auf anderen Branch pushen.
- GitHub-Zugriff nur auf `iljaking-creator/ilo`.
- Kein PR ohne ausdrückliche Aufforderung.
- Secrets nie geloggt/committet (`.env` gitignored).
- Modell-Identifier nie in Commits/Code/Artefakten.
