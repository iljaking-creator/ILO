/**
 * MediaService — platform-facing wrapper around the existing HiggsfieldConnector
 * (src/client.ts). Generates images/videos for the website and (optionally) for
 * the chatbot. Degrades cleanly when HF_CREDENTIALS is absent.
 */
import { HiggsfieldConnector } from "../../index.js";
import type { JobResult } from "../../index.js";
import { getConfig } from "../config.js";
import { PlatformError } from "../errors.js";

const TEXT_TO_IMAGE_ENDPOINT = "flux-pro/kontext/max/text-to-image";
const IMAGE_TO_VIDEO_ENDPOINT = "v1/image2video/dop";
const IMAGE_TO_VIDEO_MODEL = "dop-turbo";

export class MediaUnavailableError extends PlatformError {
  constructor() {
    super("Medien-Generierung ist nicht konfiguriert (HF_CREDENTIALS fehlt).");
    this.name = "MediaUnavailableError";
  }
}

export class MediaService {
  private connector?: HiggsfieldConnector;

  constructor() {
    if (getConfig().capabilities.higgsfield) {
      this.connector = new HiggsfieldConnector();
    }
  }

  available(): boolean {
    return this.connector !== undefined;
  }

  private require(): HiggsfieldConnector {
    if (!this.connector) throw new MediaUnavailableError();
    return this.connector;
  }

  /** Text-to-image (waits for completion — image generation is fast). */
  async generateImage(prompt: string, aspectRatio = "16:9"): Promise<JobResult> {
    return this.require().generateImage({ prompt, aspect_ratio: aspectRatio });
  }

  /** Submit an image-to-video job and return the request id to poll. */
  async submitVideo(prompt: string, imageUrl: string): Promise<string> {
    const job = await this.require().submit(IMAGE_TO_VIDEO_ENDPOINT, {
      model: IMAGE_TO_VIDEO_MODEL,
      prompt,
      input_images: [{ type: "image_url", image_url: imageUrl }],
    });
    return job.request_id;
  }

  /** Submit a text-to-image job without waiting (returns request id). */
  async submitImage(prompt: string, aspectRatio = "16:9"): Promise<string> {
    const job = await this.require().submit(TEXT_TO_IMAGE_ENDPOINT, {
      prompt,
      aspect_ratio: aspectRatio,
    });
    return job.request_id;
  }

  async getStatus(requestId: string): Promise<JobResult> {
    return this.require().getStatus(requestId);
  }
}

let cached: MediaService | null = null;
export function getMediaService(): MediaService {
  if (!cached) cached = new MediaService();
  return cached;
}
export function resetMediaService(): void {
  cached = null;
}
