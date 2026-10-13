# Büro-Setup: Was mit den vorhandenen Geräten möglich ist

Stand: 13.10.2026 · privates Setup (nicht K&I Kundenwerke, nur am Rand erwähnt)

Ziel: Du kommst ins Büro, sagst einen Satz oder klappst den Laptop auf, und alles startet von selbst:
Laptop wacht auf, der BenQ zeigt das Bild, Alexa sagt die Nachrichten, der Bilderrahmen zeigt
Notizen, Zahlen und To-dos, und das iPad fragt: „Spotify oder YouTube ‚Später ansehen'?"

---

## 0. Das Fundament: drei Dinge vorweg

### 0.1 Wo ich (Claude) laufe
Diese Sitzung läuft **in einem Cloud-Container**, nicht auf deinem Asus Vivobook. Ich kann deshalb
**keine** Geräte „spüren", die du am Laptop, am ISY-Dock oder im WLAN anschließt. Damit ich Geräte
wirklich sehen kann, gibt es zwei Wege:

1. **Claude Code oder Claude Desktop lokal** auf einem Rechner in deinem Heimnetz. Dann kann ich dort
   Befehle ausführen (Netzwerk scannen, USB-Geräte auflisten, Skripte einrichten).
2. **Eine Steuerzentrale (Home Assistant)**, die alle Geräte kennt. Claude verbindet sich dann **nur
   einmal** mit dieser Zentrale (über den offiziellen MCP-Server von Home Assistant) und nicht mit
   jedem Gerät einzeln. Das ist der saubere Weg.

### 0.2 Sicherheitssperren nicht „entkräften"
Fast alle deine Geräte haben **offizielle lokale Schnittstellen**: die FRITZ!Box (TR-064), die Tapo-Kamera
(RTSP/ONVIF), der BenQ (DDC/CI), viele Philips-Luftreiniger (CoAP) und Spotify Connect. Dafür muss nichts
geknackt werden. Sicherheitsfunktionen abzuschalten würde das Heimnetz angreifbar machen und bringt
für dein Ziel nichts. Ausnahme ist nur PS3/PS4-Homebrew (siehe Abschnitt 2). Die Geräte gehören dir, das
ist erlaubt, lohnt sich aber kaum.

### 0.3 Datenschutz: ehrlich betrachtet
- **Claude selbst ist Anthropic, ein US-Unternehmen.** Alles, was du mir schreibst, geht an Anthropic.
  „Auf dem Laptop läuft nur Claude" und „private Daten nicht nach Amerika" passen also nur zusammen, wenn
  private Daten **nicht im Chat landen**, sondern lokal bleiben.
- **Die kleine Lösung dafür:** Das **ThinkPad wird jetzt dein Mini-Server** (Abschnitt 3). Es speichert
  Notizen, Zahlen und Smart-Home-Daten im Haus und kann kleine lokale KI-Modelle betreiben (Ollama). Ich
  helfe beim Bauen und Konfigurieren, die privaten Inhalte bleiben auf dem ThinkPad.
- Alexa (Amazon), Spotify, YouTube (Google) und die Tapo-Cloud sind selbst Cloud-Dienste. Das ist okay
  für Musik und Nachrichten, aber nicht für sensible Daten.

---

## 1. Inventar: Was kann jedes Gerät wirklich?

