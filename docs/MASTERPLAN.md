<!--
  ARCHIV: Vollständiger Meisterplan (3 Ausbaustufen), gesichert aus dem ephemeren
  Plan-Modus ins Repo. Quelle der Wahrheit für die Begründungen ("Warum").
  Den aktuellen Umsetzungsstand findest du in STATUS.md.
-->

# Meisterplan: K&I Kundenwerke – Multi-Channel KI-Kundenservice-Plattform

## Context (warum & Ziel)

Die Firma **K&I Kundenwerke** bietet Chatbots und KI-Leistungen an. Aktuell enthält das Repo `/home/user/ILO`
nur den Higgsfield/Wan-Teil – **keine** Chatbot-/Kanal-/Datenbank-Infrastruktur. Ziel ist eine **einheitliche
KI-Kundenservice-Plattform** mit einem gemeinsamen Kern (Claude-Agent + Wissensbasis + Datenhaltung) und dünnen
**Kanal-Adaptern**.

Bestätigte Entscheidungen (aus Rückfragen):
- **Start = MVP-Bündel:** Web-Chatbot + Telegram-Bot + E-Mail-Bot. WhatsApp + Telefon-KI = Phase 2 (Gerüst).
- **Keine externen Konten vorhanden** → Plattform muss **lokal lauffähig** sein und **stufenweise degradieren**:
  voll demonstrierbar mit nur `ANTHROPIC_API_KEY`, und ein deterministischer **Demo-Modus** ohne jeden Key.
- **Stack:** TypeScript/Node (passt zum Repo) + **Supabase** (Postgres/pgvector, EU/Frankfurt) + **Claude**.
- **Wissensbasis aus Firmen-Website** (URL noch nicht geliefert → Platzhalter-FAQ, URL später konfigurierbar).

Wichtiger Realitäts-Hinweis (Erwartung): Mit „keine Konten" kann im Test-Lauf **real** nur der **Web-Chatbot**
end-to-end laufen (braucht `ANTHROPIC_API_KEY`). Telegram/E-Mail werden **gebaut**, gehen aber erst mit Token/Zugang
live. Das ist im Code über Config-Flags gekapselt und dokumentiert.

## Architektur (North Star)

**EIN Kern**, viele dünne Adapter. Jeder Adapter normalisiert eingehende Nachrichten zu einem gemeinsamen
`InboundMessage`, ruft `engine.handle()` und mappt `OutboundMessage` zurück.

```
Browser → Web-Widget → /api/chat (SSE) ┐
Telegram → getUpdates-Poller          ├─→ AgentEngine.handle():
E-Mail  → IMAP-Poller                 ┘     Verlauf laden → RAG-Retrieval → System-Prompt
                                            → Claude (Tools: capture_lead, request_human_handoff)
                                            → Tool-Loop → persistieren (messages/leads/handoffs/audit)
```

Muster werden aus dem Bestand wiederverwendet: env-basierte Connector-Klasse (`src/client.ts`), Fehler-Hierarchie
(`src/errors.ts`), MCP+Zod (`src/mcp-server.ts`), statischer `node:http`-Server (`scripts/serve.ts`), Vanilla-Frontend
mit JSON-Manifest (`web/`), `.ts` via `tsx`.

## Gesperrte technische Entscheidungen

- **LLM:** offizielles SDK `@anthropic-ai/sdk` (kein raw fetch). Default `claude-opus-4-8`; günstige Turns
  `claude-sonnet-4-6`. **Adaptive Thinking** + `output_config:{effort:"medium"}`. **Kein** `temperature`/`top_p`/
  `budget_tokens` (alle 400 auf Opus 4.8). Streaming via `.stream()` + `.finalMessage()`. **Prompt-Caching** auf den
  eingefrorenen System-/Persona-Prefix.
