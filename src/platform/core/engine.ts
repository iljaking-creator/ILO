/**
 * AgentEngine — the channel-agnostic core.
 *
 * Flow: load history → retrieve KB → build system prompt → call Claude with
 * tools → run the tool loop → persist everything. In demo mode (no API key) it
 * short-circuits to a deterministic, grounded reply so the UI is demonstrable.
 */
import type Anthropic from "@anthropic-ai/sdk";

import { getConfig } from "../config.js";
import { ChannelError } from "../errors.js";
import type { InboundMessage, OutboundMessage, RetrievedChunk } from "../types.js";
import type { Repo } from "../db/repo.js";
import type { Retriever } from "../kb/types.js";
import { ClaudeClient } from "./claude.js";
import { trimHistory } from "./memory.js";
import { buildSystemPrompt } from "./prompt.js";
import { COMPANY_NAME } from "./persona.js";
import { TOOL_DEFS, parseHandoff, parseLead } from "./tools.js";

const TOP_K = 5;
const HISTORY_LIMIT = 20;
const MAX_TOOL_STEPS = 4;

export interface HandleOptions {
  /** Stream assistant text deltas (web SSE). */
  onText?: (delta: string) => void;
}

export class AgentEngine {
  private claude?: ClaudeClient;

  constructor(
    private readonly repo: Repo,
    private readonly retriever: Retriever,
  ) {
    if (getConfig().capabilities.anthropic) this.claude = new ClaudeClient();
  }

  async handle(inbound: InboundMessage, opts: HandleOptions = {}): Promise<OutboundMessage> {
    if (!inbound.text.trim()) {
      throw new ChannelError(inbound.channel, "empty message");
    }

    const contact = await this.repo.upsertContact({
      channel: inbound.channel,
      channelUserId: inbound.channelUserId,
      email: inbound.email,
      name: inbound.name,
      // Web/Telegram/Email users implicitly consent by initiating contact; the
      // widget shows the notice. Persisted for the audit trail.
      consent: true,
    });
    const conversation = await this.repo.getOrCreateConversation(
      contact.id,
      inbound.channel,
      inbound.conversationId,
    );
    await this.repo.writeAudit("inbound", inbound.channel, {
      conversationId: conversation.id,
      length: inbound.text.length,
    });

    const kb = await this.safeRetrieve(inbound.text);
    const history = await this.repo.listRecentMessages(conversation.id, HISTORY_LIMIT);
    const citations = [...new Set(kb.map((c) => c.sourceUrl))];

    await this.repo.appendMessage(conversation.id, {
      role: "user",
      content: inbound.text,
    });

    // Demo mode: deterministic, grounded reply (no API key required).
    if (!this.claude) {
      const text = demoReply(inbound.text, kb);
      if (opts.onText) opts.onText(text);
      await this.repo.appendMessage(conversation.id, {
        role: "assistant",
        content: text,
        model: "demo",
      });
      return { conversationId: conversation.id, text, citations, handoff: false };
    }

    const system = buildSystemPrompt(kb, inbound.channel);
    const messages: Anthropic.MessageParam[] = [
      ...trimHistory(history).map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: inbound.text },
    ];

    let handoff = false;
    let finalText = "";
    let model: string | undefined;

    for (let step = 0; step < MAX_TOOL_STEPS; step++) {
      const result = await this.claude.run({
        system,
        messages,
        tools: TOOL_DEFS as unknown as Anthropic.Tool[],
        onText: opts.onText,
      });
      finalText = result.text;
      model = result.model;
      messages.push({ role: "assistant", content: result.rawContent as Anthropic.ContentBlockParam[] });

      if (result.toolUses.length === 0) break;

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const tu of result.toolUses) {
        const out = await this.runTool(tu.name, tu.input, conversation.id, contact.id);
        if (out.handoff) handoff = true;
        toolResults.push({ type: "tool_result", tool_use_id: tu.id, content: out.message });
      }
      messages.push({ role: "user", content: toolResults });
    }

    if (!finalText) {
      finalText = handoff
        ? "Ich habe deine Anfrage an einen Mitarbeiter weitergeleitet — wir melden uns zeitnah."
        : "Entschuldige, dazu kann ich gerade nichts Sicheres sagen. Soll ich dich mit einem Mitarbeiter verbinden?";
      if (opts.onText) opts.onText(finalText);
    }

    await this.repo.appendMessage(conversation.id, {
      role: "assistant",
      content: finalText,
      model,
      meta: { handoff, citations },
    });

    return { conversationId: conversation.id, text: finalText, citations, handoff, model };
  }

  private async runTool(
    name: string,
    input: Record<string, unknown>,
    conversationId: string,
    contactId: string,
  ): Promise<{ message: string; handoff: boolean }> {
    try {
      if (name === "capture_lead") {
        const lead = parseLead(input);
        await this.repo.insertLead(conversationId, contactId, lead);
        if (lead.email || lead.name) {
          await this.repo.upsertContact({
            channel: "web",
            channelUserId: contactId,
            email: lead.email,
            name: lead.name,
          });
        }
        await this.repo.writeAudit("lead_captured", "assistant", { conversationId });
        return { message: "Kontaktdaten erfolgreich gespeichert.", handoff: false };
      }
      if (name === "request_human_handoff") {
        const { reason } = parseHandoff(input);
        await this.repo.insertHandoff(conversationId, contactId, { reason });
        await this.repo.writeAudit("handoff", "assistant", { conversationId, reason });
        return { message: "Ein Mitarbeiter wurde informiert und meldet sich zeitnah.", handoff: true };
      }
      return { message: `Unbekanntes Tool: ${name}`, handoff: false };
    } catch (err) {
      return {
        message: `Tool-Fehler: ${(err as Error).message}`,
        handoff: false,
      };
    }
  }

  private async safeRetrieve(query: string): Promise<RetrievedChunk[]> {
    try {
      return await this.retriever.retrieve(query, TOP_K);
    } catch {
      return []; // KB failures are non-fatal — answer from persona/history.
    }
  }
}

/** Deterministic reply for demo mode (no Anthropic key). */
function demoReply(userText: string, kb: RetrievedChunk[]): string {
  const banner =
    `[Demo-Modus von ${COMPANY_NAME} – ohne ANTHROPIC_API_KEY; ` +
    "Antwort aus der lokalen Wissensbasis] ";
  if (kb.length > 0) {
    return banner + kb[0]!.content;
  }
  return (
    banner +
    "Dazu finde ich gerade keinen passenden Eintrag. Gerne nehme ich deine " +
    "Kontaktdaten auf, damit sich ein Mitarbeiter meldet."
  );
}
