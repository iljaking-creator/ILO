/**
 * Tool definitions exposed to Claude. Tools are the ONLY way the model can
 * cause external effects (capturing a lead, requesting a human) — this keeps
 * the security boundary explicit. Schemas double as runtime validation.
 */
import { z } from "zod";

import type { Lead } from "../types.js";

export const captureLeadSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  interest: z.string().optional(),
  notes: z.string().optional(),
});

export const requestHandoffSchema = z.object({
  reason: z.string(),
});

export const generateImageSchema = z.object({
  prompt: z.string().min(3),
  aspect_ratio: z.string().optional(),
});

/** JSON-schema tool definitions for the Anthropic Messages API. */
export const TOOL_DEFS = [
  {
    name: "capture_lead",
    description:
      "Erfasse die Kontaktdaten einer interessierten Person (Name, E-Mail, " +
      "Telefon, Interesse), wenn sie ein Angebot, einen Rückruf oder eine " +
      "Beratung möchte. Mindestens E-Mail oder Telefon angeben.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Name der Person" },
        email: { type: "string", description: "E-Mail-Adresse" },
        phone: { type: "string", description: "Telefonnummer" },
        interest: { type: "string", description: "Woran ist die Person interessiert?" },
        notes: { type: "string", description: "Zusätzliche Notizen" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "request_human_handoff",
    description:
      "Übergib das Gespräch an einen menschlichen Mitarbeiter, wenn die Anfrage " +
      "menschliche Hilfe braucht (Beschwerde, Vertrag, komplexer Fall) oder die " +
      "Person ausdrücklich einen Menschen sprechen möchte.",
    input_schema: {
      type: "object" as const,
      properties: {
        reason: { type: "string", description: "Kurzer Grund für die Übergabe" },
      },
      required: ["reason"],
      additionalProperties: false,
    },
  },
] as const;

/** Optional media tool — only advertised when Higgsfield is configured. */
export const MEDIA_TOOL_DEF = {
  name: "generate_image",
  description:
    "Erzeuge ein Vorschaubild aus einer kurzen Bildbeschreibung (z. B. für eine " +
    "Idee, ein Mockup oder Social-Media-Visual). Nur nutzen, wenn die Person " +
    "ausdrücklich ein Bild möchte.",
  input_schema: {
    type: "object" as const,
    properties: {
      prompt: { type: "string", description: "Bildbeschreibung" },
      aspect_ratio: { type: "string", description: 'z. B. "16:9", "1:1", "9:16"' },
    },
    required: ["prompt"],
    additionalProperties: false,
  },
} as const;

export function parseLead(input: unknown): Lead {
  return captureLeadSchema.parse(input);
}

export function parseHandoff(input: unknown): { reason: string } {
  return requestHandoffSchema.parse(input);
}

export function parseGenerateImage(input: unknown): { prompt: string; aspect_ratio?: string } {
  return generateImageSchema.parse(input);
}
