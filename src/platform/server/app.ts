/**
 * Hono application: health, the SSE chat endpoint, and the static widget demo.
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";
import { z } from "zod";

import { describeConfig, getConfig } from "../config.js";
import { getPlatform } from "../factory.js";
import { getMediaService } from "../media/higgsfield.js";
import type { InboundMessage } from "../types.js";
import { rateLimit, readJson, ValidationFailure } from "./middleware.js";

const ChatBody = z.object({
  message: z.string().min(1, "message darf nicht leer sein").max(4000, "message zu lang"),
  conversationId: z.string().uuid().optional(),
  // Stable anonymous id from the widget (localStorage). Falls back to IP.
  sessionId: z.string().min(1).max(128).optional(),
  locale: z.string().max(16).optional(),
});

export function createApp() {
  const app = new Hono();
  const { allowedOrigins } = getConfig();

  app.use(
    "/api/*",
    cors({
      origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
      allowMethods: ["GET", "POST", "OPTIONS"],
    }),
  );

  app.get("/api/health", (c) => c.json({ status: "ok", ...describeConfig() }));

  app.post("/api/chat", rateLimit(), async (c) => {
    let body: z.infer<typeof ChatBody>;
    try {
      body = await readJson(c, ChatBody);
    } catch (err) {
      const message = err instanceof ValidationFailure ? err.message : "bad request";
      return c.json({ error: "validation_error", detail: message }, 400);
    }

    const { engine } = await getPlatform();
    const channelUserId =
      body.sessionId ||
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
      "web-anon";

    const inbound: InboundMessage = {
      channel: "web",
      channelUserId,
      text: body.message,
      conversationId: body.conversationId,
    };

    return streamSSE(c, async (stream) => {
      // Serialise writes so deltas arrive in order.
      let chain: Promise<unknown> = Promise.resolve();
      const send = (event: string, data: string) => {
        chain = chain.then(() => stream.writeSSE({ event, data }));
        return chain;
      };
      try {
        const out = await engine.handle(inbound, {
          onText: (delta) => {
            void send("delta", delta);
          },
        });
        await send(
          "done",
          JSON.stringify({
            conversationId: out.conversationId,
            citations: out.citations,
            handoff: out.handoff,
          }),
        );
      } catch (err) {
        await send("error", JSON.stringify({ message: "Es ist ein Fehler aufgetreten." }));
        console.error("[chat] error:", (err as Error).message);
      }
      await chain;
    });
  });

  // --- Media (Higgsfield/Wan) -------------------------------------------

  // Pre-generated gallery — always available (placeholders without credentials).
  app.get("/api/media/gallery", async (c) => {
    try {
      const raw = await readFile(resolve("web/clips.json"), "utf8");
      const data = JSON.parse(raw) as { clips?: unknown[] };
      return c.json({ clips: data.clips ?? [], live: getMediaService().available() });
    } catch {
      return c.json({ clips: [], live: getMediaService().available() });
    }
  });

  // Live generation — gated on the higgsfield capability.
  app.post("/api/media/generate", rateLimit(), async (c) => {
    const media = getMediaService();
    if (!media.available()) {
      return c.json(
        {
          error: "media_unavailable",
          detail:
            "Live-Generierung ist nicht aktiv. Hinterlege HF_CREDENTIALS, um echte " +
            "Bilder/Videos zu erzeugen — sonst zeigt die Galerie vorgenerierte Inhalte.",
        },
        503,
      );
    }
    let body: z.infer<typeof MediaBody>;
    try {
      body = await readJson(c, MediaBody);
    } catch (err) {
      const message = err instanceof ValidationFailure ? err.message : "bad request";
      return c.json({ error: "validation_error", detail: message }, 400);
    }
    try {
      if (body.type === "image") {
        const requestId = await media.submitImage(body.prompt, body.aspect_ratio ?? "16:9");
        return c.json({ requestId, kind: "image" });
      }
      if (!body.image_url) {
        return c.json({ error: "validation_error", detail: "image_url erforderlich für Video" }, 400);
      }
      const requestId = await media.submitVideo(body.prompt, body.image_url);
      return c.json({ requestId, kind: "video" });
    } catch (err) {
      console.error("[media] generate error:", (err as Error).message);
      return c.json({ error: "generation_failed", detail: "Generierung fehlgeschlagen." }, 502);
    }
  });

  app.get("/api/media/status/:id", async (c) => {
    const media = getMediaService();
    if (!media.available()) return c.json({ error: "media_unavailable" }, 503);
    try {
      const r = await media.getStatus(c.req.param("id"));
      return c.json({ status: r.status, imageUrls: r.imageUrls, videoUrl: r.videoUrl });
    } catch (err) {
      return c.json({ error: "status_failed", detail: (err as Error).message }, 502);
    }
  });

  return app;
}

const MediaBody = z.object({
  type: z.enum(["image", "video"]),
  prompt: z.string().min(3).max(1000),
  image_url: z.string().url().optional(),
  aspect_ratio: z.string().max(8).optional(),
});
