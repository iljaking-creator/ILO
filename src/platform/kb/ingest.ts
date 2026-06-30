/**
 * KB ingestion CLI: crawl COMPANY_SITE_URL → chunk → (optionally) embed →
 * upsert into Supabase. Skips unchanged documents via content_hash.
 *
 * Usage: COMPANY_SITE_URL=https://… SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… npm run ingest
 */
import { createHash } from "node:crypto";

import { createClient } from "@supabase/supabase-js";

import { getConfig } from "../config.js";
import { chunkDocument } from "./chunk.js";
import { crawlSite } from "./crawl.js";
import { buildEmbedder } from "./embed.js";

async function main() {
  const { env, capabilities } = getConfig();

  if (!capabilities.kbSite) {
    console.error("COMPANY_SITE_URL ist nicht gesetzt — nichts zu crawlen.");
    process.exit(1);
  }
  if (!capabilities.supabase) {
    console.error("Supabase nicht konfiguriert — Ingestion benötigt eine Datenbank.");
    process.exit(1);
  }

  const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  const embedder = buildEmbedder();

  console.error(`Crawle ${env.COMPANY_SITE_URL} …`);
  const pages = await crawlSite(env.COMPANY_SITE_URL);
  console.error(`${pages.length} Seite(n) gefunden.`);

  let upserted = 0;
  for (const page of pages) {
    const hash = createHash("sha256").update(page.text).digest("hex");

    const { data: existing } = await db
      .from("kb_documents")
      .select("id, content_hash")
      .eq("source_url", page.url)
      .maybeSingle();

    if (existing?.content_hash === hash) continue; // unchanged

    const { data: doc, error: docErr } = await db
      .from("kb_documents")
      .upsert(
        { source_url: page.url, title: page.title, lang: "de", content_hash: hash, updated_at: new Date().toISOString() },
        { onConflict: "source_url" },
      )
      .select("id")
      .single();
    if (docErr || !doc) {
      console.error(`Dokument-Upsert fehlgeschlagen (${page.url}):`, docErr?.message);
      continue;
    }

    // Replace chunks for this document.
    await db.from("kb_chunks").delete().eq("document_id", doc.id);

    const chunks = chunkDocument(page);
    let embeddings: number[][] = [];
    if (capabilities.embeddings) {
      try {
        embeddings = await embedder.embed(chunks.map((c) => c.content));
      } catch (e) {
        console.error("Embedding fehlgeschlagen, fahre lexikalisch fort:", (e as Error).message);
      }
    }

    const rows = chunks.map((c, i) => ({
      document_id: doc.id,
      chunk_index: c.index,
      content: c.content,
      source_url: c.sourceUrl,
      embedding: embeddings[i] ?? null,
    }));
    if (rows.length > 0) {
      const { error: insErr } = await db.from("kb_chunks").insert(rows);
      if (insErr) console.error(`Chunk-Insert fehlgeschlagen (${page.url}):`, insErr.message);
      else upserted++;
    }
  }

  console.error(`Fertig. ${upserted} Dokument(e) aktualisiert.`);
}

main().catch((err) => {
  console.error("Ingestion-Fehler:", err);
  process.exit(1);
});
