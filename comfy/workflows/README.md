# ComfyUI workflows for FQ-44 Fury b-roll

Point this board at your local ComfyUI (`COMFYUI_URL=http://127.0.0.1:8188`).

## Recommended setup (RTX 4080)

- **Wan 2.1 1.3B** or **LTX-Video** for 5–8s 16:9 clips
- Keep generations short; cut before geometry drift
- Reuse one approved Fury still for clip 03 (I2V)

## Drop in your workflow

1. Build / open your preferred T2V or I2V graph in ComfyUI.
2. Title the prompt nodes **Positive Prompt** and **Negative Prompt** (or include those words).
3. File → **Save (API Format)** into this folder, e.g. `wan-t2v.api.json`.
4. In the board, select that workflow before queuing a clip.

The board injects:

- full positive prompt (clip prompt + visual system suffix)
- negative prompt
- seed / width / height / frame length when those inputs exist
- optional source image name for `LoadImage` nodes (clip 03)

`starter-t2v.api.json` is a placeholder so the injector has a graph to mutate — replace the checkpoint name and swap SaveImage for your video combine / save node before real runs.
