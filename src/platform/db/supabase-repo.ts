/**
 * Supabase-backed persistence + retrieval (live mode).
 *
 * The backend uses the **service-role key** and is the only writer — that is the
 * security boundary. RLS is enabled on every table (default-deny); the browser
 * never holds DB credentials and talks only to our API.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getConfig } from "../config.js";
import { DbError } from "../errors.js";
import type {
  Channel,
  Contact,
  Conversation,
  Handoff,
  Lead,
  MessageRecord,
  RetrievedChunk,
} from "../types.js";
import type { Repo } from "./repo.js";
import type { Retriever } from "../kb/types.js";

export class SupabaseRepo implements Repo, Retriever {
  private readonly db: SupabaseClient;

  constructor() {
    const { env } = getConfig();
    this.db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }

  private fail(op: string, error: { message: string } | null): never {
    throw new DbError(`${op}: ${error?.message ?? "unknown error"}`);
  }

  async upsertContact(input: {
    channel: Channel;
    channelUserId: string;
    email?: string;
    name?: string;
    consent?: boolean;
  }): Promise<Contact> {
    const row: Record<string, unknown> = {
      channel: input.channel,
      channel_user_id: input.channelUserId,
    };
    if (input.email) row.email = input.email;
    if (input.name) row.name = input.name;
    if (input.consent) row.consent_at = new Date().toISOString();

    const { data, error } = await this.db
      .from("contacts")
      .upsert(row, { onConflict: "channel,channel_user_id", ignoreDuplicates: false })
      .select()
      .single();
    if (error || !data) this.fail("upsertContact", error);
    return {
      id: data.id,
      channel: data.channel,
      channelUserId: data.channel_user_id,
      email: data.email ?? undefined,
      name: data.name ?? undefined,
      consentAt: data.consent_at ?? undefined,
    };
  }

  async getOrCreateConversation(
    contactId: string,
    channel: Channel,
    conversationId?: string,
  ): Promise<Conversation> {
    if (conversationId) {
      const { data } = await this.db
        .from("conversations")
        .select()
        .eq("id", conversationId)
        .eq("contact_id", contactId)
        .maybeSingle();
      if (data) {
        await this.db
          .from("conversations")
          .update({ last_activity_at: new Date().toISOString() })
          .eq("id", conversationId);
        return { id: data.id, contactId: data.contact_id, channel: data.channel, status: data.status };
      }
    }
    const { data, error } = await this.db
      .from("conversations")
      .insert({ contact_id: contactId, channel, status: "open" })
      .select()
      .single();
    if (error || !data) this.fail("getOrCreateConversation", error);
    return { id: data.id, contactId: data.contact_id, channel: data.channel, status: data.status };
  }

  async listRecentMessages(conversationId: string, limit: number): Promise<MessageRecord[]> {
    const { data, error } = await this.db
      .from("messages")
      .select("role, content, tokens, model, meta")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) this.fail("listRecentMessages", error);
    return (data ?? [])
      .reverse()
      .map((m) => ({ role: m.role, content: m.content, tokens: m.tokens ?? undefined, model: m.model ?? undefined, meta: m.meta ?? undefined }));
  }

  async appendMessage(conversationId: string, msg: MessageRecord): Promise<void> {
    const { error } = await this.db.from("messages").insert({
      conversation_id: conversationId,
      role: msg.role,
      content: msg.content,
      tokens: msg.tokens ?? null,
      model: msg.model ?? null,
      meta: msg.meta ?? {},
    });
    if (error) this.fail("appendMessage", error);
  }

  async insertLead(conversationId: string, contactId: string, lead: Lead): Promise<void> {
    const { error } = await this.db.from("leads").insert({
      conversation_id: conversationId,
      contact_id: contactId,
      name: lead.name ?? null,
      email: lead.email ?? null,
      phone: lead.phone ?? null,
      interest: lead.interest ?? null,
      notes: lead.notes ?? null,
    });
    if (error) this.fail("insertLead", error);
  }

  async insertHandoff(conversationId: string, contactId: string, handoff: Handoff): Promise<void> {
    const { error } = await this.db.from("handoffs").insert({
      conversation_id: conversationId,
      contact_id: contactId,
      reason: handoff.reason,
      status: "open",
    });
    if (error) this.fail("insertHandoff", error);
    await this.db.from("conversations").update({ status: "handed_off" }).eq("id", conversationId);
  }

  async writeAudit(event: string, actor: string, detail: Record<string, unknown>): Promise<void> {
    // Audit failures must not break the request — log and continue.
    const { error } = await this.db.from("audit_log").insert({ event, actor, detail });
    if (error) console.error("audit insert failed:", error.message);
  }

  async deleteContactData(contactId: string): Promise<void> {
    // ON DELETE CASCADE on FKs removes conversations/messages/leads/handoffs.
    const { error } = await this.db.from("contacts").delete().eq("id", contactId);
    if (error) this.fail("deleteContactData", error);
  }

  async purgeExpired(days: number): Promise<number> {
    const cutoff = new Date(Date.now() - days * 86_400_000).toISOString();
    const { data, error } = await this.db
      .from("conversations")
      .delete()
      .lt("last_activity_at", cutoff)
      .select("id");
    if (error) this.fail("purgeExpired", error);
    return data?.length ?? 0;
  }

  // --- Retriever ---------------------------------------------------------

  async retrieve(query: string, topK: number): Promise<RetrievedChunk[]> {
    // kb_search RPC (defined in schema.sql) ranks by German FTS; extend to
    // hybrid pgvector when embeddings are present (M3).
    const { data, error } = await this.db.rpc("kb_search", { q: query, match_count: topK });
    if (error) {
      console.error("kb_search failed:", error.message);
      return [];
    }
    return (data ?? []).map((r: { id: string; content: string; source_url: string; score: number }) => ({
      id: r.id,
      content: r.content,
      sourceUrl: r.source_url,
      score: r.score,
    }));
  }
}