- **Daten:** Supabase (Postgres + RLS + pgvector) via `@supabase/supabase-js`, **EU-Region** (DSGVO).
- **Embeddings (load-bearing):** Anthropic hat **keinen** Embeddings-Endpoint. Zwei-stufig: (1) Default = Postgres
  Volltextsuche (`tsvector`, `german`) – frei, kein Extra-Key, macht den Test-Lauf mit nur `ANTHROPIC_API_KEY` möglich;
  (2) optional `Embedder` → Voyage AI (`voyage-3`, 1024-dim) hinter `VOYAGE_API_KEY`. `vector(1024)`-Spalte wird
  trotzdem angelegt → späteres Umschalten ohne Migration.
- **HTTP-Server:** **Hono** (`hono` + `@hono/node-server`) – winzig, ESM-first, SSE/Routing/Middleware. `scripts/serve.ts`
  bleibt für die Widget-Demo.
- **Telegram:** **Long-Polling `getUpdates`** (keine öffentliche URL nötig). Webhook-Pfad nur als Gerüst.
- **E-Mail:** IMAP-Poll + SMTP-Send (`imapflow` + `nodemailer`), config-getrieben. Das Entwickler-Gmail-MCP ist **kein**
  Laufzeit-Abhängigkeit.

## Verzeichnislayout unter `src/`

```
config.ts        Zod-Env-Loader; berechnet Modus (live|anthropic-only|demo); keine Secret-Logs
errors.ts        erweitern: PlatformError + ConfigError/AnthropicError/DbError/ChannelError/RateLimitError/ValidationError
types.ts         Channel, Inbound/OutboundMessage, Contact, Conversation, MessageRecord, KbChunk, Lead, Handoff
core/engine.ts   AgentEngine.handle(): Memory→RAG→Prompt→Claude→Tool-Loop→Persist   ★ kritisch
core/claude.ts   ClaudeClient über SDK: Modellwahl, adaptive thinking, effort, Streaming-Generator, Demo-Kurzschluss ★
core/prompt.ts   buildSystemPrompt(): Persona + KB in <knowledge_base> + Anti-Injection-Framing, deutsche K&I-Persona
core/tools.ts    Zod-Tools: capture_lead, request_human_handoff, (Phase2-Stub book_appointment)
core/memory.ts   Verlauf laden/trimmen (Turn- + Token-Budget) + anhängen
core/persona.ts  statische Persona + deutsche Platzhalter-FAQ
kb/{crawl,chunk,embed,retrieve,ingest,seed,types}.ts  same-origin BFS-Crawler, ~500-Token-Chunks, Null/Voyage-Embedder,
                 FTS-immer + Hybrid(FTS+pgvector, RRF) wenn Embeddings, Upsert mit content_hash, Seed-FAQ-Loader
db/client.ts     getSupabase() service-role; null im Demo-Modus
db/repo.ts       typed DAL (upsertContact/getOrCreateConversation/appendMessage/…/searchChunks) + In-Memory-Fallback
db/schema.sql    kanonisches DDL + RLS (Quelle der Wahrheit)   ★ kritisch
channels/{base,web,telegram,email}.ts   Adapter; whatsapp.ts + phone.ts = Phase-2-Gerüst
server/{app,middleware,index}.ts        Hono: /api/chat (SSE), /api/health, statisch; CORS, Rate-Limit, Validierung ★
mcp-server.ts    erweitern: optional KB-Suche/Agent für Entwickler
index.ts         öffentliche Exporte
```
`web/`: `widget.js` (abhängigkeitsfreies IIFE-SSE-Widget), `widget.css`, `embed.html` (DE-Integrationssnippet),
`demo.html`, `kb-seed.json` (deutsche FAQ).

## Datenmodell (`src/db/schema.sql`)

Extensions `pgcrypto`, `vector`. Tabellen: **contacts** (`channel`,`channel_user_id`, optional `email`, `consent_at`,
unique `(channel,channel_user_id)`), **conversations** (`status` open|handed_off|closed), **messages**
(`role`,`content`,`tokens`,`model`,`meta`), **kb_documents** (`source_url` unique, `content_hash`,`lang`), **kb_chunks**
(`content`, `embedding vector(1024) null`, `fts tsvector generated … 'german'`; GIN auf fts, ivfflat auf embedding),
**leads**, **handoffs**, **audit_log** (append-only).

