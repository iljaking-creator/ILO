/**
 * Server middleware: a per-key token-bucket rate limiter and a Zod body
 * validator. Both keep the public surface safe without external deps.
 */
import type { Context, Next } from "hono";
import type { z } from "zod";

import { getConfig } from "../config.js";

interface Bucket {
  tokens: number;
  updatedAt: number;
}

const buckets = new Map<string, Bucket>();

/** Token-bucket rate limit keyed by client IP. Returns 429 when exhausted. */
export function rateLimit() {
  const perMin = getConfig().env.RATE_LIMIT_PER_MIN;
  const refillPerMs = perMin / 60_000;

  return async (c: Context, next: Next) => {
    const key =
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
      c.req.header("x-real-ip") ||
      "local";
    const now = Date.now();
    const b = buckets.get(key) ?? { tokens: perMin, updatedAt: now };
    b.tokens = Math.min(perMin, b.tokens + (now - b.updatedAt) * refillPerMs);
    b.updatedAt = now;

    if (b.tokens < 1) {
      buckets.set(key, b);
      const retryAfter = Math.ceil((1 - b.tokens) / refillPerMs / 1000);
      c.header("Retry-After", String(retryAfter));
      return c.json({ error: "rate_limited" }, 429);
    }
    b.tokens -= 1;
    buckets.set(key, b);
    await next();
  };
}

/** Reset rate-limit state (tests). */
export function resetRateLimit(): void {
  buckets.clear();
}

/** Parse + validate a JSON body against a Zod schema, throwing a 400 on failure. */
export async function readJson<T>(c: Context, schema: z.ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await c.req.json();
  } catch {
    throw new ValidationFailure("invalid JSON body");
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationFailure(parsed.error.issues.map((i) => i.message).join("; "));
  }
  return parsed.data;
}

export class ValidationFailure extends Error {}
