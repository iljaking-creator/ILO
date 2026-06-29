#!/usr/bin/env node
/**
 * Higgsfield MCP server.
 *
 * Exposes the Higgsfield connector as Model Context Protocol tools so that
 * Claude (Desktop / Code) can generate images and videos directly.
 *
 * Credentials are read from the HF_CREDENTIALS environment variable
 * (format: KEY_ID:KEY_SECRET), which the MCP client passes through.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { HiggsfieldConnector } from "./client.js";
import { HiggsfieldError } from "./errors.js";
import type { JobResult } from "./types.js";

function getConnector(): HiggsfieldConnector {
  // Constructed lazily so the server can start (and list tools) even before
  // credentials are configured; the error surfaces only when a tool is called.
  return new HiggsfieldConnector();
}

function formatResult(result: JobResult): string {
  const lines: string[] = [
    `status: ${result.status}`,
    `request_id: ${result.requestId}`,
  ];
  if (result.imageUrls.length) {
    lines.push(`images:\n${result.imageUrls.map((u) => `  - ${u}`).join("\n")}`);
  }
  if (result.videoUrl) lines.push(`video: ${result.videoUrl}`);
  return lines.join("\n");
}

function toToolResult(text: string, isError = false) {
  return { content: [{ type: "text" as const, text }], isError };
}

async function run<T>(fn: () => Promise<JobResult>) {
  try {
    return toToolResult(formatResult(await fn()));
  } catch (err) {
    const msg =
      err instanceof HiggsfieldError
        ? err.message
        : `Unexpected error: ${(err as Error).message}`;
    return toToolResult(msg, true);
  }
}

const server = new McpServer({
  name: "higgsfield",
  version: "0.1.0",
});

server.registerTool(
  "higgsfield_generate_image",
  {
    title: "Generate an image (Higgsfield)",
    description:
      "Generate an image from a text prompt using Higgsfield (text-to-image). " +
      "Returns the status and the URL(s) of the generated image.",
    inputSchema: {
      prompt: z.string().describe("Text description of the desired image."),
      aspect_ratio: z
        .string()
        .optional()
        .describe('Aspect ratio, e.g. "1:1", "16:9", "9:16".'),
      seed: z.number().int().optional().describe("Seed for reproducible output."),
    },
  },
  async ({ prompt, aspect_ratio, seed }) =>
    run(() =>
      getConnector().generateImage({ prompt, aspect_ratio, seed }),
    ),
);

server.registerTool(
  "higgsfield_generate_video",
  {
    title: "Generate a video clip (Higgsfield)",
    description:
      "Animate a source image into a short video clip using Higgsfield " +
      "(image-to-video). Provide an image URL plus a prompt describing the motion.",
    inputSchema: {
      prompt: z
        .string()
        .describe("Description of the camera movement / animation."),
      image_url: z.string().url().describe("URL of the source image to animate."),
      seed: z.number().int().optional().describe("Seed for reproducible output."),
    },
  },
  async ({ prompt, image_url, seed }) =>
    run(() =>
      getConnector().generateVideo({ prompt, images: image_url, seed }),
    ),
);

server.registerTool(
  "higgsfield_get_status",
  {
    title: "Check a Higgsfield job",
    description:
      "Fetch the current status and result URLs of a previously submitted " +
      "Higgsfield job by its request_id.",
    inputSchema: {
      request_id: z.string().describe("The request_id returned by a generation."),
    },
  },
  async ({ request_id }) =>
    run(() => getConnector().getStatus(request_id)),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Log to stderr so it doesn't corrupt the stdio JSON-RPC stream.
  console.error("Higgsfield MCP server running on stdio.");
}

main().catch((err) => {
  console.error("Fatal error starting Higgsfield MCP server:", err);
  process.exit(1);
});