| Gerät | Realistische Rolle | Lokal steuerbar? | Bewertung |
|---|---|---|---|
| **Asus Vivobook** | Arbeitsrechner mit Claude Desktop/Code, Cockpit | Wake-on-LAN (muss getestet werden) | Ja, aber zuerst entschlacken |
| **Lenovo ThinkPad** | **Mini-Server bis zum Mac mini** (24/7) | Voll | ⭐ wichtigstes Gerät |
| **BenQ-Monitor** | Schaltet sich bei Signal automatisch ein; Eingang und Helligkeit per DDC/CI | Ja (über Laptop) | Ja |
| **USB-C-Dock / ISY-Hub** | Ein Kabel für alles, Ethernet für Wake-on-LAN | – | Ja (LAN-Port nutzen!) |
| **FRITZ!Box** | Netz-Zentrale: Wake-on-LAN, Anwesenheit (iPhone im WLAN), VPN, Kindersicherung, später Telefonie | Ja (TR-064) | ⭐ |
| **Echo (Alexa)** | Sprachbefehl, Nachrichten, Lautsprecher, Bluetooth-Box, Durchsagen | Teilweise (Cloud) | Ja |
| **iPad** | Dashboard und Musik-/YouTube-Station mit Pop-up-Fragen | Kurzbefehle + Home-Assistant-App | Ja |
| **iPhone 11 Pro** | Auslöser: NFC-Tag am Schreibtisch, „Ankunft zu Hause", Fernbedienung | Kurzbefehle | Ja |
| **Hama-Bilderrahmen** | Notizen-/Zahlen-Board | **hängt vom Modell ab** (siehe unten) | Ja, wenn WLAN/Frameo |
| **Tapo-Kamera** | Anwesenheitserkennung („Person im Büro"), Sicherheit | Ja (RTSP/ONVIF lokal) | Ja |
| **Philips Luftreiniger** | Startet mit „Büro an", Luftwerte aufs Dashboard | Modellabhängig (CoAP lokal oder Cloud) | Nettes Extra |
| **DJI Osmo Pocket 3** | Webcam per USB-C (UVC-Webcam-Modus), Content | Nein | Ja, als Selfie-/Videocall-Kamera |
| **Air Duster P70** | Hat keine Funk- oder Datenverbindung, nur Motor und Akku | – | **Vivobook-Lüfter ausblasen** (hilft gegen Hitze und Drosselung!) |
| **PS5** | Bleibt unangetastet für GTA 6 | – | Nicht anfassen |
| **PS4** | Spotify-/YouTube-/Medienplayer am TV, Remote-Play-Gerät | Kaum | Nur als Player |
| **PS3** | Medienplayer (DLNA), Retro | Nein | Kein Server |
| **Switch, DS, PSP, Gameboy** | Retro-Ecke, Deko | Nein | Kein Automatisierungsnutzen |

### Zum Hama-Bilderrahmen (wichtig)
Hama verkauft zwei Arten von Rahmen:
- **WLAN-Rahmen mit Frameo-App** (Android-basiert): Bilder kommen per App. Eine offizielle API gibt es
  nicht, aber je nach Firmware lässt sich **ADB übers Netzwerk** aktivieren. Dann kann der Server alle
  X Minuten ein frisch erzeugtes Bild (Notizen, Zahlen, To-dos) auf den Rahmen schieben. Für Home Assistant
  gibt es dafür Community-Integrationen. Ohne ADB geht es halb automatisch: Der Server erzeugt das Bild,
  das iPhone teilt es per Kurzbefehl an Frameo (ein Tipp).
- **Rahmen nur mit SD-Karte/USB:** Live-Inhalte sind nicht möglich. Dann übernimmt das iPad das
  Notizen-Board, und der Rahmen zeigt Motivation, Ziele und Fotos.

→ **Bitte schick mir die genaue Modellbezeichnung (Aufkleber hinten).**

---

## 2. PS3 und PS4: Kann man sie als Server oder Laufwerk nutzen?

| Idee | Machbar? | Warum (nicht) |
|---|---|---|
| PS3 als Server/NAS | ❌ | 256 MB RAM, Linux („OtherOS") nur mit Custom-Firmware, extrem langsam, kein Netzlaufwerk-Dienst |
| PS4 als Linux-Server | ⚠️ technisch ja | Nur mit Jailbreak bei passender alter Firmware. Schwache CPU, braucht 80–150 W im Leerlauf (ThinkPad: ca. 10 W), instabil, kein Sinn |
| PS3/PS4 als Datei-Ablage | ❌ | Sie geben keine Ordner im Netz frei, sie können nur abspielen |
| **PS4 als Spotify-/YouTube-/Medien-Player am TV** | ✅ | Spotify-App + Spotify Connect: Steuerung vom iPhone |
| **PS3/PS4 als DLNA-Player** | ✅ | Spielt Videos/Musik vom ThinkPad-Server ab |
| **Verkaufen → Geld für Mac mini** | ✅ | PS4 + PS3 bringen gebraucht zusammen grob 100–250 € (je nach Zustand/Zubehör) |

**Fazit:** Als Server taugen beide nicht, das ThinkPad ist dafür 10× besser und sparsamer. Die PS4 als
Musik/YouTube-Station im Wohnzimmer behalten oder beide verkaufen. Die PS5 bleibt original und online
(GTA 6, nach letztem Stand für den 19.11.2026 angekündigt).

---

## 3. Alle Lösungswege für die „Steuerzentrale" und das Ausschlussverfahren

Die zentrale Frage lautet: **Wer ist das Gehirn**, das morgens alles nacheinander anstößt?

| # | Lösung | Ausgeschlossen? | Grund |
|---|---|---|---|
| A | PS3/PS4 als Server | ❌ raus | Zu schwach, zu stromhungrig (Abschnitt 2) |
| B | Vivobook als Zentrale (Node-RED/n8n darauf) | ❌ raus | Er ist langsam, soll schlafen können, und auf ihm soll „nur Claude" laufen. Die Zentrale muss aber an sein, **bevor** der Laptop wach ist |
| C | Cloud-Dienste (IFTTT, Voice Monkey, Zapier) | ❌ raus | US-Cloud, Abo-Kosten, widerspricht deiner Datenschutz-Regel |
| D | Claude direkt mit jedem Gerät verbunden | ❌ raus als Gehirn | Claude ist kein 24/7-Dienst, der morgens selbst auslöst, und alles würde über US-Server laufen. **Aber:** Claude als *Baumeister und Bedienoberfläche* über Home Assistant ist ideal |
| E | Auf den Mac mini warten | ❌ raus | Unnötig. Home Assistant lässt sich später per Backup 1:1 auf den Mac mini umziehen |
| F | **Nur Alexa-Routinen + iPhone/iPad-Kurzbefehle** (kein Server) | ✅ bleibt (Platz 2) | 0 €, an einem Abend erledigt. Grenzen: kein echtes Laptop-Aufwecken, kein Live-Bilderrahmen, keine lokale KI |
| G | **Home Assistant auf dem ThinkPad + Alexa als Stimme** | ✅ **Platz 1** | Lokal (DSGVO-freundlich), kostenlos, kann alles aus Abschnitt 1, Claude-Anbindung über MCP, später einfacher Umzug auf den Mac mini |

**Ergebnis:**
1. **Empfehlung:** **G**, also Home Assistant auf dem ThinkPad als Gehirn. Alexa ist Mikrofon und
   Lautsprecher, das iPad ist Bildschirm, die FRITZ!Box ist das Netz.
2. **Plan B / Sofort-Start:** **F**. Schon heute Abend startbar, und G baut später direkt darauf auf.

---

## 4. Die Level: von einfach bis ultra

### Level 1: Einfach (1 Abend, 0 €, kein Server)
- **Vivobook entschlacken:** Autostart aufräumen, Bloatware entfernen, Energiemodus „Beste Leistung",
  Lüfter mit dem **P70 ausblasen** (Laptop aus, Lüfter festhalten!), SSD-Zustand und RAM prüfen.
- **BenQ:** Im OSD „Auto Power On" und Auto-Eingangswahl aktivieren. Dann geht der Monitor automatisch an,
  sobald der Laptop am Dock aufwacht.
- **Alexa:** Spotify als Standard-Musikdienst verknüpfen. Nachrichtenquellen einstellen (z. B. Tagesschau,
  Deutschlandfunk). Routine **„Alexa, Büro an"** → Nachrichten + Wetter + Termine + Spotify-Playlist.
  Alexa als **Bluetooth-Lautsprecher** mit Laptop/iPad koppeln („Alexa, koppeln").
- **iPad:** Fokus „Büro" einrichten und Spotify + YouTube aufs Home-Screen legen. Die „Später ansehen"-Liste
  öffnet sich direkt über den Link `https://www.youtube.com/playlist?list=WL` (im YouTube-App-Login).
- **iPhone:** NFC-Sticker (ca. 5 € für 10 Stück) an den Schreibtisch kleben. Antippen → Kurzbefehl startet
  die Fokus-Modi und Spotify auf dem Echo.
- **Osmo Pocket 3:** Per USB-C ans Dock → im Menü „Webcam" wählen → Selfie- und Videocall-Kamera.
- **Bilderrahmen:** Vorerst Fotos von Zielen, Notizen und Zahlen von Hand per App (falls Frameo) schicken.

### Level 2: Mittel (1 Wochenende, 0–20 €)
- **ThinkPad → Ubuntu Server/Debian** (oder Home Assistant OS direkt), per **LAN-Kabel** an die FRITZ!Box,
  Deckel zu, Akku auf 80 % begrenzen (BIOS/TLP), läuft 24/7 mit ca. 8–15 W.
- Darauf:
  - **Home Assistant** (Gehirn)
  - **Ollama** mit kleinem lokalem Modell (3–4B Parameter, z. B. Qwen/Llama/Gemma). Ausreichend für
    Zusammenfassungen und Texte für den Rahmen, alles lokal.
  - **Notizen lokal:** Obsidian-Ordner per **Syncthing** zwischen ThinkPad, Vivobook, iPhone, iPad
    synchronisieren (kein Cloud-Zwang).
  - Optional **Samba-Freigabe** als Netzlaufwerk (das „Laufwerk", das PS3/PS4 nicht sein können).
- **FRITZ!Box:** In Home Assistant integrieren. Damit ist das iPhone im WLAN = „Ich bin da". Das Vivobook
  bekommt eine feste IP, Wake-on-LAN wird aktiviert.
- **Tapo:** Im Tapo-App ein „Kamerakonto" anlegen → lokaler RTSP-Stream → Home Assistant. Optional in der
  FRITZ!Box-Kindersicherung den Internetzugang der Kamera sperren, dann bleibt alles lokal.
- **Philips Luftreiniger:** Je nach Modell lokal (CoAP-Integration) oder per Cloud-Integration einbinden.
- **iPad:** Home-Assistant-App installieren, Dashboard mit To-dos, Zahlen und Luftqualität.

### Level 3: Schwer (die „Büro-Start"-Szene, wie von dir beschrieben)
**Auslöser** (einer genügt):
- „Alexa, Büro an" (Alexa → Home Assistant über *Emulated Hue*, lokal; alternativ über die offizielle
  Alexa-Skill-Anbindung),
- NFC-Tag mit dem iPhone antippen,
- Tapo erkennt eine Person im Büro (morgens, erstes Mal am Tag),
- Laptop aufklappen.

**Ablauf (automatisch, ca. 20–40 Sekunden):**
1. FRITZ!Box/Home Assistant schickt **Wake-on-LAN** → Vivobook wacht auf.
   *Wichtig: Wake-on-LAN muss getestet werden.* Aus dem Standby über den LAN-Port des Docks klappt es oft,
   aus dem kompletten Herunterfahren bei vielen Laptops nicht. Lösung: Laptop schlafen statt herunterfahren
   lassen bzw. „Ruhezustand", und im BIOS/Treiber „Wake on Magic Packet" einschalten.
2. **BenQ** bekommt Signal → schaltet sich ein. Optional schaltet ein kleines Skript per DDC/CI den Eingang
   oder die Helligkeit (Windows: ControlMyMonitor).
3. **Luftreiniger** geht an.
4. **Alexa** sagt: „Guten Morgen Ilja, 3 offene To-dos, heute 2 Termine …" und danach die Nachrichten
   (Durchsagen über die Community-Integration *Alexa Media Player*).
5. **Bilderrahmen** zeigt das frisch erzeugte Tagesbild: Zahlen, Vorhaben, Erledigungen, was noch nicht
   hochgeladen ist.
6. **iPad** bekommt eine Push-Nachricht mit Knöpfen:
   **[🎵 Spotify starten] [▶️ YouTube „Später ansehen"] [📝 Notizen] [Nein danke]**
   Jeder Knopf öffnet direkt die App bzw. Liste.

### Level 4: Ultra
- **Lokale Morgen-Zusammenfassung:** Ollama auf dem ThinkPad liest deine Notizen, To-dos und Zahlen
  (lokal!) und schreibt daraus den Text für Alexa und das Rahmen-Bild. Private Daten verlassen das Haus
  nicht.
- **Eigener Sprachassistent:** Home Assistant „Assist" mit lokalem Whisper (Sprache→Text) und Piper
  (Text→Sprache) für private Befehle. Alexa bleibt für Musik und Nachrichten.
- **Frigate** für lokale Personenerkennung mit der Tapo-Kamera: „Büro betreten" → Szene, „Büro verlassen"
  für 15 Minuten → Monitor/Luftreiniger aus, Laptop schlafen legen.
- **Feierabend-Szene:** „Alexa, Feierabend" → Tagesbilanz auf den Rahmen, Laptop schlafen, Musik aus.
- **Claude als Bedienoberfläche:** Claude Desktop/Code + Home-Assistant-MCP-Server. Dann kannst du sagen
  „Stell die Büro-Szene um" oder „Füg auf dem Rahmen die Umsatzzahl hinzu", und ich ändere es. Bitte
  nur für nicht-sensible Steuerung, weil die Gerätezustände dann an Anthropic gehen.
- **Fernzugriff ohne US-Cloud:** WireGuard-VPN der FRITZ!Box → von unterwegs aufs Dashboard.
- **Später: Umzug auf den Mac mini.** Home Assistant als Backup wiederherstellen, Ollama mit größeren
  Modellen. Das ThinkPad wird dann zum Backup-Server bzw. Zweitgerät.

---

## 5. Ausblick Mac mini / Server für K&I Kundenwerke (nur kurz)
- Für lokale Modelle bei Apple Silicon **mindestens 24 GB, besser 32 GB+ RAM** wählen. Der RAM bestimmt,
  wie große Modelle laufen (≈ 8–14B-Modelle flüssig).
- **Ehrlicher Hinweis für Kundensysteme:** Ein Server zu Hause hängt an deiner privaten Leitung und
  deinem Strom. Für Telefon-, WhatsApp- und E-Mail-Bots von Kunden ist oft ein **Server in einem deutschen
  Rechenzentrum** (z. B. Hetzner, IONOS) zuverlässiger und genauso DSGVO-konform.
- **WhatsApp läuft immer über Meta (USA).** Die Nachrichten selbst liegen dort, egal wo der Bot läuft.
- **Telefon:** Die FRITZ!Box kann ein IP-Telefon (SIP) anmelden. Darüber kann ein lokaler Telefon-Agent
  Anrufe annehmen, ein guter Testaufbau.
- Für Claude im Kundensystem: Claude über **AWS Bedrock oder Google Vertex in EU-Regionen** (Frankfurt)
  nutzen, AVV/DPA abschließen (siehe `PRIVACY.md`).

---

## 6. Wie wir weitermachen (Reihenfolge)

1. **Infos an mich** (einfach abtippen oder Fotos der Typenschilder):
   - Hama-Rahmen: genaues Modell, WLAN/Frameo ja/nein?
   - ThinkPad: Modell, RAM, SSD-Größe
   - Vivobook: Modell, RAM (Einstellungen → System → Info)
   - Echo: Generation (Dot? Show? mit Display?)
   - Philips Luftreiniger: Modellnummer (z. B. AC0850, AC2889 …)
   - Tapo: Modell (C200, C210 …)
   - FRITZ!Box: Modell (7530, 7590 …)
   - Hat dein USB-C-/ISY-Dock einen LAN-Anschluss?
2. **Level 1** heute umsetzen (Liste oben abhaken).
3. **ThinkPad zum Server machen** (Level 2). Dafür am besten **Claude Code direkt auf dem ThinkPad**
   installieren, dann kann ich dort selbst installieren, testen und das Netz scannen.
4. Geräte **nacheinander** in Home Assistant einbinden: FRITZ!Box → Vivobook (Wake-on-LAN) → Alexa →
   iPad/iPhone → Tapo → Rahmen → Luftreiniger.
5. „Büro-Start"-Szene bauen (Level 3), danach Ultra-Extras (Level 4).

**Gerät für Gerät einzeln mit mir „koppeln" ist nicht nötig.** Sie hängen alle an der FRITZ!Box und werden
in Home Assistant eingebunden. Mich verbindest du am Ende **einmal** mit Home Assistant.
