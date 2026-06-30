# 🏗️ Architektur — K&I Kundenwerke Plattform

## North Star: Ein Kern, viele dünne Adapter

Jeder Kanal-Adapter normalisiert eingehende Nachrichten zu einem gemeinsamen
`InboundMessage`, ruft `engine.handle()` auf und mappt das `OutboundMessage` zurück.
So bleibt die gesamte Intelligenz an **einer** Stelle.

```
Browser  → Web-Widget   → /api/chat (SSE) ┐
Telegram → getUpdates-Poller              ├─→ AgentEngine.handle():
E-Mail   → IMAP-Poller                    ┘     Kontakt upsert → Conversation laden
WhatsApp → (Gerüst, Phase 2)                    → RAG-Retrieval (FTS + optional Voyage)
Telefon  → (Gerüst, Phase 2)                    → System-Prompt bauen (Persona + KB)
                                                → Claude (Tool-Loop)
                                                  Tools: capture_lead,
                                                         request_human_handoff,
                                                         generate_image (wenn HF aktiv)
                                                → persistieren (messages/leads/handoffs/audit)
```

## Drei Betriebsmodi (graceful degradation)

| Modus | Voraussetzung | Verhalten |
| --- | --- | --- |
| **demo** | kein Schlüssel | Deterministische Antworten aus der Seed-FAQ; Galerie = Platzhalter; In-Memory. |
| **anthropic-only** | nur `ANTHROPIC_API_KEY` | Echte, fundierte Claude-Antworten aus Seed/lexikalischer KB; In-Memory-Persistenz. |
| **live** | + Supabase (+ optionale Kanäle/Embeddings/HF) | Volle Persistenz (EU/RLS), Kanäle live, semantische Suche, echte Medien. |

`/api/health` meldet jederzeit aktiven Modus + Fähigkeiten (`higgsfield`, `telegram`, …).

## Gesperrte technische Entscheidungen (Kurzform)

- **LLM:** `@anthropic-ai/sdk`. Default `claude-opus-4-8`, günstig `claude-sonnet-4-6`.
  Adaptive Thinking + `output_config:{effort:"medium"}`. **Kein** `temperature`/`top_p`/
  `budget_tokens` (alle 400 auf Opus 4.8). Streaming via `.stream()`+`.finalMessage()`. Prompt-Caching auf Persona-Prefix.
- **Daten:** Supabase (Postgres + RLS default-deny + pgvector), EU-Region. Service-Role-Key
  ist **einziger Writer** = Sicherheitsgrenze; erreicht nie den Browser.
- **Embeddings:** Anthropic hat keinen Embeddings-Endpoint → zweistufig: (1) Postgres-Volltextsuche
  (`tsvector`, `german`) immer; (2) optional Voyage (`voyage-3`, 1024-dim) hinter `VOYAGE_API_KEY`.
- **HTTP:** Hono + `@hono/node-server` (SSE/Routing/Middleware).
- **Telegram:** Long-Polling `getUpdates` (keine öffentliche URL nötig). **E-Mail:** IMAP-Poll + SMTP-Send.
- **Medien:** `HiggsfieldConnector` (submit-then-poll). Open-Source-Weg: Wan 2.2 (GPU/Python).
- **Web-Design:** GSAP 3.15 + ScrollTrigger + SplitText, Lenis, Three.js 0.185 — alle **lokal vendored** (kein CDN).

## Dateikarte

### Higgsfield-Connector (Basis, wiederverwendet)
| Datei | Zweck |
| --- | --- |
| `src/client.ts` | `HiggsfieldConnector`: generateImage/Video, submit, getStatus, waitForCompletion (liest `HF_CREDENTIALS`). |
| `src/index.ts`, `src/errors.ts`, `src/types.ts` | Öffentliche Exporte, Fehler-Hierarchie, Typen. |
| `src/mcp-server.ts` | MCP-Server für Higgsfield (Claude Desktop). |
| `src/generate-clips.ts`, `src/clips.ts`, `src/example.ts` | Clip-Generierung / Beispiele. |

