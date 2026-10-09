#!/usr/bin/env python3
"""
VoiceChat v6 — derive button states.

From each *_normal.png button plate, derive:
  *_pressed.png   -> slightly darker + inset (scale down a touch, inner shadow)
  *_disabled.png  -> desaturated + dimmed + flat

This guarantees pixel-perfect consistency across the three states of every
button (same shape, same margins, same size) — which is exactly what the
"each button in 3 states" requirement needs.

Usage: python3 tools/derive_button_states.py
"""
import os, glob
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BTN = os.path.join(ROOT, "assets", "buttons")


def _alpha(im):
    return np.asarray(im.split()[3]).astype(np.float32) / 255.0


def make_pressed(im: Image.Image) -> Image.Image:
    """Darker, slightly inset, with a soft inner shadow at the top."""
    im = im.convert("RGBA")
    arr = np.asarray(im).astype(np.float32)
    rgb, a = arr[..., :3], arr[..., 3:]

    # darken
    rgb = rgb * 0.80

    # inner shadow: darken the top edge inside the shape
    alpha = a[..., 0] / 255.0
    h = alpha.shape[0]
    grad = np.linspace(1.0, 0.0, h)[:, None] ** 2      # strong at top
    inner = grad * alpha
    rgb = rgb * (1 - 0.35 * inner[..., None])

    out = np.dstack([rgb, a]).clip(0, 255).astype(np.uint8)
    res = Image.fromarray(out, "RGBA")

    # slight scale-down to read as "pressed"
    w, h2 = res.size
    s = 0.96
    small = res.resize((int(w * s), int(h2 * s)), Image.LANCZOS)
    canvas = Image.new("RGBA", (w, h2), (0, 0, 0, 0))
    canvas.alpha_composite(small, ((w - small.width) // 2, (h2 - small.height) // 2))
    return canvas


def make_disabled(im: Image.Image) -> Image.Image:
    """Desaturated, dimmed, flat."""
    im = im.convert("RGBA")
    arr = np.asarray(im).astype(np.float32)
    rgb, a = arr[..., :3], arr[..., 3:]

    # luminance desaturation
    lum = (0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2])[..., None]
    rgb = rgb * 0.25 + lum * 0.75
    # dim
    rgb = rgb * 0.72
    # reduce alpha a bit
    a = a * 0.85

    out = np.dstack([rgb, a]).clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def main():
    normals = sorted(glob.glob(os.path.join(BTN, "*_normal.png")))
    made = 0
    for n in normals:
        base = n[: -len("_normal.png")]
        im = Image.open(n)
        make_pressed(im).save(base + "_pressed.png")
        make_disabled(im).save(base + "_disabled.png")
        made += 1
    print(f"derived states for {made} buttons -> {made*3} files")


if __name__ == "__main__":
    main()
