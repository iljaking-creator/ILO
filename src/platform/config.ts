/**
 * Environment configuration + graceful-degradation hub.
 *
 * The platform never crashes on missing optional credentials — instead it
 * computes an operating `mode` and reports per-capability status. Only truly
 * malformed values throw `ConfigError`. Secrets are never logged.
 */
import { z } from "zod";

import { ConfigError } from "./errors.js";
import type { Mode } from "./types.js";

const EnvSchema = z.object({
  // LLM
  ANTHROPIC_API_KEY: z.string().default(""),
  ANTHROPIC_MODEL: z.string().default("claude-opus-4-8"),
  ANTHROPIC_MODEL_CHEAP: z.string().default("claude-sonnet-4-6"),

  // Data
  SUPABASE_URL: z.string().default(""),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default(""),

  // Knowledge base
  COMPANY_SITE_URL: z.string().default(""),
  VOYAGE_API_KEY: z.string().default(""),

  // Channels
  TELEGRAM_BOT_TOKEN: z.string().default(""),
  IMAP_HOST: z.string().default(""),
  IMAP_PORT: z.coerce.number().int().positive().default(993),
  IMAP_USER: z.string().default(""),
  IMAP_PASSWORD: z.string().default(""),
  SMTP_HOST: z.string().default(""),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().default(""),
  SMTP_PASSWORD: z.string().default(""),
  SMTP_FROM: z.string().default(""),

  // Server
  PORT: z.coerce.number().int().positive().default(8787),
  WEB_ALLOWED_ORIGINS: z.string().default("*"),
  RATE_LIMIT_PER_MIN: z.coerce.number().int().positive().default(20),
  DATA_RETENTION_DAYS: z.coerce.number().int().positive().default(90),
});

export type Env = z.infer<typeof EnvSchema>;

export interface Capabilities {
  anthropic: boolean;
  supabase: boolean;
  embeddings: boolean;
  telegram: boolean;
  email: boolean;
  kbSite: boolean;
}

export interface Config {
  env: Env;
  mode: Mode;
  capabilities: Capabilities;
  allowedOrigins: string[];
}

let cached: Config | null = null;

/** Load, validate, and memoise configuration. */
export function getConfig(): Config {
  if (cached) return cached;

  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // Report which keys are malformed — without echoing their values.
    const keys = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new ConfigError(`Invalid environment configuration for: ${keys}`);
  }
  const env = parsed.data;

  const capabilities: Capabilities = {
    anthropic: env.ANTHROPIC_API_KEY.length > 0,
    supabase: env.SUPABASE_URL.length > 0 && env.SUPABASE_SERVICE_ROLE_KEY.length > 0,
    embeddings: env.VOYAGE_API_KEY.length > 0,
    telegram: env.TELEGRAM_BOT_TOKEN.length > 0,
    email:
      env.IMAP_HOST.length > 0 &&
      env.IMAP_USER.length > 0 &&
      env.SMTP_HOST.length > 0,
    kbSite: env.COMPANY_SITE_URL.length > 0,
  };

  const mode: Mode = !capabilities.anthropic
    ? "demo"
    : capabilities.supabase
      ? "live"
      : "anthropic-only";

  const allowedOrigins = env.WEB_ALLOWED_ORIGINS.split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  cached = { env, mode, capabilities, allowedOrigins };
  return cached;
}

/** Reset memoised config (tests only). */
export function resetConfig(): void {
  cached = null;
}

/** Compact, secret-free summary for /api/health and boot logs. */
export function describeConfig(c: Config = getConfig()) {
  return {
    mode: c.mode,
    capabilities: c.capabilities,
    model: c.env.ANTHROPIC_MODEL,
    port: c.env.PORT,
  };
}
