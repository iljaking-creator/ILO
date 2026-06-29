/**
 * Minimal usage example.
 *
 * Run with: HF_CREDENTIALS="KEY_ID:KEY_SECRET" npm run example
 */
import { HiggsfieldConnector } from "./index.js";

async function main() {
  const hf = new HiggsfieldConnector();

  // 1) Text-to-image
  const image = await hf.generateImage({
    prompt: "a serene mountain lake at sunrise, cinematic lighting",
    aspect_ratio: "16:9",
  });
  console.log("Image URLs:", image.imageUrls);

  // 2) Image-to-video (animate the first generated image)
  if (image.imageUrls[0]) {
    const video = await hf.generateVideo({
      prompt: "slow cinematic dolly-in over the lake",
      images: image.imageUrls[0],
    });
    console.log("Video URL:", video.videoUrl);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
