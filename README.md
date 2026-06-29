# Higgsfield Connector

A lightweight TypeScript connector for the [Higgsfield](https://higgsfield.ai) AI
generation API. It wraps Higgsfield's submit-then-poll workflow so you can
generate **images** and **videos** with a single awaited call.

## Features

- 🔑 Credential handling (`KEY_ID:KEY_SECRET` via argument or `HF_CREDENTIALS`)
- 🖼️ Text-to-image generation
- 🎬 Image-to-video generation
- 🔁 Automatic status polling until a job reaches a terminal state
- ⏱️ Configurable timeouts, poll interval, and max wait
- 🧱 Typed results and a clear error hierarchy
- 🪝 Optional webhook support
- 📦 Zero runtime dependencies (uses native `fetch`, Node 18+)

## Install

```bash
npm install
npm run build
```

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
