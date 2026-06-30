/**
 * Error hierarchy for the K&I Kundenwerke platform.
 *
 * Mirrors the style of the Higgsfield connector's errors (src/errors.ts) but is
 * scoped to the multi-channel chatbot platform so the two products stay separate.
 */

/** Base error for all platform failures. */
export class PlatformError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlatformError";
  }
}

/** Misconfiguration (missing/invalid env). Surfaced at boot, never leaks secrets. */
export class ConfigError extends PlatformError {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

/** Failure talking to the Anthropic API. */
export class AnthropicError extends PlatformError {
  readonly status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "AnthropicError";
    this.status = status;
  }
}

/** Database / persistence failure. */
export class DbError extends PlatformError {
  constructor(message: string) {
    super(message);
    this.name = "DbError";
  }
}

/** Channel adapter failure (web, telegram, email, …). */
export class ChannelError extends PlatformError {
  readonly channel: string;
  constructor(channel: string, message: string) {
    super(`[${channel}] ${message}`);
    this.name = "ChannelError";
    this.channel = channel;
  }
}

/** Knowledge-base / retrieval failure (non-fatal — caller degrades gracefully). */
export class KbError extends PlatformError {
  constructor(message: string) {
    super(message);
    this.name = "KbError";
  }
}

/** Request validation failure (bad payload). Maps to HTTP 400. */
export class ValidationError extends PlatformError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/** Rate limit exceeded. Maps to HTTP 429. */
export class RateLimitError extends PlatformError {
  readonly retryAfterMs: number;
  constructor(retryAfterMs: number) {
    super(`Rate limit exceeded. Retry after ${Math.ceil(retryAfterMs / 1000)}s.`);
    this.name = "RateLimitError";
    this.retryAfterMs = retryAfterMs;
  }
}
