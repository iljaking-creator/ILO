# Open-source clips with Wan 2.2 (Higgsfield replacement)

This generates the same 5 clips as the Higgsfield pipeline, but with a
**free, self-hosted, Apache-2.0** model — no per-clip credits.

- **Model:** [Wan 2.2](https://github.com/Wan-Video/Wan2.2) (Alibaba) — Apache-2.0,
  top of the open-weight video leaderboards.
- **Needs a CUDA GPU.** The 5B model fits ~24 GB VRAM (less with `--offload`).
  It will **not** run on a CPU-only machine (incl. this cloud sandbox — that's
  why the clips can't be rendered here).

## Option A — your own GPU (Linux/WSL with an NVIDIA card)

```bash
cd local
python3 -m venv .venv && source .venv/bin/activate

# PyTorch for your CUDA version (example: CUDA 12.4)
pip install torch --index-url https://download.pytorch.org/whl/cu124
pip install -r requirements.txt

# sanity check (no GPU/model needed)
python generate_local.py --dry-run

# generate all 5 clips → ../web/clips/*.mp4 and updates ../web/clips.json
python generate_local.py

# smaller GPU? trade speed for memory:
python generate_local.py --offload
```

Then preview:

```bash
cd ..
npm run serve   # http://localhost:5173 — the gallery now plays the MP4s
```

## Option B — a rented cloud GPU (no hardware needed, a few cents)

Any provider with an RTX 4090 / A10 / L4 works (e.g. RunPod, Vast.ai,
Lambda, Modal). Rough cost: an RTX 4090 is ~$0.30–0.70/hour and all 5 clips
take well under an hour.

1. Start a GPU instance with a recent PyTorch/CUDA image.
2. Clone this repo, then run Option A's commands on the instance.
3. Download `web/clips/*.mp4` (and `web/clips.json`) back to your machine.

## Useful flags

| Flag                 | Effect                                                |
| -------------------- | ----------------------------------------------------- |
| `--dry-run`          | Validate storyboard + print plan, no GPU/model needed |
| `--only iron-paw`    | Generate a single clip by id                          |
| `--frames 121`       | Longer clip (default 81 ≈ 5 s at 16 fps)              |
| `--fps 24`           | Smoother playback                                     |
| `--steps 50`         | Higher quality (slower)                               |
| `--offload`          | CPU offload for GPUs with less VRAM                   |
| `--model <hf_id>`    | Swap model (e.g. a Wan 2.2 14B variant)               |

## Quality note

Wan 2.2 produces short, stylized clips (a few seconds) at genuinely high
quality — but **not** feature-film animation (Kung Fu Panda / kaiju films are
studio CGI). For the best results, keep prompts concrete and let it render
5–8 second shots, then cut them together in any video editor.

## Editing the clips

All 5 concepts live in [`../storyboard.json`](../storyboard.json). Change the
prompts/titles there and both the Higgsfield and Wan pipelines pick them up.
