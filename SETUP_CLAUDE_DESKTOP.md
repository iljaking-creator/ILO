# Higgsfield mit Claude Desktop verbinden

Diese Anleitung verbindet Higgsfield als MCP-Server mit der **Claude Desktop App**.
Danach kann Claude direkt Bilder und Video-Clips über Higgsfield erzeugen.

> ⚠️ **Wichtig:** Die Higgsfield-Software ist gratis, aber das **Generieren kostet
> Credits**. Du brauchst ein Higgsfield-Konto mit Guthaben und einen API-Schlüssel.

---

## Schritt 1 – Higgsfield-Konto & API-Schlüssel erstellen

1. Gehe zu **<https://cloud.higgsfield.ai>** und registriere dich / melde dich an.
2. Lade Guthaben (Credits) auf bzw. wähle einen Plan – ohne Credits schlägt jede
   Generierung fehl.
3. Öffne den Bereich **API Keys** und erstelle einen neuen Schlüssel.
4. Du bekommst zwei Werte: eine **Key-ID** und ein **Secret**.
   Notiere sie im Format:

   ```
   KEY_ID:KEY_SECRET
   ```

   (also beide mit einem Doppelpunkt verbunden, z. B. `ab12cd34:s3cr3t...`).

   👉 Das Secret wird oft nur **einmal** angezeigt – sicher speichern!

---

## Schritt 2 – Diesen Connector lokal vorbereiten

Auf dem Rechner, auf dem die Claude Desktop App läuft:

```bash
# Projekt holen
git clone <DEIN_REPO_URL> higgsfield-connector
cd higgsfield-connector

# Abhängigkeiten installieren und bauen
npm install
npm run build
```

Merke dir den **absoluten Pfad** zum Projekt, z. B.:

- macOS/Linux: `/Users/ich/higgsfield-connector`
- Windows: `C:\\Users\\ich\\higgsfield-connector`

---

## Schritt 3 – In Claude Desktop eintragen

1. Öffne die Konfigurationsdatei der Claude Desktop App:

   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\\Claude\\claude_desktop_config.json`

   (Tipp: In der App unter **Einstellungen → Developer → Edit Config**.)

2. Trage den Higgsfield-Server ein. Wenn die Datei schon einen
   `"mcpServers"`-Block hat, füge nur den `"higgsfield"`-Eintrag hinzu:

   ```json
   {
     "mcpServers": {
       "higgsfield": {
         "command": "node",
         "args": ["/ABSOLUTER/PFAD/higgsfield-connector/dist/mcp-server.js"],
         "env": {
           "HF_CREDENTIALS": "KEY_ID:KEY_SECRET"
         }
       }
     }
   }
   ```

   - Ersetze den Pfad in `args` durch deinen echten Pfad aus Schritt 2.
   - Ersetze `KEY_ID:KEY_SECRET` durch deinen Schlüssel aus Schritt 1.
   - Auf Windows die Backslashes doppelt schreiben, z. B.
     `"C:\\\\Users\\\\ich\\\\higgsfield-connector\\\\dist\\\\mcp-server.js"`.

3. **Claude Desktop komplett schließen und neu starten.**

---

## Schritt 4 – Testen

Nach dem Neustart sollte in Claude Desktop (Werkzeug-/Stecker-Symbol) der Server
**higgsfield** mit drei Tools auftauchen:

- `higgsfield_generate_image`
- `higgsfield_generate_video`
- `higgsfield_get_status`

Probiere z. B.:

> „Erstelle mir mit Higgsfield ein Bild: ein neon-beleuchteter Stadthorizont in der
> Dämmerung, Format 16:9."

und danach:

> „Animiere dieses Bild zu einem kurzen Clip mit langsamem Heranfahren."

---

## Fehlerbehebung

| Problem                              | Ursache / Lösung                                                                 |
| ------------------------------------ | -------------------------------------------------------------------------------- |
| Server taucht nicht auf              | Pfad in `args` falsch, oder Claude nicht neu gestartet. JSON auf Kommafehler prüfen. |
| „Missing Higgsfield credentials"     | `HF_CREDENTIALS` fehlt oder leer im `env`-Block.                                  |
| „Invalid credentials format"         | Schlüssel muss `KEY_ID:KEY_SECRET` (mit Doppelpunkt) sein.                        |
| 401 / 403 vom API                    | Schlüssel ungültig/widerrufen oder Konto ohne Guthaben.                           |
| Job-Status `nsfw` oder `failed`      | Inhalt abgelehnt bzw. Fehler – Credits werden i. d. R. zurückerstattet.          |
| `node` nicht gefunden                | Node.js (≥ 18) installieren: <https://nodejs.org>.                               |
