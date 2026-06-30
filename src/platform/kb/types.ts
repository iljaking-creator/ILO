/**
 * Knowledge-base interfaces. The engine depends only on `Retriever`, so the
 * backend (in-memory seed, Postgres FTS, or hybrid pgvector) is swappable.
 */
import type { RetrievedChunk } from "../types.js";

export interface Retriever {
  /** Return up to `topK` relevant chunks for the query (best-effort, never throws fatally). */
  retrieve(query: string, topK: number): Promise<RetrievedChunk[]>;
}

/** Optional embedding provider. Null implementation means lexical-only retrieval. */
export interface Embedder {
  /** Embedding dimensionality (must match the pgvector column). */
  readonly dim: number;
  embed(texts: string[]): Promise<number[][]>;
}

export interface CrawlResult {
  url: string;
  title: string;
  text: string;
}

export interface Chunk {
  sourceUrl: string;
  index: number;
  content: string;
}
