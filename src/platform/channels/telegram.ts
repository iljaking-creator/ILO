/**
 * Telegram channel — long-polling `getUpdates` (no public URL / webhook needed,
 * works behind NAT). Native fetch, mirroring the Higgsfield connector style.
 * A webhook path is intentionally omitted until a public HTTPS URL exists.
 */
import { getConfig } from "../config.js";
import { ChannelError } from "../errors.js";
import { getPlatform } from "../factory.js";
import type { InboundMessage } from "../types.js";
import { sleep } from "./base.js";

interface TgUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: { id: number; first_name?: string };
    chat: { id: number };
    text?: string;
  };
}

class TelegramConnector {
  private readonly base: string;
  constructor(token: string) {
    this.base = `https://api.telegram.org/bot${token}`;
  }

  private async call<T>(method: string, params: Record<string, unknown>): Promise<T> {
    const res = await fetch(`${this.base}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(params),
    });
    const json = (await res.json()) as { ok: boolean; result?: T; description?: string };
    if (!json.ok) throw new ChannelError("telegram", json.description ?? `method ${method} failed`);
    return json.result as T;
  }

  getUpdates(offset: number): Promise<TgUpdate[]> {
    return this.call<TgUpdate[]>("getUpdates", { offset, timeout: 30, allowed_updates: ["message"] });
  }

  sendChatAction(chatId: number): Promise<unknown> {
    return this.call("sendChatAction", { chat_id: chatId, action: "typing" });
  }

  sendMessage(chatId: number, text: string): Promise<unknown> {
    return this.call("sendMessage", { chat_id: chatId, text });
  }

  getMe(): Promise<{ username?: string }> {
    return this.call("getMe", {});
  }
}

/** Start the Telegram poller. Returns a stop function. */
export async function startTelegram(): Promise<() => void> {
  const token = getConfig().env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new ChannelError("telegram", "TELEGRAM_BOT_TOKEN missing");
  const tg = new TelegramConnector(token);
  const { engine } = await getPlatform();

  let running = true;
  let offset = 0;
  let backoff = 1000;

  (async () => {
    // Verify the token once so misconfig surfaces immediately.
    try {
      const me = await tg.getMe();
      console.error(`Telegram verbunden als @${me.username ?? "unknown"}.`);
    } catch (e) {
      console.error("Telegram getMe fehlgeschlagen:", (e as Error).message);
    }
    while (running) {
      try {
        const updates = await tg.getUpdates(offset);
        backoff = 1000;
        for (const u of updates) {
          offset = u.update_id + 1;
          const msg = u.message;
          if (!msg?.text || !msg.from) continue;
          const inbound: InboundMessage = {
            channel: "telegram",
            channelUserId: String(msg.chat.id),
            text: msg.text,
            name: msg.from.first_name,
            meta: { updateId: u.update_id },
          };
          try {
            await tg.sendChatAction(msg.chat.id);
            const out = await engine.handle(inbound);
            await tg.sendMessage(msg.chat.id, out.text);
          } catch (e) {
            console.error("Telegram-Verarbeitung fehlgeschlagen:", (e as Error).message);
          }
        }
      } catch (e) {
        // Never crash the process — back off and retry.
        console.error("Telegram-Poll-Fehler:", (e as Error).message);
        await sleep(backoff);
        backoff = Math.min(backoff * 2, 30_000);
      }
    }
  })();

  return () => {
    running = false;
  };
}
