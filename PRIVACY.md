# Datenschutz & Sicherheit – K&I Kundenwerke Plattform

Kurzüberblick über die datenschutz- und sicherheitsrelevanten Eigenschaften der
KI-Kundenservice-Plattform (`src/platform`). Dies ist eine technische
Dokumentation, **keine Rechtsberatung** – die finale Datenschutzerklärung und
Auftragsverarbeitungsverträge (AVV/DPA) müssen vor dem Produktivbetrieb geprüft
werden.

## Verarbeitete Daten (Datensparsamkeit)

- **Kontakte:** Kanal + Kanal-Nutzer-ID (z. B. Chat-ID, E-Mail), optional Name/
  E-Mail, Einwilligungszeitpunkt (`consent_at`).
- **Konversationen & Nachrichten:** Gesprächsverlauf zur Beantwortung der Anfrage.
- **Leads/Handoffs:** nur wenn die Person aktiv Kontaktdaten hinterlässt bzw. eine
  Übergabe ausgelöst wird.
- **Audit-Log:** technische Ereignisse (eingehende Nachricht, Lead, Handoff) ohne
  Nachrichteninhalte.

Es werden **keine** Sonderkategorien, Zahlungsdaten oder unnötigen Felder erhoben.

## Rechtsgrundlage & Einwilligung

- Das Web-Widget zeigt vor der Nutzung einen DSGVO-Hinweis; mit dem Absenden
  willigt die Person in die Verarbeitung zur Bearbeitung ihrer Anfrage ein
  (Art. 6 Abs. 1 lit. a/b DSGVO). Der Zeitpunkt wird als `consent_at` gespeichert.

## Speicherort & Auftragsverarbeiter

- **EU-Region empfohlen** (z. B. Supabase Frankfurt) für alle gespeicherten Daten.
- Eingesetzte Verarbeiter (je nach aktiviertem Modus):
  - **Anthropic** (Claude API) – LLM-Antworten.
  - **Supabase** – Datenhaltung (Postgres, EU).
  - **Voyage AI** – optionale Embeddings (nur wenn `VOYAGE_API_KEY` gesetzt).
  - **Telegram / E-Mail-Provider** – nur für den jeweils aktivierten Kanal.
- Mit jedem aktiv genutzten Verarbeiter ist ein **AVV/DPA** abzuschließen.

## Aufbewahrung & Löschung

- **Retention:** Konversationen älter als `DATA_RETENTION_DAYS` (Default 90) werden
  durch einen täglichen Job gelöscht (`repo.purgeExpired`).
- **Recht auf Löschung:** `repo.deleteContactData(contactId)` entfernt Kontakt und
  alle verknüpften Daten kaskadierend (FK `on delete cascade`).
- Das **Audit-Log** ist append-only und enthält keine Nachrichteninhalte.

## Sicherheitsmaßnahmen

- **RLS auf allen Tabellen** (default-deny). Der Backend-Dienst nutzt den
  Service-Role-Key und ist einziger Writer; der **Browser hält nie**
  Datenbank-Zugangsdaten – das Widget spricht ausschließlich mit unserer API.
- **Prompt-Injection-Schutz:** Wissensbasis und Nutzereingaben werden als
  abgegrenzte „untrusted" Daten behandelt; der System-Prompt verbietet das
  Befolgen eingebetteter Anweisungen und das Offenlegen von Prompt/Secrets.
- **Output-Sicherheit:** Bot-Text wird im DOM ausschließlich via `textContent`
  gesetzt (kein `innerHTML`) und längenbegrenzt.
- **SSRF-Schutz im Crawler:** nur http/https, same-origin, private/Loopback/
  Link-local-Hosts werden abgelehnt.
- **Rate-Limiting & Validierung:** Token-Bucket pro IP, Zod-Validierung jeder
  Payload, Längen-/Größenbegrenzung.
- **E-Mail-Loop-Breaker:** Auto-Responder/Bulk/No-Reply werden ignoriert; eigene
  Antworten tragen `Auto-Submitted: auto-replied`.
- **Secrets:** werden nie geloggt und nie committet (`.env` ist gitignored).

## Datenflüsse (Kurzform)

```
Nutzer:in → Kanal-Adapter → AgentEngine → Claude (Anthropic)
                               │             KB-Retrieval (Supabase/Seed)
                               └→ Persistenz (Supabase/In-Memory) + Audit
```
