/**
 * Retriever factory + the in-memory seed retriever used in demo / anthropic-only
 * mode. The Supabase-backed lexical/hybrid retriever is added in db/repo.ts and
 * selected here when a database is configured.
 */
import { getConfig } from "../config.js";
import { SEED_FAQ } from "../core/persona.js";
import type { KbChunk, RetrievedChunk } from "../types.js";
import { lexicalRank } from "./lexical.js";
import type { Retriever } from "./types.js";

/** Lexical retriever over an in-memory chunk list (seed FAQ by default). */
export class SeedRetriever implements Retriever {
  constructor(private readonly chunks: KbChunk[] = SEED_FAQ) {}

  async retrieve(query: string, topK: number): Promise<RetrievedChunk[]> {
    return lexicalRank(query, this.chunks, topK);
  }
}

/**
 * Build the retriever appropriate for the current mode. A DB-backed retriever
 * can be injected (M3); otherwise we fall back to the seed FAQ so demos and the
 * anthropic-only test run still return grounded answers.
 */
export function buildRetriever(dbRetriever?: Retriever): Retriever {
  const { capabilities } = getConfig();
  if (capabilities.supabase && dbRetriever) return dbRetriever;
  return new SeedRetriever();
}