**RLS** auf allen Tabellen, default-deny. Backend nutzt **service-role-Key** (umgeht RLS) und ist einziger Writer – das
ist die Sicherheitsgrenze. Service-Key erreicht **nie** den Browser; das Widget spricht nur mit unserem Backend.
Anwenden via Supabase-MCP `apply_migration`; prüfen mit `list_tables` + `get_advisors` (Security-Advisor muss sauber sein).

## Wissensbasis / RAG

`ingest.ts`: crawl (same-origin BFS, robots, Tiefen-/Seiten-Caps) → chunk (~500 Tok, ~50 Overlap, `source_url`) → embed
(Null default; Voyage bei Key) → upsert (unverändert via `content_hash` überspringen). Retrieval: **lexikalisch immer**
(`to_tsquery('german')` + `ts_rank`), **hybrid** wenn Embeddings (pgvector-Cosine + RRF, top-k=5 mit Zitaten).
Fehler nicht-fatal → Engine antwortet aus Persona/Verlauf mit „ohne KB-Treffer"-Hinweis. Ohne URL → `seed.ts` lädt
Platzhalter-FAQ, damit Demos fundierte Antworten liefern.

## Konfiguration & Modi

Eine Zod-Schema-Datei; `.env.example` erweitern (`.env` bereits gitignored). Modi:
- **demo** (kein Key) – deterministische FAQ + Banner.
- **anthropic-only** (nur `ANTHROPIC_API_KEY`) – **primärer Test-Lauf**: echte, fundierte Antworten aus Seed/lexikalischer KB, In-Memory-Persistenz.
- **live** (Supabase + optionale Kanäle/Embeddings).
`/api/health` meldet aktiven Modus + Status pro Fähigkeit. Secrets werden nie geloggt/committet.

## Sichere Datenanalyse / Security (Kurzform)

DSGVO: EU-Region, Consent-Zeile + `consent_at` + Audit, Datensparsamkeit, nächtliche Retention-Löschung +
Right-to-Erasure-Kaskade, append-only Audit, `PRIVACY.md` (Rechtsgrundlage, Auftragsverarbeiter Anthropic/Supabase/
Voyage/Telegram). RLS überall, Service-Key nur serverseitig. Prompt-Injection: KB + User-Input in abgegrenzten
„untrusted"-Blöcken, System-Prompt behandelt sie als Daten, nie Prompt/Secrets preisgeben, Tools = einzige
Außenwirkung. Output im DOM escapen + Längen-Cap. Webhook-Signaturprüfung (Phase 2). Per-IP/Conversation-Rate-Limit +
Zod-Validierung jeder Payload.

## Gap-Analyse (★ = günstiger Zusatznutzen)

★ Lead-Erfassung, ★ Mensch-Übergabe, ★ FAQ-Autogenerierung aus der Website (Crawler + Claude), ★ Mehrsprachigkeit,
★ Zitate, ★ Analytics-Abfragen (audit_log/messages). Mittel: Analytics-Dashboard-UI. Phase 2: Terminbuchung
(Cal.com/Google), CRM-Export (HubSpot/Pipedrive), Voice. Außerhalb MVP: Outbound-Kampagnen, Zahlungen.

## Acht-fache Fehleranalyse (gefundene Risiken → eingebaute Behebung)

