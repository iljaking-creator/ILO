/**
 * Generate the 5 social-media clips defined in `clips.ts` and write a
 * manifest the website reads (`web/clips.json`).
 *
 * Usage:
 *   HF_CREDENTIALS="KEY_ID:KEY_SECRET" npm run generate
 *
 * Each clip runs text-to-image, then animates the keyframe to a video.
 * The script is resilient: if one clip fails (e.g. nsfw / credits), it is
 * recorded with its error and the rest continue.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { HiggsfieldConnector } from "./client.js";
import { CLIPS, type ClipSpec } from "./clips.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, "../web/clips.json");

interface ClipResult extends ClipSpec {
  status: "completed" | "failed";
  imageUrl?: string;
  videoUrl?: string;
  error?: string;
}

async function generateOne(
  hf: HiggsfieldConnector,
  spec: ClipSpec,
): Promise<ClipResult> {
  try {
    console.error(`[${spec.id}] generating keyframe…`);
    const image = await hf.generateImage({
      prompt: spec.imagePrompt,
      aspect_ratio: spec.aspectRatio,
    });
    const imageUrl = image.imageUrls[0];
    if (!imageUrl) throw new Error("no image returned");

    console.error(`[${spec.id}] animating clip…`);
    const video = await hf.generateVideo({
      prompt: spec.motionPrompt,
      images: imageUrl,
    });

    console.error(`[${spec.id}] done`);
    return {
      ...spec,
      status: "completed",
      imageUrl,
      videoUrl: video.videoUrl,
    };
  } catch (err) {
    const message = (err as Error).message;
    console.error(`[${spec.id}] FAILED: ${message}`);
    return { ...spec, status: "failed", error: message };
  }
}

async function main() {
  const hf = new HiggsfieldConnector();

  // Sequential keeps things simple and avoids hammering rate limits / credits.
  const results: ClipResult[] = [];
  for (const spec of CLIPS) {
    results.push(await generateOne(hf, spec));
  }

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(
    OUTPUT,
    JSON.stringify({ generatedAt: new Date().toISOString(), clips: results }, null, 2),
  );

  const ok = results.filter((r) => r.status === "completed").length;
  console.error(`\nWrote ${OUTPUT}`);
  console.error(`${ok}/${results.length} clips generated successfully.`);
  if (ok < results.length) {
    console.error("Some clips failed — check credentials / Higgsfield credits.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
