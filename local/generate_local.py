#!/usr/bin/env python3
"""
Open-source clip generator — a self-hosted, credit-free Higgsfield replacement.

Uses **Wan 2.2** (Alibaba, Apache-2.0) via Hugging Face `diffusers` to generate
the 5 clips defined in ../storyboard.json. Produces vertical 9:16 MP4s into
../web/clips/ and updates ../web/clips.json so the website plays them.

Requires a CUDA GPU (the TI2V-5B model runs in ~24 GB VRAM, less with
offloading). It will NOT run on a CPU-only machine.

Usage:
    # validate setup without a GPU / without downloading the model:
    python generate_local.py --dry-run

    # real generation (on a GPU box):
    pip install -r requirements.txt
    python generate_local.py
    # options: --model, --frames, --fps, --steps, --only <id>, --image-to-video
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STORYBOARD = ROOT / "storyboard.json"
WEB_DIR = ROOT / "web"
CLIPS_DIR = WEB_DIR / "clips"
MANIFEST = WEB_DIR / "clips.json"

DEFAULT_MODEL = "Wan-AI/Wan2.2-TI2V-5B-Diffusers"
NEGATIVE_PROMPT = (
    "blurry, low quality, distorted, deformed, watermark, text, extra limbs, "
    "bad anatomy, jpeg artifacts, flickering"
)


def aspect_to_size(aspect: str) -> tuple[int, int]:
    """Map an aspect ratio string to (height, width). Defaults to 9:16."""
    presets = {
        "9:16": (1280, 704),
        "16:9": (704, 1280),
        "1:1": (960, 960),
    }
    return presets.get(aspect, presets["9:16"])


def load_clips() -> list[dict]:
    data = json.loads(STORYBOARD.read_text(encoding="utf-8"))
    clips = data.get("clips", [])
    if not clips:
        raise SystemExit("storyboard.json contains no clips")
    return clips


def write_manifest(results: list[dict]) -> None:
    WEB_DIR.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(
        json.dumps(
            {"generatedAt": None, "backend": "wan2.2-local", "clips": results},
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )


def plan(clips: list[dict], args) -> list[dict]:
    """Build the per-clip plan and print it. Used by --dry-run and the real run."""
    selected = [c for c in clips if not args.only or c["id"] == args.only]
    if not selected:
        raise SystemExit(f"--only {args.only!r} matched no clip id")
    print(f"Backend     : Wan 2.2 ({args.model})")
    print(f"Mode        : {'image-to-video' if args.image_to_video else 'text-to-video'}")
    print(f"Frames/fps  : {args.frames} @ {args.fps} fps  (~{args.frames / args.fps:.1f}s)")
    print(f"Steps       : {args.steps}")
    print(f"Output dir  : {CLIPS_DIR}")
    print(f"Clips       : {len(selected)}\n")
    for c in selected:
        h, w = aspect_to_size(c.get("aspectRatio", "9:16"))
        print(f"  - {c['id']:<14} {w}x{h}  «{c['title']}»")
    return selected


def build_prompt(clip: dict, image_to_video: bool) -> str:
    """Compose the generation prompt from the storyboard fields."""
    if image_to_video:
        return clip["motionPrompt"]
    # text-to-video: combine the keyframe look with the intended motion.
    return f"{clip['imagePrompt']}. Camera and motion: {clip['motionPrompt']}"


def run(clips: list[dict], args) -> None:
    selected = plan(clips, args)

    # Heavy imports happen only for a real run, so --dry-run works without them.
    import torch  # noqa: WPS433
    from diffusers import AutoencoderKLWan, WanPipeline  # noqa: WPS433
    from diffusers.utils import export_to_video  # noqa: WPS433

    print("\nLoading Wan 2.2 (first run downloads the weights)…")
    vae = AutoencoderKLWan.from_pretrained(
        args.model, subfolder="vae", torch_dtype=torch.float32
    )
    pipe = WanPipeline.from_pretrained(
        args.model, vae=vae, torch_dtype=torch.bfloat16
    )
    if args.offload:
        pipe.enable_model_cpu_offload()
    else:
        pipe.to("cuda")

    CLIPS_DIR.mkdir(parents=True, exist_ok=True)
    results: list[dict] = []

    for clip in clips:
        if args.only and clip["id"] != args.only:
            results.append({**clip, "status": "pending"})
            continue
        h, w = aspect_to_size(clip.get("aspectRatio", "9:16"))
        print(f"\n[{clip['id']}] generating…")
        try:
            frames = pipe(
                prompt=build_prompt(clip, args.image_to_video),
                negative_prompt=NEGATIVE_PROMPT,
                height=h,
                width=w,
                num_frames=args.frames,
                guidance_scale=args.guidance,
                num_inference_steps=args.steps,
            ).frames[0]
            out = CLIPS_DIR / f"{clip['id']}.mp4"
            export_to_video(frames, str(out), fps=args.fps)
            print(f"[{clip['id']}] saved → {out}")
            results.append(
                {
                    **clip,
                    "status": "completed",
                    "videoUrl": f"clips/{clip['id']}.mp4",
                }
            )
        except Exception as exc:  # noqa: BLE001 — record and continue
            print(f"[{clip['id']}] FAILED: {exc}", file=sys.stderr)
            results.append({**clip, "status": "failed", "error": str(exc)})

    write_manifest(results)
    ok = sum(1 for r in results if r["status"] == "completed")
    print(f"\nWrote {MANIFEST}")
    print(f"{ok}/{len(results)} clips generated.")


def parse_args(argv: list[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generate clips with Wan 2.2 (open source).")
    p.add_argument("--model", default=DEFAULT_MODEL, help="Hugging Face model id")
    p.add_argument("--frames", type=int, default=81, help="number of frames")
    p.add_argument("--fps", type=int, default=16, help="output frames per second")
    p.add_argument("--steps", type=int, default=40, help="inference steps")
    p.add_argument("--guidance", type=float, default=5.0, help="guidance scale")
    p.add_argument("--only", help="generate just one clip id")
    p.add_argument(
        "--image-to-video",
        action="store_true",
        help="use motion prompt only (expects a keyframe workflow)",
    )
    p.add_argument(
        "--offload",
        action="store_true",
        help="enable CPU offload to fit smaller GPUs (slower)",
    )
    p.add_argument(
        "--dry-run",
        action="store_true",
        help="validate storyboard + print the plan without a GPU/model",
    )
    return p.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    clips = load_clips()
    if args.dry_run:
        plan(clips, args)
        print("\n✅ Dry run OK — storyboard valid, plan above. "
              "Run without --dry-run on a CUDA GPU to generate.")
        return 0
    run(clips, args)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
