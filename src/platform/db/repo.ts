/**
 * Persistence layer.
 *
 * `Repo` is the interface the engine depends on. `InMemoryRepo` backs demo /
 * anthropic-only mode (no database); `SupabaseRepo` (db/supabase-repo.ts) backs
 * live mode. Keeping this an interface means the engine is storage-agnostic and
 * unit-testable without a database.
 */
import { randomUUID } from "node:crypto";

import type {
  Channel,
  Contact,
  Conversation,
  Handoff,
  Lead,
  MessageRecord,
} from "../types.js";

export interface Repo {
  upsertContact(input: {
    channel: Channel;
    channelUserId: string;
    email?: string;
    name?: string;
    consent?: boolean;
  }): Promise<Contact>;

  getOrCreateConversation(
    contactId: string,
    channel: Channel,
    conversationId?: string,
  ): Promise<Conversation>;

  listRecentMessages(conversationId: string, limit: number): Promise<MessageRecord[]>;

  appendMessage(conversationId: string, msg: MessageRecord): Promise<void>;

  insertLead(conversationId: string, contactId: string, lead: Lead): Promise<void>;

  insertHandoff(
    conversationId: string,
    contactId: string,
    handoff: Handoff,
  ): Promise<void>;

  writeAudit(
    event: string,
    actor: string,
    detail: Record<string, unknown>,
  ): Promise<void>;

  /** GDPR right-to-erasure: delete a contact and all linked data. */
  deleteContactData(contactId: string): Promise<void>;

  /** Delete data older than `days`. Returns number of conversations removed. */
  purgeExpired(days: number): Promise<number>;
}

interface StoredConversation extends Conversation {
  lastActivityAt: number;
  messages: MessageRecord[];
}

/** Process-local store. Data is lost on restart — fine for demos and tests. */
export class InMemoryRepo implements Repo {
  private contacts = new Map<string, Contact>();
  private byKey = new Map<string, string>(); // `${channel}:${channelUserId}` -> contactId
  private conversations = new Map<string, StoredConversation>();
  private leads: Array<{ conversationId: string; contactId: string; lead: Lead }> = [];
  private handoffs: Array<{ conversationId: string; contactId: string; reason: string }> = [];
  private audit: Array<{ at: number; event: string; actor: string; detail: unknown }> = [];

  async upsertContact(input: {
    channel: Channel;
    channelUserId: string;
    email?: string;
    name?: string;
    consent?: boolean;
  }): Promise<Contact> {
    const key = `${input.channel}:${input.channelUserId}`;
    const existingId = this.byKey.get(key);
    if (existingId) {
      const c = this.contacts.get(existingId)!;
      if (input.email) c.email = input.email;
      if (input.name) c.name = input.name;
      if (input.consent && !c.consentAt) c.consentAt = new Date().toISOString();
      return c;
    }
    const contact: Contact = {
      id: randomUUID(),
      channel: input.channel,
      channelUserId: input.channelUserId,
      email: input.email,
      name: input.name,
      consentAt: input.consent ? new Date().toISOString() : undefined,
    };
    this.contacts.set(contact.id, contact);
    this.byKey.set(key, contact.id);
    return contact;
  }

  async getOrCreateConversation(
    contactId: string,
    channel: Channel,
    conversationId?: string,
  ): Promise<Conversation> {
    if (conversationId) {
      const existing = this.conversations.get(conversationId);
      if (existing && existing.contactId === contactId) {
        existing.lastActivityAt = Date.now();
        return existing;
      }
    }
    const conv: StoredConversation = {
      id: conversationId && !this.conversations.has(conversationId) ? conversationId : randomUUID(),
      contactId,
      channel,
      status: "open",
      lastActivityAt: Date.now(),
      messages: [],
    };
    this.conversations.set(conv.id, conv);
    return conv;
  }

  async listRecentMessages(conversationId: string, limit: number): Promise<MessageRecord[]> {
    const conv = this.conversations.get(conversationId);
    if (!conv) return [];
    return conv.messages.slice(-limit);
  }

  async appendMessage(conversationId: string, msg: MessageRecord): Promise<void> {
    const conv = this.conversations.get(conversationId);
    if (!conv) return;
    conv.messages.push(msg);
    conv.lastActivityAt = Date.now();
  }

  async insertLead(conversationId: string, contactId: string, lead: Lead): Promise<void> {
    this.leads.push({ conversationId, contactId, lead });
  }

  async insertHandoff(
    conversationId: string,
    contactId: string,
    handoff: Handoff,
  ): Promise<void> {
    this.handoffs.push({ conversationId, contactId, reason: handoff.reason });
    const conv = this.conversations.get(conversationId);
    if (conv) conv.status = "handed_off";
  }

  async writeAudit(
    event: string,
    actor: string,
    detail: Record<string, unknown>,
  ): Promise<void> {
    this.audit.push({ at: Date.now(), event, actor, detail });
  }

  async deleteContactData(contactId: string): Promise<void> {
    for (const [key, id] of this.byKey) if (id === contactId) this.byKey.delete(key);
    this.contacts.delete(contactId);
    for (const [id, conv] of this.conversations) {
      if (conv.contactId === contactId) this.conversations.delete(id);
    }
    this.leads = this.leads.filter((l) => l.contactId !== contactId);
    this.handoffs = this.handoffs.filter((h) => h.contactId !== contactId);
  }

  async purgeExpired(days: number): Promise<number> {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    let removed = 0;
    for (const [id, conv] of this.conversations) {
      if (conv.lastActivityAt < cutoff) {
        this.conversations.delete(id);
        removed++;
      }
    }
    return removed;
  }
}
