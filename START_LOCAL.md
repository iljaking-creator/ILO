# K&I Kundenwerke — lokal starten (auf deinem Laptop)

Alles läuft **rein lokal** auf deinem Rechner — nichts wird online gestellt.
Du brauchst nur **Node.js 18+** (empfohlen 20/22).

## In 3 Schritten

```bash
# 1) Einmalig: Abhängigkeiten installieren
npm install

# 2) Bauen + Server starten (ein Befehl)
npm start
#   (entspricht: npm run build && npm run start:server)
```

Dann im Browser öffnen:

| Seite | URL |
| --- | --- |
| **Hauptseite** (Firmen-Website) | <http://localhost:8787/> |
| **Galaxie-Showcase** (alles, was wir können) | <http://localhost:8787/galaxy.html> |
| **Airbnb Live-Room-Tour** (Branchen-Beispiel) | <http://localhost:8787/tours/airbnb.html> |
| **KI-Clip-Galerie** | <http://localhost:8787/studio.html> |
| **Status der Plattform** | <http://localhost:8787/api/health> |

> Standard-Port ist **8787**. Anderer Port: `PORT=3000 npm run start:server`.

Beenden: `Strg + C` im Terminal.

## Was ohne Schlüssel funktioniert (Demo-Modus)

Ohne jegliche Keys läuft alles lokal:
- Die **Website + Galaxie + Tour** rendern voll (WebGL, Animationen).
- Der **Chatbot** (unten rechts) antwortet im **Demo-Modus** aus der lokalen Wissensbasis.
- Die **KI-Studio-Galerie** zeigt vorgenerierte Platzhalter-Clips.

## Mehr aktivieren (optional, jeweils in `.env`)

`cp .env.example .env`, dann eintragen — Neustart mit `npm start`:

| Funktion | Schlüssel | Effekt |
| --- | --- | --- |
| **Echter Bot** (Claude) | `ANTHROPIC_API_KEY` | Echte, KI-gestützte Antworten statt Demo |
| **Echte KI-Medien** | `HF_CREDENTIALS` (`KEY_ID:KEY_SECRET`) | „Live generieren" im KI-Studio erzeugt echte Bilder/Videos |
| **Persistenz/Leads** | `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | Konversationen/Leads werden gespeichert (EU) |
| **Telegram-Bot** | `TELEGRAM_BOT_TOKEN` | Telegram-Kanal geht live |
| **E-Mail-Bot** | `IMAP_*` + `SMTP_*` | E-Mail-Kanal geht live |

`/api/health` zeigt jederzeit, welcher Modus aktiv ist und welche Fähigkeiten an sind.

## Der Bot ist bereits auf K&I eingestellt

Persona und Wissensbasis sind auf **K&I Kundenwerke** zugeschnitten (Leistungen,
Kanäle, Telefon-KI, KI-Stimmen, KI-Medien/3D, Branchen-Lösungen, Datenschutz).
Eigene Inhalte ergänzen: Website-URL in `COMPANY_SITE_URL` setzen und `npm run ingest`
ausführen (benötigt Supabase) — oder die Seed-FAQ in
`src/platform/core/persona.ts` anpassen.

## Tests (optional)

```bash
npm test        # Unit- + Engine-Tests
npm run build   # TypeScript-Build prüfen
```
