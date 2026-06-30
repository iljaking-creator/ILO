/**
 * Embedding providers. Anthropic has no embeddings endpoint, so semantic search
 * is optional: NullEmbedder = lexical-only (default), VoyageEmbedder = Voyage AI
 * (`voyage-3`, 1024-dim, Anthropic's recommended partner) behind VOYAGE_API_KEY.
 */
import { getConfig } from "../config.js";
import { KbError } from "../errors.js";
import type { Embedder } from "./types.js";

/** No-op embedder — signals lexical-only retrieval. */
export class NullEmbedder implements Embedder {
  readonly dim = 1024;
  async embed(): Promise<number[][]> {
    return [];
  }
}

export class VoyageEmbedder implements Embedder {
  readonly dim = 1024;
  constructor(private readonly apiKey: string, private readonly model = "voyage-3") {}

  async embed(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];
    const res = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ input: texts, model: this.model, output_dimension: this.dim }),
    });
    if (!res.ok) {
      throw new KbError(`Voyage embeddings failed: ${res.status} ${await res.text()}`);
    }
    const json = (await res.json()) as { data: Array<{ embedding: number[] }> };
    return json.data.map((d) => d.embedding);
  }
}

/** Pick the embedder for the current config. */
export function buildEmbedder(): Embedder {
  const { env, capabilities } = getConfig();
  return capabilities.embeddings ? new VoyageEmbedder(env.VOYAGE_API_KEY) : new NullEmbedder();
}
