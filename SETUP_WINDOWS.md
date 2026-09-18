# Windows setup (next to ComfyUI)

Your empty `Desktop\Fury` folder is **not** the app. `npm install` fails until `package.json` is there.

## 1. Download the zip from Cursor (required)

`fury-board-windows.zip` is an **agent artifact**, not something that auto-appears in Downloads.

1. Open this cloud agent run in Cursor.
2. Find **Artifacts** / the `fury-board-windows.zip` download.
3. Save it somewhere you can find (Downloads is fine).

If the zip is not in Downloads, find it:

```powershell
Get-ChildItem -Path "$env:USERPROFILE\Downloads","$env:USERPROFILE\Desktop","$env:USERPROFILE\Documents" -Filter "fury-board-windows.zip" -Recurse -ErrorAction SilentlyContinue |
  Select-Object FullName, Length, LastWriteTime
```

## 2. Unzip into Desktop\Fury

This zip is **flat**: `package.json` should land directly in `Desktop\Fury` (no nested `fury-board` folder).

```powershell
# ComfyUI should already be running at http://127.0.0.1:8188

$zip = "$env:USERPROFILE\Downloads\fury-board-windows.zip"
# If that path failed, set $zip to the FullName from the search above

Remove-Item -Recurse -Force "$env:USERPROFILE\Desktop\Fury" -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path "$env:USERPROFILE\Desktop\Fury" | Out-Null
Expand-Archive -Path $zip -DestinationPath "$env:USERPROFILE\Desktop\Fury" -Force

cd "$env:USERPROFILE\Desktop\Fury"
Test-Path .\package.json   # must print True
```

## 3. Install and run

```powershell
cd "$env:USERPROFILE\Desktop\Fury"
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321). ComfyUI stays on `:8188`.

## Checklist

| Check | Expected |
| --- | --- |
| Zip downloaded from Cursor artifacts | Yes |
| `Test-Path .\package.json` | `True` |
| ComfyUI | `:8188` |
| Board | `:4321` |

## Workflows

Drop ComfyUI **API format** JSON into `comfy\workflows\`, pick it in the board, queue clips.
