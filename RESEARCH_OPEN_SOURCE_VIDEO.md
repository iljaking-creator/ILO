# Open-Source Video-Generierung — geprüfte Empfehlungen

Recherche-Stand: Juni 2026. Ziel: sichere, seriöse, quelloffene Modelle für
KI-Animationsclips. Bewertet nach **Lizenz** (kommerzielle Nutzung erlaubt?),
**Reputation/Herkunft**, **Hardware-Bedarf** und **Eignung** für kurze
Social-Media-Clips.

> ⚠️ **Realitäts-Check:** Keines dieser Modelle erzeugt Spielfilm-Qualität
> (Kung Fu Panda / Kaiju-Filme = Studio-CGI mit Render-Farmen). Open-Source-KI
> liefert **kurze, stilisierte Clips** (2–8 Sek.). Außerdem brauchen alle eine
> **GPU** — sie laufen **nicht** in dieser Cloud-Sandbox. Für sofortige
> Ergebnisse ohne eigene GPU ist der **Higgsfield-Connector** (in diesem Repo)
> der pragmatische Weg.

## „Sicher" — was das hier heißt

- **Lizenz:** Apache-2.0 = volle kommerzielle Nutzung ohne Einschränkungen → am
  sichersten für Social-Media-Posts.
- **Herkunft:** etablierte Labs/Firmen, Code & Gewichte offen auf GitHub /
  Hugging Face, große Community → geringes Risiko für Schadcode.
- **Lokal:** läuft auf deiner Hardware, keine Daten an Dritte.

## Empfehlungen (von „am sichersten/einfachsten" abwärts)

| Modell | Herkunft | Lizenz | Min. VRAM | Stärke |
| --- | --- | --- | --- | --- |
| **Wan 2.2** | Alibaba | Apache-2.0 ✅ | ~24 GB (RTX 3090/4090) | Bester Allrounder: T2V, I2V, V2V, bis 1080p |
| **Mochi 1** | Genmo | Apache-2.0 ✅ | ~24 GB | Sehr flüssige Bewegung, produktionserprobt |
| **LTX-Video** | Lightricks | ⚠️ Sep. Lizenz für Kommerz | ~8 GB (RTX 3070) | Mit Abstand am schnellsten, läuft auf kleiner GPU |
| **CogVideoX-5B** | Zhipu/THUDM | Tsinghua-Lizenz (Kommerz mit Auflagen) | ~16 GB | Beste Prompt-Treue bei komplexen Szenen |
| **CogVideoX-2B** | Zhipu/THUDM | Apache-2.0 ✅ | ~12 GB | Leichter, frei kommerziell |
| **HunyuanVideo** | Tencent | Community-Lizenz (Review nötig) | ~24 GB+ | Höchste visuelle Qualität |
| **AnimateDiff** | Community | Apache-2.0 ✅ | ~8 GB | Animiert Stable-Diffusion-Bilder, riesiges Ökosystem |
| **Open-Sora 2.0** | HPC-AI | Apache-2.0 ✅ | ~24 GB | Voll offene Sora-Alternative |

### Konkrete Empfehlung

- **Du hast keine starke GPU / willst sofort Ergebnisse:** Nimm den
  **Higgsfield-Connector** in diesem Repo (Cloud-API, kein eigenes Rendering).
- **Du hast eine RTX 3090/4090 (24 GB):** **Wan 2.2** (Apache-2.0) ist die beste
  freie, rechtssichere Wahl.
- **Kleinere GPU (8–12 GB):** **AnimateDiff** oder **CogVideoX-2B** (beide
  Apache-2.0), oder **LTX-Video** wenn Tempo zählt (Lizenz für Kommerz prüfen).

### Empfohlener lokaler Workflow

Am einfachsten über **ComfyUI** (quelloffen, Apache-2.0) als Oberfläche, das
diese Modelle als Workflows lädt. Modelle immer nur aus den **offiziellen**
GitHub-/Hugging-Face-Repos der jeweiligen Anbieter beziehen.

## Warum ich hier nichts davon installiert habe

1. **Keine GPU** in dieser Cloud-Sandbox → die Modelle würden nicht laufen.
2. **Größe:** Gewichte sind oft 10–60 GB pro Modell.
3. **Sicherheit:** Ich installiere keine schweren, ausführenden ML-Repos
   ungeprüft in eine Umgebung — die Liste oben ist die solide, geprüfte
   Grundlage, mit der du (oder ich auf passender Hardware) gezielt weitermachen
   kannst.

## Quellen

- [Best Open Source AI Video Generation Models in 2026 — Pixazo](https://www.pixazo.ai/blog/best-open-source-ai-video-generation-models)
- [Best Open Source AI Video Generation Models in 2026 — LTX](https://ltx.io/blog/best-open-source-video-generation-models)
- [Open-source video model comparison — ComfyOnline](https://www.comfyonline.app/blog/open-source-video-generation-models-comparisons)
- [Top 5 Open Source Video Generation Models — KDnuggets](https://www.kdnuggets.com/top-5-open-source-video-generation-models)
- [7 Best Open Source Video Generation Models 2026 — Hyperstack](https://www.hyperstack.cloud/blog/case-study/best-open-source-video-generation-models)
