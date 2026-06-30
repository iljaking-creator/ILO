/**
 * WhatsApp channel — PHASE 2 SCAFFOLD (not wired).
 *
 * Two viable backends:
 *  1. Meta WhatsApp Cloud API — requires a verified Meta Business account, a
 *     phone number id, a permanent token, and a PUBLIC HTTPS webhook with
 *     `hub.verify_token` handshake + `X-Hub-Signature-256` (HMAC-SHA256) check.
 *  2. Twilio WhatsApp — requires a Twilio account + WhatsApp-enabled number;
 *     inbound via Twilio webhook, validated with the X-Twilio-Signature.
 *
 * Both map to the same `InboundMessage`/`OutboundMessage` and call the shared
 * engine — only the transport + signature verification differ. Going live needs
 * accounts the user does not yet have, plus public hosting, so this stays a stub.
 */
import { ChannelError } from "../errors.js";

export async function startWhatsApp(): Promise<() => void> {
  throw new ChannelError(
    "whatsapp",
    "Phase 2: benötigt Meta Cloud API / Twilio + öffentliches HTTPS-Webhook.",
  );
}
