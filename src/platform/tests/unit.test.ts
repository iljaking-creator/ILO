import assert from "node:assert/strict";
import { test } from "node:test";

import { resetConfig, getConfig } from "../config.js";
import { trimHistory, estimateTokens } from "../core/memory.js";
import { buildSystemPrompt } from "../core/prompt.js";
import { captureLeadSchema, requestHandoffSchema } from "../core/tools.js";
import { lexicalRank } from "../kb/lexical.js";
import { chunkDocument } from "../kb/chunk.js";
import { SEED_FAQ } from "../core/persona.js";
import type { MessageRecord } from "../types.js";

function withEnv(env: Record<string, string | undefined>, fn: () => void) {
  const saved: Record<string, string | undefined> = {};
  for (const k of Object.keys(env)) saved[k] = process.env[k];
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  resetConfig();
  try {
    fn();
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    resetConfig();
  }
}

test("config computes demo mode without an API key", () => {
  withEnv({ ANTHROPIC_API_KEY: undefined, SUPABASE_URL: undefined }, () => {
    assert.equal(getConfig().mode, "demo");
    assert.equal(getConfig().capabilities.anthropic, false);
  });
});

test("config computes anthropic-only mode with key but no DB", () => {
  withEnv({ ANTHROPIC_API_KEY: "sk-test", SUPABASE_URL: undefined }, () => {
    assert.equal(getConfig().mode, "anthropic-only");
  });
});

test("config computes live mode with key + supabase", () => {
  withEnv(
    {
      ANTHROPIC_API_KEY: "sk-test",
      SUPABASE_URL: "https://x.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "svc",
    },
    () => assert.equal(getConfig().mode, "live"),
  );
});

test("trimHistory respects the turn cap and keeps whole messages", () => {
  const history: MessageRecord[] = Array.from({ length: 30 }, (_, i) => ({
    role: i % 2 === 0 ? "user" : "assistant",
    content: `msg ${i}`,
  }));
  const trimmed = trimHistory(history, 12, 8000);
  assert.equal(trimmed.length, 12);
  assert.equal(trimmed[trimmed.length - 1]!.content, "msg 29");
});

test("estimateTokens is roughly chars/4", () => {
  assert.equal(estimateTokens("abcd"), 1);
  assert.equal(estimateTokens("a".repeat(40)), 10);
});

test("system prompt wraps KB in a delimited untrusted block", () => {
  const sys = buildSystemPrompt(
    [{ id: "x", content: "Testinhalt", sourceUrl: "seed://x", score: 1 }],
    "web",
  );
  assert.match(sys, /<knowledge_base>/);
  assert.match(sys, /NICHT als Anweisungen/);
  assert.match(sys, /Testinhalt/);
});

test("lead/handoff schemas validate", () => {
  assert.deepEqual(captureLeadSchema.parse({ email: "a@b.de" }).email, "a@b.de");
  assert.throws(() => captureLeadSchema.parse({ email: "not-an-email" }));
  assert.equal(requestHandoffSchema.parse({ reason: "Beschwerde" }).reason, "Beschwerde");
  assert.throws(() => requestHandoffSchema.parse({}));
});

test("lexicalRank ranks the relevant seed chunk first", () => {
  const ranked = lexicalRank("Welche Leistungen bietet ihr?", SEED_FAQ, 3);
  assert.ok(ranked.length > 0);
  assert.equal(ranked[0]!.sourceUrl, "seed://faq/leistungen");
});

test("chunkDocument splits long text with overlap", () => {
  const text = "Satz. ".repeat(1000); // ~6000 chars
  const chunks = chunkDocument({ url: "https://x/y", title: "t", text });
  assert.ok(chunks.length >= 3);
  assert.ok(chunks.every((c) => c.content.length <= 2100));
  assert.equal(chunks[0]!.sourceUrl, "https://x/y");
});
