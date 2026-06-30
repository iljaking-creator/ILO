/**
 * Minimal same-origin website crawler for KB ingestion. Native fetch, BFS with
 * depth/page caps. SSRF-hardened: only http/https, same origin, and private /
 * loopback / link-local hosts are refused.
 */
import { KbError } from "../errors.js";
import type { CrawlResult } from "./types.js";

const MAX_PAGES = 40;
const MAX_DEPTH = 3;

function isBlockedHost(host: string): boolean {
  if (host === "localhost" || host.endsWith(".local")) return true;
  // IPv4 private / loopback / link-local ranges.
  if (/^127\./.test(host)) return true;
  if (/^10\./.test(host)) return true;
  if (/^192\.168\./.test(host)) return true;
  if (/^169\.254\./.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return true;
  if (host === "0.0.0.0" || host === "::1") return true;
  return false;
}

function htmlToText(html: string): { title: string; text: string } {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1]!.trim() : "";
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { title, text };
}

function extractLinks(html: string, base: URL): string[] {
  const out: string[] = [];
  const re = /href\s*=\s*["']([^"'#]+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      const u = new URL(m[1]!, base);
      if (u.origin === base.origin) {
        u.hash = "";
        out.push(u.toString());
      }
    } catch {
      /* ignore malformed */
    }
  }
  return out;
}

export async function crawlSite(
  startUrl: string,
  opts: { maxPages?: number; maxDepth?: number } = {},
): Promise<CrawlResult[]> {
  const start = new URL(startUrl);
  if (start.protocol !== "http:" && start.protocol !== "https:") {
    throw new KbError(`Unsupported protocol: ${start.protocol}`);
  }
  if (isBlockedHost(start.hostname)) {
    throw new KbError(`Refusing to crawl internal host: ${start.hostname}`);
  }

  const maxPages = opts.maxPages ?? MAX_PAGES;
  const maxDepth = opts.maxDepth ?? MAX_DEPTH;
  const seen = new Set<string>([start.toString()]);
  const queue: Array<{ url: string; depth: number }> = [{ url: start.toString(), depth: 0 }];
  const results: CrawlResult[] = [];

  while (queue.length > 0 && results.length < maxPages) {
    const { url, depth } = queue.shift()!;
    try {
      const res = await fetch(url, { headers: { "user-agent": "ILO-Kundenwerke-KB/0.1" } });
      const ctype = res.headers.get("content-type") ?? "";
      if (!res.ok || !ctype.includes("text/html")) continue;
      const html = await res.text();
      const { title, text } = htmlToText(html);
      if (text.length > 200) results.push({ url, title, text });

      if (depth < maxDepth) {
        for (const link of extractLinks(html, start)) {
          if (!seen.has(link) && seen.size < maxPages * 4) {
            seen.add(link);
            queue.push({ url: link, depth: depth + 1 });
          }
        }
      }
    } catch {
      // Skip unreachable pages; crawling is best-effort.
    }
  }
  return results;
}
