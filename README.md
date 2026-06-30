# Higgsfield Connector

A lightweight TypeScript connector for the [Higgsfield](https://higgsfield.ai) AI
generation API. It wraps Higgsfield's submit-then-poll workflow so you can
generate **images** and **videos** with a single awaited call.

> 📚 **Projekt-Doku & Gesamtbild:** siehe [`docs/`](./docs/) — Architektur, Meisterplan,
> Status und Runbook der K&I-Kundenservice-Plattform. Lokal starten: [`START_LOCAL.md`](./START_LOCAL.md).

## Features

- 🔑 Credential handling (`KEY_ID:KEY_SECRET` via argument or `HF_CREDENTIALS`)
- 🖼️ Text-to-image generation
- 🎬 Image-to-video generation
- 🔁 Automatic status polling until a job reaches a terminal state
- ⏱️ Configurable timeouts, poll interval, and max wait
- 🧱 Typed results and a clear error hierarchy
- 🪝 Optional webhook support
- 🔌 **MCP server** so Claude (Desktop / Code) can call Higgsfield directly
- 📦 Native `fetch` (Node 18+); only MCP deps are added for the server

## Connect to Claude (MCP)

This package ships an MCP server (`higgsfield-mcp`) that exposes Higgsfield as
tools Claude can call: `higgsfield_generate_image`, `higgsfield_generate_video`,
and `higgsfield_get_status`.

- **Claude Desktop:** see [`SETUP_CLAUDE_DESKTOP.md`](./SETUP_CLAUDE_DESKTOP.md)
  for a full step-by-step guide (account, API key, config file).
- **Claude Code (CLI):**

  ```bash
  npm install && npm run build
  claude mcp add higgsfield --env HF_CREDENTIALS="KEY_ID:KEY_SECRET" \
    -- node /absolute/path/to/dist/mcp-server.js
  ```

> The Higgsfield SDK is free, but generation consumes **credits** — you need a
> funded Higgsfield account and an API key from <https://cloud.higgsfield.ai>.

## Install

```bash
npm install
npm run build
```

## Generate 5 social clips + website

This repo also ships a ready-to-run pipeline that produces 5 original animated
clips (storyboards in [`src/clips.ts`](./src/clips.ts)) and a website to publish
them ([`web/`](./web)).

```bash
npm install && npm run build

# 1) Generate the clips (needs a funded Higgsfield key)
HF_CREDENTIALS="KEY_ID:KEY_SECRET" npm run generate
# → writes web/clips.json with image + video URLs

# 2) Preview the gallery
npm run serve   # http://localhost:5173
```

Before generation the gallery shows the storyboards as "pending"; after
generation each card embeds its video, ready to download and post.

See [`RESEARCH_OPEN_SOURCE_VIDEO.md`](./RESEARCH_OPEN_SOURCE_VIDEO.md) for a
vetted comparison of safe open-source video models (and an honest note on what
quality is realistically achievable).

### Free / self-hosted alternative (no Higgsfield credits)

The same 5 clips can be generated with **Wan 2.2** (Alibaba, Apache-2.0) — a
top-rated open-source video model — instead of Higgsfield. It needs a CUDA GPU
(your own or a rented cloud GPU for a few cents). See
[`local/README.md`](./local/README.md).

```bash
cd local
pip install -r requirements.txt
python generate_local.py --dry-run   # validate (no GPU needed)
python generate_local.py             # generate on a GPU → web/clips/*.mp4
```

Both pipelines read the same storyboard ([`storyboard.json`](./storyboard.json))
and write the same `web/clips.json`, so the website works with either backend.

## Configuration

Create credentials at <https://cloud.higgsfield.ai> and provide them as
`KEY_ID:KEY_SECRET`:

```bash
cp .env.example .env
# then set HF_CREDENTIALS in .env
```

| Option           | Env var               | Default                          |
| ---------------- | --------------------- | -------------------------------- |
| `credentials`    | `HF_CREDENTIALS`      | — (required)                     |
| `baseUrl`        | `HIGGSFIELD_BASE_URL` | `https://platform.higgsfield.ai` |
| `timeoutMs`      | —                     | `120000`                         |
| `pollIntervalMs` | —                     | `2000`                           |
| `maxPollMs`      | —                     | `300000`                         |

## Usage

```ts
import { HiggsfieldConnector } from "@ilo/higgsfield-connector";

const hf = new HiggsfieldConnector({
  credentials: process.env.HF_CREDENTIALS, // or rely on the env var
});

// Text-to-image
const image = await hf.generateImage({
  prompt: "a neon city skyline at dusk",
  aspect_ratio: "16:9",
});
console.log(image.imageUrls);

// Image-to-video
const video = await hf.generateVideo({
  prompt: "slow cinematic dolly-in",
  images: image.imageUrls[0],
});
console.log(video.videoUrl);
```

### Low-level control

If you want to manage polling yourself (e.g. with webhooks):

```ts
const job = await hf.submit(
  "flux-pro/kontext/max/text-to-image",
  { prompt: "..." },
  { url: "https://example.com/webhook", secret: "..." },
);

const status = await hf.getStatus(job.request_id);
// ...or wait explicitly:
const result = await hf.waitForCompletion(job.request_id);
```

## Errors

All errors extend `HiggsfieldError`:

| Class                     | When                                          |
| ------------------------- | --------------------------------------------- |
| `HiggsfieldAuthError`     | Missing / malformed credentials               |
| `HiggsfieldApiError`      | Non-2xx HTTP response (`.status`, `.body`)     |
| `HiggsfieldJobError`      | Job ended `failed` or `nsfw` (`.result`)       |
| `HiggsfieldTimeoutError`  | Polling exceeded `maxPollMs`                   |

## Notes

Higgsfield's API surface (endpoints, model identifiers, parameters) evolves.
The default model endpoints used here are:

- Text-to-image: `flux-pro/kontext/max/text-to-image`
- Image-to-video: `v1/image2video/dop` (model `dop-turbo`)

You can override the model per call via the `model` parameter, or call
`submit()` directly with any endpoint.
