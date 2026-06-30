/**
 * Conversation memory helpers: load recent history and trim it to a turn +
 * rough-token budget so prompts stay bounded (cost + context control).
 */
import type { MessageRecord } from "../types.js";

const MAX_TURNS = 12; // last N messages kept
const MAX_CHARS = 8000; // rough proxy for a token budget (~2k tokens)

/** Cheap token estimate (~4 chars/token). Avoids a network round-trip. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Trim history to the most recent messages within both a turn cap and a
 * character budget. Always keeps whole messages (never splits a turn).
 */
export function trimHistory(
  history: MessageRecord[],
  maxTurns = MAX_TURNS,
  maxChars = MAX_CHARS,
): MessageRecord[] {
  const recent = history.slice(-maxTurns);
  const out: MessageRecord[] = [];
  let chars = 0;
  for (let i = recent.length - 1; i >= 0; i--) {
    const m = recent[i]!;
    chars += m.content.length;
    if (chars > maxChars && out.length > 0) break;
    out.unshift(m);
  }
  return out;
}
