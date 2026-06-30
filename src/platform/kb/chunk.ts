/**
 * Split a document into ~500-token overlapping chunks (~2000 chars, ~200 char
 * overlap), keeping the source URL on each chunk for citations.
 */
import type { Chunk, CrawlResult } from "./types.js";

const CHUNK_CHARS = 2000;
const OVERLAP_CHARS = 200;

export function chunkDocument(doc: CrawlResult): Chunk[] {
  const text = doc.text.replace(/\s+/g, " ").trim();
  if (!text) return [];
  const chunks: Chunk[] = [];
  let start = 0;
  let index = 0;
  while (start < text.length) {
    let end = Math.min(start + CHUNK_CHARS, text.length);
    // Prefer to break on a sentence/space boundary near the end.
    if (end < text.length) {
      const slice = text.slice(start, end);
      const lastBreak = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf(" "));
      if (lastBreak > CHUNK_CHARS * 0.5) end = start + lastBreak + 1;
    }
    chunks.push({ sourceUrl: doc.url, index: index++, content: text.slice(start, end).trim() });
    if (end >= text.length) break;
    start = end - OVERLAP_CHARS;
  }
  return chunks;
}
