/**
 * Hono application: health, the SSE chat endpoint, and the static widget demo.
 */
import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";
import { z } from "zod";

import { describeConfig, getConfig } from "../config.js";
import { getPlatform } from "../factory.js";
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

  return app;
}
