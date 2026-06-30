/**
 * Thin wrapper over the official Anthropic SDK.
 *
 * - Streams text deltas via an `onText` callback (used by the web SSE channel).
 * - Returns content blocks + tool uses so the engine can run the tool loop.
 * - Uses adaptive thinking + effort:"medium"; never sends temperature/top_p/
 *   budget_tokens (all 400 on Opus 4.8).
 */
import Anthropic from "@anthropic-ai/sdk";

import { getConfig } from "../config.js";
import { AnthropicError } from "../errors.js";

export interface ToolUse {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface RunResult {
  text: string;
  /** Raw assistant content blocks, appended back to the message history. */
  rawContent: unknown[];
  toolUses: ToolUse[];
  stopReason: string | null;
  model: string;
  usage?: { inputTokens: number; outputTokens: number };
}

export interface RunParams {
  system: string;
  /** Anthropic message params (role + content blocks). */
  messages: Anthropic.MessageParam[];
  tools?: Anthropic.Tool[];
  /** Use the cheaper model for this call. */
  cheap?: boolean;
  /** Streamed text deltas. */
  onText?: (delta: string) => void;
}

export class ClaudeClient {
  private readonly client: Anthropic;
  private readonly model: string;
  private readonly cheapModel: string;

  constructor() {
    const { env, capabilities } = getConfig();
    if (!capabilities.anthropic) {
      throw new AnthropicError("ANTHROPIC_API_KEY is not configured");
    }
    this.client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    this.model = env.ANTHROPIC_MODEL;
    this.cheapModel = env.ANTHROPIC_MODEL_CHEAP;
  }

  async run(params: RunParams): Promise<RunResult> {
    const model = params.cheap ? this.cheapModel : this.model;
    // `thinking`/`output_config` are current API fields that some SDK type
    // versions don't yet expose — pass them through without fighting the types.
    const requestParams = {
      model,
      max_tokens: 1024,
      system: [
        { type: "text", text: params.system, cache_control: { type: "ephemeral" } },
      ],
      messages: params.messages,
      tools: params.tools,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
    } as unknown as Anthropic.MessageStreamParams;

    try {
      const stream = this.client.messages.stream(requestParams);
      if (params.onText) {
        stream.on("text", (delta: string) => params.onText!(delta));
      }
      const final = await stream.finalMessage();

      let text = "";
      const toolUses: ToolUse[] = [];
      for (const block of final.content) {
        if (block.type === "text") text += block.text;
        else if (block.type === "tool_use") {
          toolUses.push({
            id: block.id,
            name: block.name,
            input: (block.input ?? {}) as Record<string, unknown>,
          });
        }
      }

      return {
        text,
        rawContent: final.content,
        toolUses,
        stopReason: final.stop_reason,
        model: final.model,
        usage: final.usage
          ? { inputTokens: final.usage.input_tokens, outputTokens: final.usage.output_tokens }
          : undefined,
      };
    } catch (err) {
      const status =
        err instanceof Anthropic.APIError ? err.status : undefined;
      throw new AnthropicError(
        err instanceof Error ? err.message : "Unknown Anthropic error",
        status,
      );
    }
  }
}
