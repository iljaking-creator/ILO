/**
 * Loads the 5-clip storyboard from the canonical `storyboard.json` so that the
 * TypeScript (Higgsfield) and Python (Wan 2.2) pipelines share one source.
 *
 * Each clip is generated in two stages by the Higgsfield pipeline:
 *   1. text-to-image  → a high-quality keyframe
 *   2. image-to-video → animate that keyframe into a short clip
 *
 * The open-source pipeline (local/generate_local.py) reads the same file.
 */
import { readFileSync } from "node:fs";

export interface ClipSpec {
  id: string;
  title: string;
  /** One-line pitch shown on the website. */
  caption: string;
  /** Prompt for the text-to-image keyframe / text-to-video. */
  imagePrompt: string;
  /** Prompt describing the camera move / animation for image-to-video. */
  motionPrompt: string;
  /** Vertical 9:16 is ideal for Reels / TikTok / Shorts. */
  aspectRatio: string;
  /** Suggested caption + hashtags for the post. */
  social: string;
}

const data = JSON.parse(
  readFileSync(new URL("../storyboard.json", import.meta.url), "utf8"),
) as { clips: ClipSpec[] };

export const CLIPS: ClipSpec[] = data.clips;