1. **Korrektheit/Grounding:** Halluzination → RAG + „nur aus KB/Persona antworten, sonst sagen + Übergabe anbieten" + Zitate + Seed-FAQ.
2. **Security/Authz:** Key-Leak/SSRF/Injection → Service-Key nur Server; Widget→nur unsere API; Crawler same-origin + Schema-Allowlist + interne IPs blocken; parametrisierte Queries; Output escapen.
3. **DSGVO:** PII ohne Grundlage/keine Löschung → Consent, Minimierung, Retention-Purge, Erasure-Helper, EU-Region, Audit.
4. **Reliability:** 429/5xx/DB/Kanal-Ausfall → SDK-Retry + typisierte Fehler; günstiges-Modell-Fallback bei Overload; Retrieval/DB-Fehler degradieren; Poller mit Backoff, crashen Prozess nie.
5. **Skalierung/Kosten:** Token-Explosion/Crawl-Runaway → Verlauf nach Turn+Token trimmen; top-k-Caps; `effort:"medium"` + Sonnet für günstige Turns; Prompt-Caching; Crawl-Caps; Rate-Limits.
6. **UX:** kein Streaming-Gefühl/Session-Verlust → SSE + „Bot tippt…"; `conversationId` in localStorage; klare „KI-Assistent von K&I" + Consent.
7. **Prompt-Injection/Missbrauch:** „ignoriere Anweisungen/zeige Prompt/maile an alle" → untrusted-Delimiter; nie Prompt/Secrets; gated Tools; Rate-Limit; Mail-Loop-Breaker; Output-Cap.
8. **Ops/Deploy:** fehlende Env-Crashs/Mail-Loops/Secret-Commit → Config validiert + degradiert (Modi) statt Crash; `/api/health`; `.env` gitignored + `.env.example`; graceful shutdown; secret-freie Logs; „add token to go live"-Doku.

## Phasen / Milestones

- **M0** Scaffolding (Config+Modi, Fehler, Typen, Hono-Health) → Server bootet grün im Demo-Modus.
- **M1 (MVP jetzt demonstrierbar)** Kern-Engine + ClaudeClient (Streaming, Demo-Kurzschluss) + Prompt/Memory/Tools + In-Memory-Repo + lexikalische KB + Seed + `/api/chat` SSE + Widget/Demo.
- **M2** Datenebene (Schema + EU-Migration, supabase-js-Repo, RLS verifiziert, Audit, Retention/Erasure).
- **M3** KB-Ingestion (Crawl/Chunk/Ingest, Hybrid + optional Voyage, FAQ-Autogen).
- **M4** Telegram (Long-Poll) + E-Mail (IMAP/SMTP), beide token-gated mit graceful-disable.
- **M5** Härtung (Rate-Limit, Validierung, Injection-Review, Tests, `PRIVACY.md`, `README`).
- **M6** Phase-2-Gerüste (WhatsApp/Phone-Interfaces, Webhook-Signatur-Middleware, Design-Notizen).

## Verifikation (End-to-End)

- **Demo (keine Keys):** Key leeren → `npm run start:server` → `web/demo.html` → Seed-Antwort streamt; Health `mode:"demo"`.
- **anthropic-only (Haupt-Test-Lauf):** nur `ANTHROPIC_API_KEY` → echte, fundierte Antwort aus Seed/lexikalischer KB; Health `mode:"anthropic-only"`.
- **live:** Supabase ergänzen → Zeilen in contacts/conversations/messages/audit_log prüfen; ingest sobald `COMPANY_SITE_URL` da ist.
- **Unit** (`node:test` + `tsx`, kein neues Framework): Memory-Trim, Injection-Delimiter, Chunk-Größe, Retrieve-Ranking (Fixture), Tool-Zod-Validierung, Config-Modus, Kanal-Mapper (Fixtures, kein Netz); ClaudeClient + Repo via Interfaces gemockt.
- **Schema:** auf Supabase-Branch anwenden (`create_branch`+`apply_migration`), `list_tables`+`get_advisors` (RLS aktiv, Advisor sauber), Smoke-Insert via `execute_sql`.
- **Kanal-Dry-Runs:** Telegram `getMe` (ohne Token übersprungen); E-Mail gegen Wegwerf-/Stub-Postfach.
- Neue Scripts: `start:server`, `ingest`, `seed`, `test`, `typecheck`.

## Kritische Dateien
- `src/core/engine.ts` – Orchestrierung Memory→RAG→Claude→Tools→Persist
- `src/core/claude.ts` – SDK-Wrapper (Streaming, Modi, Fehler-Mapping, Demo)
- `src/server/app.ts` – Hono-Routen (SSE-Chat, Health, statisch, Middleware)
- `src/db/schema.sql` – DDL + RLS (Sicherheitsgrenze)
- `src/config.ts` – Env-Validierung + Degradationsmodi

