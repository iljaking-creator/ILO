/**
 * Assembles the platform's core objects (repo, retriever, engine) according to
 * the current configuration. One place to wire storage + KB backends.
 */
import { getConfig } from "./config.js";
import { AgentEngine } from "./core/engine.js";
import { InMemoryRepo, type Repo } from "./db/repo.js";
import { buildRetriever } from "./kb/retrieve.js";
import type { Retriever } from "./kb/types.js";

export interface Platform {
  repo: Repo;
  retriever: Retriever;
  engine: AgentEngine;
}

let cached: Platform | null = null;

export async function getPlatform(): Promise<Platform> {
  if (cached) return cached;
  const { capabilities } = getConfig();

  let repo: Repo = new InMemoryRepo();
  let dbRetriever: Retriever | undefined;

  if (capabilities.supabase) {
    // Lazy import so demo / anthropic-only mode never loads the DB layer.
    const { SupabaseRepo } = await import("./db/supabase-repo.js");
    const sb = new SupabaseRepo();
    repo = sb;
    dbRetriever = sb;
  }

  const retriever = buildRetriever(dbRetriever);
  const engine = new AgentEngine(repo, retriever);

  cached = { repo, retriever, engine };
  return cached;
}

export function resetPlatform(): void {
  cached = null;
}
