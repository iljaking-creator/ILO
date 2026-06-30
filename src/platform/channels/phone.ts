/**
 * Phone / Voice AI channel — PHASE 2 SCAFFOLD (not wired).
 *
 * Reference design (Twilio Voice):
 *  - Inbound call → Twilio webhook returns TwiML <Gather input="speech"> .
 *  - Twilio speech-to-text (or a streaming STT) → text → engine.handle().
 *  - Reply text → TTS (Twilio <Say> or a neural TTS) back to the caller.
 *  - Multi-turn via <Gather> loops; barge-in + timeouts tuned for latency.
 *
 * Requires a Twilio account, a purchased phone number, public HTTPS hosting,
 * and latency-optimised streaming — none available yet, so this is a stub.
 */
import { ChannelError } from "../errors.js";

export async function startPhone(): Promise<() => void> {
  throw new ChannelError(
    "phone",
    "Phase 2: benötigt Twilio Voice + Telefonnummer + STT/TTS + öffentliches HTTPS.",
  );
}