### Plattform-Kern (`src/platform/`)
| Datei | Zweck |
| --- | --- |
| `config.ts` | Zod-Env-Loader; berechnet Modus + Capabilities (inkl. `higgsfield`). Keine Secret-Logs. |
| `errors.ts` | `PlatformError` + Config/Anthropic/Db/Channel/RateLimit/Validation. |
| `types.ts` | Channel, Inbound/OutboundMessage, Contact, Conversation, MessageRecord, KbChunk, Lead, Handoff. |
| `factory.ts` | `getPlatform()` — verdrahtet Engine + Repo + Services je nach Modus. |
| **`core/engine.ts`** ★ | `AgentEngine.handle()`: Memory→RAG→Prompt→Claude→Tool-Loop→Persist. Injiziert MediaService. |
| **`core/claude.ts`** ★ | SDK-Wrapper: Modellwahl, adaptive thinking, effort, Streaming-Generator, Demo-Kurzschluss. |
| `core/prompt.ts` | `buildSystemPrompt()`: Persona + KB in `<knowledge_base>` + Anti-Injection-Framing. |
| `core/tools.ts` | Zod-Tools: capture_lead, request_human_handoff, MEDIA_TOOL_DEF (generate_image). |
| `core/memory.ts` | Verlauf laden/trimmen (Turn- + Token-Budget). |
| `core/persona.ts` | Statische Persona + deutsche Seed-FAQ (Leistungen, Kanäle, Telefon-KI, KI-Medien, Branchen, Datenschutz). |
| `kb/{crawl,chunk,embed,retrieve,ingest,lexical,types}.ts` | Same-origin-Crawler, ~500-Token-Chunks, Null/Voyage-Embedder, FTS+Hybrid-Retrieval. |
| `db/schema.sql` ★ | Kanonisches DDL + RLS (default-deny) + pgvector + `kb_search` FTS-Funktion. |
| `db/repo.ts` | In-Memory-DAL (Fallback ohne Supabase). |
| `db/supabase-repo.ts` | Supabase-DAL (service-role). |
| `media/higgsfield.ts` | `MediaService` wrappt `HiggsfieldConnector`; async, degradiert ohne Credentials. |
| `channels/{base,web,telegram,email}.ts` | Kanal-Adapter. `whatsapp.ts`, `phone.ts` = Phase-2-Gerüst. |
| **`server/app.ts`** ★ | Hono-Routen: `/api/health`, `/api/chat` (SSE), `/api/media/{gallery,generate,status/:id}`. |
| `server/middleware.ts` | CORS, Rate-Limit, `readJson`, Validierung. |
| `server/index.ts` | Server-Bootstrap (serveStatic root `./web`). |
| `tests/{unit,engine,media}.test.ts` | 15 Tests (node:test + tsx). |

### Web-Frontend (`web/`)
| Datei | Zweck |
| --- | --- |
| `index.html` | **Hauptseite** (Cinematic Dark, WebGL-Hero). Brand bleibt. |
| `site/site.css` | Bespoke Design-Tokens + Klassen (`.btn/.section/.card/.badge`, `[data-reveal/split/magnet]`). |
| `site/hero.js` | Three.js Partikel-Hero (Reduced-Motion/WebGL-Fallback). |
| `site/site.js` | Lenis + GSAP Reveals/Magnet/SplitText; Galerie-Fetch; `[data-open-chat]`→Widget. |
| `galaxy.html` | **Galaxie-Skill-Showcase**, 8 Stationen (alle Angebote + Branchen). |
| `site/galaxy.js` | Prozedurale Three.js-Galaxie (Shader-Planeten, Nebel, Sternenfeld, Scroll-Kamera). |
| `site/galaxy.css` | Galaxie-Layout (Stations, Glass-Panels, Konstellations-Fortschritt, Fallback). |
| `tours/airbnb.html` | **Airbnb Live-Room-Tour** (horizontaler gepinnter Rundgang). |
| `tours/tour.{css,js}` | Tour-Styles + GSAP-Pin/Scrub + Parallax (stacked Fallback). |
| `studio.html` | Higgsfield-Clip-Galerie (aus alter index.html verschoben). |
| `widget.{js,css}` | Abhängigkeitsfreies SSE-Chat-Widget (Dogfooding). |
| `demo.html`, `embed.html` | Demo-Seite + Einbettungs-Snippet. |
| `vendor/*` | Gepinnte Libs (GSAP/ScrollTrigger/SplitText/Lenis/Three) + `NOTICE.md` (Lizenzen). |
| `clips.json` | Vorgeneriertes/Platzhalter-Medien-Manifest für die Galerie. |

## Sicherheit (Kurzform)
RLS überall (default-deny); Service-Key nur serverseitig; Widget spricht nur mit unserem Backend.
Prompt-Injection: KB + User-Input als abgegrenzte „untrusted"-Blöcke, Tools = einzige Außenwirkung,
Output im DOM escapen + Längen-Cap. Crawler same-origin + interne IPs blocken. Per-IP/Conversation-Rate-Limit
+ Zod-Validierung. DSGVO-Details in [`../PRIVACY.md`](../PRIVACY.md). Vollständige 8-fache Fehleranalyse
in [`MASTERPLAN.md`](./MASTERPLAN.md).
