# VoiceChat — SVGA / Lottie Animation Guide

This project ships **ready-to-play Lottie animations** in `assets/lottie/` and a
full pipeline for producing **SVGA** files when you want the smaller, GPU-friendly
format used by Hago / Yalla-style apps.

---

## 1. What is already included (works today)

| File | Used for |
|------|----------|
| `assets/lottie/gift_burst.json` | Full-screen gift send effect |
| `assets/lottie/vip_entry.json` | VIP entrance alert |
| `assets/lottie/pk_win.json` | PK battle victory |
| `assets/lottie/pk_lose.json` | PK battle defeat |
| `assets/lottie/luckbox_open.json` | Lucky box / red envelope opening |
| `assets/lottie/loading.json` | Loading spinner |

All six are valid **bodymovin v5.7.4** JSON and play immediately with the
`lottie` Flutter package (already wired in `lib/widgets/svga_player_widget.dart`,
which falls back SVGA → Lottie → nothing so the UI never breaks).

Regenerate them any time:

```bash
python3 tools/gen_lottie.py
```

---

## 2. Why SVGA is not shipped as a binary

`.svga` is a **binary** format (a zlib-compressed protobuf of vector commands).
It cannot be authored as text — it must be **exported from a design tool**.
The correct production path is below.

---

## 3. Producing `.svga` files (production path)

### Option A — Adobe Animate (recommended, matches Hago/Yalla workflow)

1. Design the animation in **Adobe Animate** (vector, 30 fps, 512×512 or 750×1334).
2. Keep the stage background **transparent**.
3. Export as **PNG sequence** (File → Export → Export Image Sequence), 30 fps.
4. Convert the sequence to SVGA:

```bash
# install the official converter (Node)
npm i -g svga-converter

# convert a PNG sequence (frames named 0001.png, 0002.png, ...)
svga-converter ./frames -o gift_burst.svga --fps 30
```

### Option B — After Effects + Bodymovin → SVGA

1. Animate in After Effects, export with **Bodymovin** to Lottie JSON.
2. Convert Lottie → SVGA with the community tool:

```bash
npm i -g lottie2svga
lottie2svga assets/lottie/gift_burst.json -o assets/svga/gift_burst.svga
```

### Option C — SVGA Maker (GUI, no code)

Use the **SVGA Maker** desktop app: import a PNG sequence or a Lottie file,
preview, and export `.svga` directly.

---

## 4. Naming contract

Place finished files in `assets/svga/` using exactly these names so the app
picks them up automatically (the player tries SVGA first, then Lottie):

```
assets/svga/gift_burst.svga
assets/svga/vip_entry.svga
assets/svga/pk_win.svga
assets/svga/pk_lose.svga
assets/svga/luckbox_open.svga
assets/svga/loading.svga
```

`pubspec.yaml` already declares `assets/svga/`, so no code change is needed —
drop the files in and rebuild.

---

## 5. Runtime behaviour

`lib/widgets/svga_player_widget.dart` resolves an animation in this order:

1. `assets/svga/<name>.svga` — if present, played with `svgaplayer_flutter`
2. `assets/lottie/<name>.json` — fallback, played with `lottie`
3. nothing — the widget renders an empty box (never crashes)

This means the app is fully functional **today** with Lottie, and upgrading to
SVGA later is a pure asset drop-in with zero code changes.

---

## 6. Performance notes

- Keep SVGA files **under 200 KB**; strip unused layers before export.
- Use **30 fps** and avoid gradients with >2 stops (they bloat the file).
- For full-screen gift effects, cap the canvas at **750×1334** and let the
  player scale — do not export at device resolution.
- Preload the top 10 gifts at room entry (`SvgaPlayerWidget.preload([...])`).
