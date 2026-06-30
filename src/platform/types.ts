/**
 * Shared domain types for the platform. Channel-agnostic by design: every
 * adapter normalises its provider payload to `InboundMessage` and renders an
 * `OutboundMessage` back.
 */

export type Channel = "web" | "telegram" | "email" | "whatsapp" | "phone";

export type Role = "user" | "assistant";

/** Normalised inbound message handed to the engine. */
export interface InboundMessage {
  channel: Channel;
  /** Stable per-channel user identifier (chat id, email address, session id). */
  channelUserId: string;
  /** Free-text user input. */
  text: string;
  /** Optional existing conversation id (web widget passes this back). */
  conversationId?: string;
  /** Optional contact email (email channel, or captured leads). */
  email?: string;
  /** Optional display name. */
  name?: string;
  /** Channel-specific extras (telegram update id, email message-id, …). */
  meta?: Record<string, unknown>;
}

/** Normalised outbound reply produced by the engine. */
export interface OutboundMessage {
  conversationId: string;
  text: string;
  /** Source URLs backing the answer, if any. */
  citations: string[];
  /** True when the engine requested a human handoff this turn. */
  handoff: boolean;
  model?: string;
}

export interface Contact {
  id: string;
  channel: Channel;
  channelUserId: string;
  email?: string;
  name?: string;
  consentAt?: string;
}

export type ConversationStatus = "open" | "handed_off" | "closed";

export interface Conversation {
  id: string;
  contactId: string;
  channel: Channel;
  status: ConversationStatus;
}

export interface MessageRecord {
  role: Role;
  content: string;
  tokens?: number;
  model?: string;
  meta?: Record<string, unknown>;
}

/** A retrievable knowledge-base chunk. */
export interface KbChunk {
  id: string;
  content: string;
  sourceUrl: string;
}

/** A chunk returned from retrieval, with a relevance score. */
export interface RetrievedChunk extends KbChunk {
  score: number;
}

export interface Lead {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  notes?: string;
}

export interface Handoff {
  reason: string;
}

export type ToolName = "capture_lead" | "request_human_handoff" | "book_appointment";

/** Operating mode computed from the environment (see config.ts). */
export type Mode = "demo" | "anthropic-only" | "live";
