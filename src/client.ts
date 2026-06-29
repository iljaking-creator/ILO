import {
  HiggsfieldApiError,
  HiggsfieldAuthError,
  HiggsfieldJobError,
  HiggsfieldTimeoutError,
} from "./errors.js";
import {
  TERMINAL_STATUSES,
  type ConnectorConfig,
  type ImageInput,
  type ImageToVideoParams,
  type JobResponse,
  type JobResult,
  type TextToImageParams,
  type WebhookConfig,
} from "./types.js";

const DEFAULT_BASE_URL = "https://platform.higgsfield.ai";
const DEFAULT_TIMEOUT_MS = 120_000;
const DEFAULT_POLL_INTERVAL_MS = 2_000;
const DEFAULT_MAX_POLL_MS = 300_000;

/** Default model endpoints. */
const TEXT_TO_IMAGE_ENDPOINT = "flux-pro/kontext/max/text-to-image";
const IMAGE_TO_VIDEO_ENDPOINT = "v1/image2video/dop";
const IMAGE_TO_VIDEO_MODEL = "dop-turbo";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Connector for the Higgsfield AI generation API.
 *
 * Handles authentication, request submission, and polling so callers can
 * generate images and videos with a single awaited call.
 *
 * @example
 * ```ts
 * const hf = new HiggsfieldConnector();
 * const result = await hf.generateImage({ prompt: "a neon city at dusk" });
 * console.log(result.imageUrls);
 * ```
 */
export class HiggsfieldConnector {
  private readonly credentials: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly pollIntervalMs: number;
  private readonly maxPollMs: number;
  private readonly extraHeaders: Record<string, string>;

  constructor(config: ConnectorConfig = {}) {
    const credentials = config.credentials ?? process.env.HF_CREDENTIALS;
    if (!credentials) {
      throw new HiggsfieldAuthError(
        "Missing Higgsfield credentials. Pass `credentials` (KEY_ID:KEY_SECRET) " +
          "or set the HF_CREDENTIALS environment variable.",
      );
    }
    if (!credentials.includes(":")) {
      throw new HiggsfieldAuthError(
        'Invalid credentials format. Expected "KEY_ID:KEY_SECRET".',
      );
    }

    this.credentials = credentials;
    this.baseUrl = (config.baseUrl ?? process.env.HIGGSFIELD_BASE_URL ?? DEFAULT_BASE_URL).replace(
      /\/$/,
      "",
    );
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.pollIntervalMs = config.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
    this.maxPollMs = config.maxPollMs ?? DEFAULT_MAX_POLL_MS;
    this.extraHeaders = config.headers ?? {};
  }

  // --- High-level API ----------------------------------------------------

  /**
   * Generate one or more images from a text prompt and wait for completion.
   */
  async generateImage(params: TextToImageParams): Promise<JobResult> {
    const { model, ...input } = params;
    const job = await this.submit(model ?? TEXT_TO_IMAGE_ENDPOINT, input);
    return this.waitForCompletion(job.request_id);
  }

  /**
   * Animate a source image into a video and wait for completion.
   */
  async generateVideo(params: ImageToVideoParams): Promise<JobResult> {
    const { model, images, motions, ...rest } = params;
    const input: Record<string, unknown> = {
      ...rest,
      model: model ?? IMAGE_TO_VIDEO_MODEL,
      input_images: normalizeImages(images),
    };
    if (motions?.length) input.motions = motions;

    const job = await this.submit(IMAGE_TO_VIDEO_ENDPOINT, input);
    return this.waitForCompletion(job.request_id);
  }

  // --- Low-level API -----------------------------------------------------

  /**
   * Submit a generation request without waiting. Returns the raw job
   * response containing the `request_id` to poll.
   */
  async submit(
    endpoint: string,
    input: Record<string, unknown>,
    webhook?: WebhookConfig,
  ): Promise<JobResponse> {
    const body: Record<string, unknown> = { input };
    if (webhook) body.webhook = webhook;

    return this.request<JobResponse>("POST", `/${stripSlashes(endpoint)}`, body);
  }

  /** Fetch the current status of a job. */
  async getStatus(requestId: string): Promise<JobResult> {
    const raw = await this.request<JobResponse>(
      "GET",
      `/v1/generations/${encodeURIComponent(requestId)}`,
    );
    return normalizeResult(raw);
  }

  /**
   * Poll a job until it reaches a terminal state.
   *
   * @throws {HiggsfieldJobError} if the job fails or is rejected (nsfw).
   * @throws {HiggsfieldTimeoutError} if `maxPollMs` is exceeded.
   */
  async waitForCompletion(requestId: string): Promise<JobResult> {
    const deadline = Date.now() + this.maxPollMs;

    for (;;) {
      const result = await this.getStatus(requestId);

      if (TERMINAL_STATUSES.includes(result.status)) {
        if (result.status !== "completed") {
          throw new HiggsfieldJobError(result);
        }
        return result;
      }

      if (Date.now() >= deadline) {
        throw new HiggsfieldTimeoutError(requestId, this.maxPollMs);
      }
      await sleep(this.pollIntervalMs);
    }
  }

  // --- Internals ---------------------------------------------------------

  private async request<T>(
    method: "GET" | "POST",
    path: string,
    body?: unknown,
  ): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Key ${this.credentials}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          ...this.extraHeaders,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });

      const text = await res.text();
      if (!res.ok) {
        throw new HiggsfieldApiError(res.status, text);
      }
      return (text ? JSON.parse(text) : {}) as T;
    } finally {
      clearTimeout(timer);
    }
  }
}

// --- helpers -------------------------------------------------------------

function stripSlashes(s: string): string {
  return s.replace(/^\/+|\/+$/g, "");
}

function normalizeImages(images: string | ImageInput[]): ImageInput[] {
  if (typeof images === "string") {
    return [{ type: "image_url", image_url: images }];
  }
  return images;
}

function normalizeResult(raw: JobResponse): JobResult {
  return {
    requestId: raw.request_id,
    status: raw.status,
    imageUrls: (raw.images ?? []).map((i) => i.url),
    videoUrl: raw.video?.url,
    raw,
  };
}
