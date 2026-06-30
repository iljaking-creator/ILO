/**
 * Lexical scoring shared by the in-memory seed retriever and any other
 * lightweight lexical matching. German-aware-ish: lowercases, strips
 * punctuation, and ignores very short stopword-like tokens.
 */
import type { KbChunk, RetrievedChunk } from "../types.js";

const STOP = new Set([
  "der","die","das","und","oder","ein","eine","einen","ist","sind","wie","was",
  "ich","wir","ihr","sie","mit","für","von","zu","den","dem","im","in","auf",
  "the","a","an","and","or","is","are","of","to","for","with","how","what",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

/**
 * Score `chunks` against `query` by overlapping-token frequency (a tiny TF
 * heuristic). Returns the top-k with score > 0, descending.
 */
export function lexicalRank(
  query: string,
  chunks: KbChunk[],
  topK: number,
): RetrievedChunk[] {
  const qTokens = new Set(tokenize(query));
  if (qTokens.size === 0) return [];

  const scored: RetrievedChunk[] = [];
  for (const chunk of chunks) {
    const tokens = tokenize(chunk.content);
    if (tokens.length === 0) continue;
    let hits = 0;
    for (const t of tokens) if (qTokens.has(t)) hits++;
    if (hits === 0) continue;
    // Normalise by chunk length so long chunks don't dominate.
    const score = hits / Math.sqrt(tokens.length);
    scored.push({ ...chunk, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
