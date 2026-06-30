/**
 * Email channel — poll IMAP for unseen mail, answer via SMTP. Config-driven;
 * the developer-side Gmail MCP is NOT used at runtime. Includes a loop-breaker
 * so the bot never ping-pongs with auto-responders or other bots.
 */
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import nodemailer from "nodemailer";

import { getConfig } from "../config.js";
import { getPlatform } from "../factory.js";
import type { InboundMessage } from "../types.js";
import { sleep } from "./base.js";

const POLL_INTERVAL_MS = 30_000;

function isAutomated(headers: Map<string, unknown>, from: string): boolean {
  const auto = String(headers.get("auto-submitted") ?? "").toLowerCase();
  const precedence = String(headers.get("precedence") ?? "").toLowerCase();
  if (auto && auto !== "no") return true;
  if (["bulk", "list", "junk"].includes(precedence)) return true;
  if (/no-?reply|mailer-daemon|postmaster/i.test(from)) return true;
  return false;
}

/** Strip quoted replies / common signature markers to keep the prompt clean. */
function cleanBody(text: string): string {
  const lines = text.split(/\r?\n/);
  const out: string[] = [];
  for (const line of lines) {
    if (/^>/.test(line)) continue; // quoted
    if (/^--\s*$/.test(line)) break; // signature delimiter
    if (/^(Am .+ schrieb|On .+ wrote)/i.test(line)) break; // quote header
    out.push(line);
  }
  return out.join("\n").trim();
}

export async function startEmail(): Promise<() => void> {
  const { env } = getConfig();
  const { engine } = await getPlatform();

  const smtp = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
  });
  const fromAddr = env.SMTP_FROM || env.SMTP_USER || env.IMAP_USER;

  let running = true;

  (async () => {
    while (running) {
      try {
        const client = new ImapFlow({
          host: env.IMAP_HOST,
          port: env.IMAP_PORT,
          secure: env.IMAP_PORT === 993,
          auth: { user: env.IMAP_USER, pass: env.IMAP_PASSWORD },
          logger: false,
        });
        await client.connect();
        const lock = await client.getMailboxLock("INBOX");
        try {
          for await (const msg of client.fetch({ seen: false }, { source: true })) {
            try {
              const parsed = await simpleParser(msg.source as Buffer);
              const from = parsed.from?.value[0]?.address ?? "";
              const name = parsed.from?.value[0]?.name;
              const body = cleanBody(parsed.text ?? "");
              await client.messageFlagsAdd(msg.seq, ["\\Seen"]);

              if (!from || !body || isAutomated(parsed.headers, from)) continue;

              const inbound: InboundMessage = {
                channel: "email",
                channelUserId: from,
                email: from,
                name: typeof name === "string" ? name : undefined,
                text: body,
                meta: { messageId: parsed.messageId },
              };
              const out = await engine.handle(inbound);

              await smtp.sendMail({
                from: fromAddr,
                to: from,
                subject: parsed.subject ? `Re: ${parsed.subject}` : "Ihre Anfrage",
                text: out.text,
                inReplyTo: parsed.messageId,
                references: parsed.messageId ? [parsed.messageId] : undefined,
                headers: { "Auto-Submitted": "auto-replied" },
              });
            } catch (e) {
              console.error("E-Mail-Verarbeitung fehlgeschlagen:", (e as Error).message);
            }
          }
        } finally {
          lock.release();
          await client.logout().catch(() => {});
        }
      } catch (e) {
        console.error("IMAP-Poll-Fehler:", (e as Error).message);
      }
      await sleep(POLL_INTERVAL_MS);
    }
  })();

  return () => {
    running = false;
  };
}
