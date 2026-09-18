# Clip Board (any topic → ComfyUI)

Shot-list + prompt board for **any** video project. Edit look, beats, and prompts; queue to local ComfyUI on your GPU.

FQ-44 Fury is one **template**, not the whole app.

## What you get

- **Projects** — blank, product, narrative, social (9:16), or Fury sample
- **Editable visual system** — palette, camera, continuity, style suffix, negatives
- **Editable shot list** — add/delete clips, change source / batch / mode
- **ComfyUI queue** — injects prompts into API-format workflows at `http://127.0.0.1:8188`
- **Export / import** — JSON projects saved in the browser (`localStorage`)

## Run next to ComfyUI (Windows)

1. Download `fury-board-windows.zip` from this agent’s **Files → Artifacts** (or clone the repo).
2. PowerShell:

```powershell
Expand-Archive -Path "$env:USERPROFILE\Downloads\fury-board-windows.zip" -DestinationPath "$env:USERPROFILE\Desktop\Fury" -Force
cd "$env:USERPROFILE\Desktop\Fury"
Test-Path .\package.json   # True
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321). ComfyUI stays on `:8188`.

See [SETUP_WINDOWS.md](./SETUP_WINDOWS.md).

## Make it your topic

1. **New project** → pick Blank / Product / Narrative / Social (or Fury sample).
2. **Edit look** → set palette, camera, subject continuity, style suffix.
3. Edit each clip’s beat, concept, and prompt (or **Add clip**).
4. Drop your Wan/LTX/I2V API workflow into `comfy/workflows/`, select it, **Queue**.

## Specs defaults

Templates ship with 16:9 @ 24 fps (social template is 9:16 @ 30). Override per clip as needed.
