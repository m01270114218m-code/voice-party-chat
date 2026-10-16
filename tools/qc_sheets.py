#!/usr/bin/env python3
"""Build one QC contact sheet per asset category (checkerboard bg to reveal alpha)."""
import os, glob, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")
OUT = "/workspace/qc_v6"
os.makedirs(OUT, exist_ok=True)


def checker(w, h, s=16):
    im = Image.new("RGB", (w, h), (40, 36, 52))
    px = im.load()
    for y in range(h):
        for x in range(w):
            if ((x // s) + (y // s)) % 2 == 0:
                px[x, y] = (54, 48, 70)
    return im


def sheet(cat, cols=8, cell=150):
    files = sorted(glob.glob(os.path.join(ASSETS, cat, "*.png")))
    if not files:
        return None
    rows = (len(files) + cols - 1) // cols
    canvas = checker(cols * cell, rows * cell)
    for i, f in enumerate(files):
        im = Image.open(f).convert("RGBA")
        im.thumbnail((cell - 14, cell - 14), Image.LANCZOS)
        x = (i % cols) * cell + (cell - im.width) // 2
        y = (i // cols) * cell + (cell - im.height) // 2
        canvas.paste(im, (x, y), im)
    out = os.path.join(OUT, f"cat_{cat}.jpg")
    canvas.convert("RGB").save(out, quality=88)
    return out, len(files)


if __name__ == "__main__":
    cats = sys.argv[1:] or sorted(os.listdir(ASSETS))
    for c in cats:
        if not os.path.isdir(os.path.join(ASSETS, c)):
            continue
        r = sheet(c)
        if r:
            print(f"{c:14s} {r[1]:3d} -> {r[0]}")
