/**
 * Boot the platform: validate config, start the HTTP server (API + static
 * widget), conditionally start channel pollers, schedule retention purges, and
 * shut down gracefully.
 */
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

import { describeConfig, getConfig } from "../config.js";
import { getPlatform } from "../factory.js";
import { ConfigError } from "../errors.js";
import { createApp } from "./app.js";

const DAY_MS = 24 * 60 * 60 * 1000;

async function main() {
  let config;
  try {
    config = getConfig();
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error("Konfigurationsfehler:", err.message);
      process.exit(1);
    }
    throw err;
  }

  console.error("ILO Kundenwerke Plattform —", JSON.stringify(describeConfig(config)));
  if (config.mode === "demo") {
    console.error("Modus: demo (kein ANTHROPIC_API_KEY) — Antworten aus lokaler Wissensbasis.");
  }

  const app = createApp();
  // Static widget + demo page (after API routes so /api/* wins).
  app.use("/*", serveStatic({ root: "./web" }));

  const { repo } = await getPlatform();

  const server = serve({ fetch: app.fetch, port: config.env.PORT }, (info) => {
    console.error(`HTTP-Server läuft auf http://localhost:${info.port}`);
  });

  // Conditionally start channel pollers (graceful-disabled without tokens).
  const stoppers: Array<() => void> = [];
  if (config.capabilities.telegram) {
    const { startTelegram } = await import("../channels/telegram.js");
    stoppers.push(await startTelegram());
    console.error("Kanal Telegram: aktiv (Long-Polling).");
  } else {
    console.error("Kanal Telegram: aus (TELEGRAM_BOT_TOKEN fehlt).");
  }
  if (config.capabilities.email) {
    const { startEmail } = await import("../channels/email.js");
    stoppers.push(await startEmail());
    console.error("Kanal E-Mail: aktiv (IMAP-Polling).");
  } else {
    console.error("Kanal E-Mail: aus (IMAP/SMTP nicht konfiguriert).");
  }

  // Nightly retention purge (best-effort).
  const purgeTimer = setInterval(() => {
    repo
      .purgeExpired(config.env.DATA_RETENTION_DAYS)
      .then((n) => n > 0 && console.error(`Retention: ${n} Konversation(en) gelöscht.`))
      .catch((e) => console.error("Retention-Fehler:", (e as Error).message));
  }, DAY_MS);
  purgeTimer.unref?.();

  const shutdown = () => {
    console.error("Beende Plattform…");
    clearInterval(purgeTimer);
    for (const stop of stoppers) {
      try {
        stop();
      } catch {
        /* ignore */
      }
    }
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 3000).unref?.();
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Fatal beim Start:", err);
  process.exit(1);
});
