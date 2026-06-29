/**
 * Shared types for the Higgsfield connector.
 *
 * Modelled on the public Higgsfield generation API, which follows a
 * submit-then-poll pattern: a generation request returns a `request_id`
 * and a status, and the job is polled until it reaches a terminal state.
 */

/** Lifecycle states a Higgsfield job can be in. */
export type JobStatus =
  | "queued"
  | "in_progress"
  | "completed"
  | "failed"
  /** Rejected by content moderation. Credits are refunded. */
  | "nsfw";

/** Terminal states — once reached, the job will not change further. */
export const TERMINAL_STATUSES: readonly JobStatus[] = [
  "completed",
  "failed",
  "nsfw",
];

export interface ConnectorConfig {
  /**
   * Credentials in `KEY_ID:KEY_SECRET` format.
   * Falls back to the `HF_CREDENTIALS` environment variable.
   */
  credentials?: string;
  /** API base URL. Defaults to `https://platform.higgsfield.ai`. */
  baseUrl?: string;
  /** Per-request timeout in milliseconds. Default: 120_000. */
  timeoutMs?: number;
  /** Interval between status polls in milliseconds. Default: 2_000. */
  pollIntervalMs?: number;
  /** Maximum total time to wait while polling, in milliseconds. Default: 300_000. */
  maxPollMs?: number;
  /** Extra headers merged into every request. */
  headers?: Record<string, string>;
}

/** A reference to an input image, by URL. */
export interface ImageInput {
  type: "image_url";
  image_url: string;
}

export interface TextToImageParams {
  prompt: string;
  /** e.g. `"1:1"`, `"9:16"`, `"16:9"`. */
  aspect_ratio?: string;
  /** Content-moderation strictness. */
  safety_tolerance?: number;
  /** Seed for reproducible output. */
  seed?: number;
  /** Model endpoint override. Defaults to the connector's text-to-image model. */
  model?: string;
}

export interface ImageToVideoParams {
  prompt: string;
  /** Source image(s) to animate. A single URL is accepted and wrapped automatically. */
  images: string | ImageInput[];
  /** Motion model identifier, e.g. `"dop-turbo"`. */
  model?: string;
  /** Optional motion preset ids. */
  motions?: string[];
  seed?: number;
}

/** Optional webhook to receive a callback when a job completes. */
export interface WebhookConfig {
  url: string;
  secret?: string;
}

/** Raw shape returned by the generation/status endpoints. */
export interface JobResponse {
  request_id: string;
  status: JobStatus;
  images?: Array<{ url: string }>;
  video?: { url: string };
  /** Present on failures. */
  error?: string;
  [key: string]: unknown;
}

/** A normalised, fully-resolved job result. */
export interface JobResult {
  requestId: string;
  status: JobStatus;
  /** URLs of generated images, if any. */
  imageUrls: string[];
  /** URL of the generated video, if any. */
  videoUrl?: string;
  raw: JobResponse;
}
