import assert from "node:assert/strict";
import { test } from "node:test";

import { resetConfig } from "../config.js";
import { AgentEngine } from "../core/engine.js";
import { InMemoryRepo } from "../db/repo.js";
import { SeedRetriever } from "../kb/retrieve.js";

test("engine answers in demo mode, grounds in KB, and persists the turn", async () => {
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.SUPABASE_URL;
  resetConfig();

  const repo = new InMemoryRepo();
  const engine = new AgentEngine(repo, new SeedRetriever());

  const deltas: string[] = [];
  const out = await engine.handle(
    { channel: "web", channelUserId: "u1", text: "Welche Leistungen bietet ihr?" },
    { onText: (d) => deltas.push(d) },
  );

  assert.ok(out.conversationId);
  assert.match(out.text, /Demo-Modus/);
  assert.ok(out.citations.length > 0, "expected at least one citation");
  assert.equal(out.handoff, false);
  assert.ok(deltas.join("").length > 0, "expected streamed text");

  // user + assistant message persisted
  const msgs = await repo.listRecentMessages(out.conversationId, 10);
  assert.equal(msgs.length, 2);
  assert.equal(msgs[0]!.role, "user");
  assert.equal(msgs[1]!.role, "assistant");

  resetConfig();
});

test("engine continues the same conversation when given its id", async () => {
  delete process.env.ANTHROPIC_API_KEY;
  resetConfig();
  const repo = new InMemoryRepo();
  const engine = new AgentEngine(repo, new SeedRetriever());

  const first = await engine.handle({ channel: "web", channelUserId: "u2", text: "Hallo" });
  const second = await engine.handle({
    channel: "web",
    channelUserId: "u2",
    text: "Und Datenschutz?",
    conversationId: first.conversationId,
  });
  assert.equal(second.conversationId, first.conversationId);
  const msgs = await repo.listRecentMessages(first.conversationId, 10);
  assert.equal(msgs.length, 4);
  resetConfig();
});

test("engine rejects an empty message", async () => {
  delete process.env.ANTHROPIC_API_KEY;
  resetConfig();
  const engine = new AgentEngine(new InMemoryRepo(), new SeedRetriever());
  await assert.rejects(() => engine.handle({ channel: "web", channelUserId: "u3", text: "  " }));
  resetConfig();
});