## Genuin blockiert ohne deine Zugänge (alles hinter Config-Flags gekapselt → blockiert nichts anderes)
- Telegram-Live: `TELEGRAM_BOT_TOKEN` · E-Mail-Live: IMAP/SMTP · Live-Persistenz/EU/RLS: Supabase-Projekt + Service-Key
- Semantische Suche: `VOYAGE_API_KEY` (lexikalisch geht ohne) · Echte KB-Inhalte: `COMPANY_SITE_URL` (Seed geht ohne)
- WhatsApp/Telefon: Meta/Twilio + Nummer + öffentliches HTTPS/Hosting

---

# ERWEITERUNG (genehmigte Ausbaustufe): Higgsfield-Integration + einzigartige K&I-Firmen-Website

## Context (warum)
Die Plattform steht (Status M0–M5 fertig, getestet). Jetzt sollen (a) die **Higgsfield-/Wan-Medien­generierung
in die Plattform integriert** und (b) **alle Angebote als einzigartige, lebendige Firmen-Website** für
**K&I Kundenwerke** selbst gebaut werden (Dogfooding = erster „Kunde"). Visuelle Richtung (vom Nutzer gewählt):
**Cinematic Dark + WebGL**. Medien: **Showcase + Live-fähig** (läuft jetzt ohne Kosten, schaltet bei Credentials
automatisch auf echte Generierung). Design mit **freien Open-Source-Bibliotheken**, **kein Standard-Template** –
einzigartiges, handgebautes Design „nur bei uns".

Begriffsklärung: **Higgsfield/Wan** erzeugen die *Medieninhalte* (Bild/Video); **GSAP/Three.js/Lenis** machen die
*Website lebendig*. Beides ist die „Higgsfield-ähnliche" Antwort auf „lebendige Designs".

## Open-Source-Design-Stack (geprüft, alle frei/kommerziell nutzbar, lokal eingebunden)
- **GSAP 3.13+** inkl. **ScrollTrigger + SplitText** — seit Webflow-Übernahme **100% gratis** (scroll-kinetische Typo, Reveals).
- **Lenis** (MIT) — smooth scroll. **Three.js** (MIT) — WebGL-Partikel/Shader-Hero (Neon-Glow). **anime.js/Motion** (MIT) optional.
- **Vendoring:** gepinnte `*.min.js`/Module nach `web/vendor/` kopieren (kein CDN, kein Runtime-npm) + `web/vendor/NOTICE.md` (Lizenzen).

## Teil A – Higgsfield/Wan in die Plattform integrieren
- **Config:** `src/platform/config.ts` → `HF_CREDENTIALS` ins `EnvSchema`; Capability `higgsfield: boolean` (Modus unberührt).
- **MediaService:** neu `src/platform/media/higgsfield.ts` — wrappt bestehenden `HiggsfieldConnector` (`src/client.ts`/`src/index.ts`):
  `generateImage`, `generateVideo`, `getStatus`; degradiert sauber ohne Credentials (typisierter Fehler/Flag).
- **API-Routen** (in `src/platform/server/app.ts`, gleiche Muster wie `/api/chat`):
  - `GET /api/media/gallery` → liefert `web/clips.json` (vorgeneriert/Platzhalter) — **immer** verfügbar.
  - `POST /api/media/generate` → `{type:'image'|'video', prompt, image_url?, aspect_ratio?}`; **gated** auf `capabilities.higgsfield`
    (sonst 503 mit freundlicher Meldung), rate-limited, Zod-validiert. Bild synchron; Video → `requestId`.
  - `GET /api/media/status/:id` → `getStatus` (Polling fürs Video).
- **Optionales Chat-Tool** (Maximal-Ausbau): `generate_image` in `core/tools.ts` + `engine.ts`, **nur** beworben wenn
  `capabilities.higgsfield` — der Bot kann auf Wunsch live ein Visual erzeugen.
- **Open-Source-Alternative:** `local/generate_local.py` (Wan 2.2) bleibt der GPU-Weg; in der README als „ohne Credits/GPU" referenziert.

## Teil B – Einzigartige Firmen-Website (Cinematic Dark + WebGL)
- **Neue Landing** `web/index.html` = K&I-Firmenseite. Bestehende Higgsfield-Galerie nach `web/studio.html` verschieben (erhalten).
- **Bespoke Design-System** unter `web/site/`:
  - `site.css` — eigene Design-Tokens (tiefes Schwarz/Anthrazit, Neon-Akzent, Glow, Grain, fluid type), distinktive Display-Schrift
    (self-hosted `@font-face`), asymmetrisches Layout — bewusst **kein** Bootstrap/Tailwind-Look.
  - `hero.js` — **Three.js** WebGL-Partikel/Shader-Hero mit Neon-Glow; WebGL-Fallback (statischer Verlauf) + `prefers-reduced-motion`.
  - `site.js` — **Lenis** smooth scroll + **GSAP/ScrollTrigger/SplitText**: kinetische Headlines, Section-Reveals, Magnet-CTAs, Parallax.
- **Sektionen (alle Angebote):** (1) WebGL-Hero + CTA, (2) Leistungen: Multi-Channel-Chatbots (Web/WhatsApp/Telegram/E-Mail/Telefon),
  KI-Medien (Bild/Video), Prozessautomatisierung, KI-Beratung, (3) **Live-Demo** mit eingebettetem Chat-Widget (`web/widget.js` – Dogfooding),
  (4) **KI-Media-Showcase**: Galerie aus `/api/media/gallery` + „Live generieren"-Formular (POST `/api/media/generate`, gated/degradiert),
  (5) „Ein Kern, alle Kanäle"-Visual, (6) Ablauf/Prozess, (7) Über uns/Warum K&I, (8) Kontakt-CTA (öffnet Widget → Lead-Capture-Tool).
- **Robustheit:** läuft ohne Keys (Chat=Demo, Galerie=Platzhalter), `prefers-reduced-motion` respektiert, Lazy-Load des WebGL, A11y-Grundlagen.

## Kritische Dateien
- Ändern: `src/platform/config.ts` (Capability `higgsfield`), `src/platform/server/app.ts` (Media-Routen),
  `src/platform/core/tools.ts` + `core/engine.ts` (optionales `generate_image`), `package.json` (vendor-Script/Deps), `web/index.html` (→ Firmenseite).
- Neu: `src/platform/media/higgsfield.ts` (+ `media/types.ts`), `web/site/{site.css,site.js,hero.js}`, `web/vendor/*` (gepinnt) + `NOTICE.md`,
  `web/studio.html` (verschobene Galerie), `src/platform/tests/media.test.ts`.
- Wiederverwenden: `HiggsfieldConnector` (`src/client.ts`), Clip-Manifest `web/clips.json`, Widget `web/widget.js`, `getPlatform()` (`factory.ts`),
  `rateLimit`/`readJson` (`server/middleware.ts`).

## Verifikation (End-to-End)
- `npm run build` sauber; `npm test` grün inkl. neuem `media.test.ts` (Gallery liefert Clips; `generate` ohne Credentials → degradiert/503; Capability-Flag).
- Demo-Boot: `npm run start:server` → `GET /api/health` zeigt `higgsfield:false`; `GET /api/media/gallery` 200; `POST /api/media/generate` → 503-Hinweis.
- **Playwright-Screenshot** der neuen `web/index.html`: WebGL-Hero rendert (bzw. Fallback), Sektionen sichtbar, keine Konsolen-Fehler; `prefers-reduced-motion`-Pfad geprüft; Chat-Widget öffnet & streamt (SSE).
- Commit & Push auf `claude/higgsfield-connector-lq7zdg`.

## Ehrliche Grenzen (wie bisher, hinter Flags gekapselt)
- **Echte** Higgsfield-Live-Generierung braucht `HF_CREDENTIALS` (Credits) bzw. die Wan-GPU; ohne → Galerie/Platzhalter + 503-Hinweis.
- Echter Claude-Chat braucht `ANTHROPIC_API_KEY`; ohne → Demo-Antworten. WebGL-Optik final am besten im echten Browser; ich verifiziere per Headless-Screenshot.

---

# ERWEITERUNG 3 (genehmigt): Premium „Galaxie"-Skill-Showcase + Branchen-Lösungen (rein lokal)

## Context (warum)
Die Firmenseite steht. Jetzt: eine **scroll-getriebene, premium „Galaxie"-Erfahrung** als **neue Datei**
(`web/galaxy.html`) — eine Reise von Planet zu Planet, bei der pro Abschnitt eine neue Szene erscheint. Sie ist
gleichzeitig der **komplette Skill-Showcase** (alles, was wir/ich bauen kann = das maximale Produkt) und zeigt
**Branchen-Lösungen** für andere kleine Unternehmen. **Bestehende Seiten bleiben unverändert** (`web/index.html`
bleibt Hauptseite, Farben/Brand bleiben). **Alles läuft rein lokal** auf dem Laptop (keine Online-Pflicht).
Nutzer-Entscheidungen: **prozedurale Visuals (Three.js, lokal, gratis)**; Branchen-Demos:
**Airbnb-Live-Room-Tour, Restaurant/Gastro, Termin-Buchung**.

## Brand-Treue & Wiederverwendung (aus Bestand)
Gleiche Design-Tokens aus `web/site/site.css` (`--bg #05060a`, `--neon #36f1cd`, `--neon-2 #7c5cff`, `--neon-3 #22d3ee`,
`--glow`, `--ease`, `--font`) + Klassen `.btn/.section/.badge`. Three.js-Muster + Reduced-Motion/WebGL-Fallback aus
`web/site/hero.js`. GSAP+ScrollTrigger+SplitText+Lenis bereits in `web/vendor/` (alle Dateien bestätigt). Live-Chat über
`web/widget.js` (`[data-open-chat]` → `.kiw-launch`). Media über `/api/media/*`. **Keine** bestehende Datei wird ersetzt;
nur additiver Link von `index.html` (Nav/Footer) → `galaxy.html`, und SEED-FAQ-Erweiterung.

## Teil A – `web/galaxy.html` (Premium-Scroll-Galaxie = Skill-Showcase)
- Vollbild-WebGL-Canvas `#galaxy` (`web/site/galaxy.js`, Three.js, prozedural): Sternenfeld + Nebel + **einzigartige
  Shader-Planeten** (GLSL-fbm-Noise-Oberflächen, Fresnel-Atmosphäre/Glow, ein Ringplanet, additives Bloom-Feeling,
  Fog/Tiefe), Farben aus Brand-Palette. Kein externes Asset → komplett offline/gratis.
- **Scroll = Kamerafahrt** (GSAP ScrollTrigger, `scrub`): die Kamera fliegt entlang eines Pfades von Planet zu Planet;
  pro „Station" wird ein **Content-Panel** eingeblendet (SplitText-Kinetik), die Szene/Nebelfarbe wechselt → „neues Bild
  pro Abschnitt". Am Ende: Galaxie-Totale + CTA (Chat/Kontakt). Pinned Sections, Pointer-Parallax, weiche Eases.
- **Stationen = unsere Angebote + Skills** (zeigt „alles was wir drauf haben"):
  1. Web-Chat (Live-Widget eingebettet, „jetzt sprechen"), 2. WhatsApp/Telegram/E-Mail (Multi-Channel),
  3. Telefon-KI & **KI-Stimmen/Voice-Clone/Dubbing** (Higgsfield-Voice), 4. **KI-Medien**: Bild/Video/**3D**, Upscale,
  Background-Removal, Reframe, Marketing-Studio, Virality-Prediction (Higgsfield-Katalog) + Live-Galerie `/api/media/gallery`,
  5. Automatisierung & KI-Beratung (RAG/Workflows/DSGVO-EU), 6. **Branchen-Lösungen** (Teil B), 7. Finale + CTA.
- Robustheit: PixelRatio-Cap, Pause bei Tab-Hidden, `prefers-reduced-motion` → statischer Premium-Fallback (Sektionsliste,
  keine Animation), WebGL-Fail → CSS-Fallback (wie `hero.js`).
- Styles: `web/site/galaxy.css` (lädt zusätzlich `site.css` für Tokens/Klassen).

## Teil B – Branchen-Lösungen + Airbnb „Live-Room-Tour"
- In `galaxy.html` eine Sektion „Was wir auch für andere bauen": Karten für **Airbnb/Immobilien**, **Restaurant/Gastro**,
  **Termin-Buchung** (je mit Nutzen + Mini-Visual).
- Eigene Demo `web/tours/airbnb.html` (+ `tours/tour.css`, `tours/tour.js`): **Scroll-Rundgang durch Räume** — horizontaler
  gepinnter Schwenk über einen stilisierten Wohnungs-Querschnitt (Wohnzimmer→Küche→Schlafzimmer→Bad→Balkon) mit
  **Parallax-Tiefenebenen, Hotspots, Ken-Burns**, sodass man „durch die Wohnung geht". Prozedural/lokal (stilisierte
  Szenen als Vorlage; Kunde droppt später Fotos/360°/echte Higgsfield-Room-Clips ein). Brand-Farben, premium.

## Teil C – Firma lokal einrichten (K&I)
- `START_LOCAL.md` (DE): exakte Schritte — `npm install` → `npm run build` → `npm run start:server` →
  `http://localhost:8787/` (Hauptseite), `/galaxy.html` (Showcase), `/tours/airbnb.html`, `/studio.html`.
  Demo-Modus ohne Keys; `ANTHROPIC_API_KEY` = echter Bot; `HF_CREDENTIALS` = echte Medien; Higgsfield-MCP bereits verbunden.
- `package.json`: `start`-Alias (= build + start:server). 
- Bot für K&I „scharf": `src/platform/core/persona.ts` SEED-FAQ um die neuen Angebote erweitern (Telefon-KI, KI-Stimmen,
  KI-Medien/3D, Branchen-Lösungen/Airbnb-Tour), damit der Assistent alles erklären kann.

## Kritische Dateien
- Neu: `web/galaxy.html`, `web/site/galaxy.css`, `web/site/galaxy.js`, `web/tours/airbnb.html`, `web/tours/tour.css`,
  `web/tours/tour.js`, `START_LOCAL.md`.
- Additiv ändern (nicht ersetzen): `web/index.html` (Link zur Galaxie in Nav/Footer), `src/platform/core/persona.ts`
  (SEED-FAQ), `package.json` (`start`-Alias).
- Wiederverwenden: `web/vendor/*`, `web/site/site.css`-Tokens, `web/site/hero.js`-Muster, `web/widget.js`, `/api/media/*`.

## Verifikation (End-to-End, lokal)
- `npm run build` sauber; `npm test` grün (nur `persona.ts` als TS berührt).
- Server booten; **Playwright-Screenshots** der Galaxie bei Scroll 0/25/50/75/100 % (Planet 1…Finale) + Reduced-Motion-Fallback
  + Airbnb-Tour an mehreren Scroll-Punkten; **keine Konsolen-/Modul-404-Fehler**; Chat-Widget öffnet auch auf `galaxy.html`.
- Bestätigen, dass `web/index.html` (Hauptseite) **unverändert** rendert. Commit + Push auf `claude/higgsfield-connector-lq7zdg`.

## Ehrliche Grenzen
- Prozedurale Galaxie = **komplett lokal/offline/gratis** (wie gewählt). Echte Higgsfield-Room-Clips/Planeten-Bilder sind
  optional nachrüstbar (MCP/Credits). WebGL-Optik final am besten auf echter GPU; ich verifiziere per Headless-SwiftShader-Screenshot.
