#!/usr/bin/env python3
"""Build a labeled contact sheet from image files for quick visual QC."""
import sys, os, math
from PIL import Image, ImageDraw, ImageFont

def make(paths, out, cols=6, cell=220, label=True):
    imgs = []
    for p in paths:
        if not os.path.exists(p):
            continue
        try:
            im = Image.open(p).convert("RGBA")
        except Exception:
            continue
        im.thumbnail((cell - 20, cell - 40), Image.LANCZOS)
        imgs.append((im, os.path.basename(p)))
    if not imgs:
        print("no images"); return
    rows = math.ceil(len(imgs) / cols)
    W, H = cols * cell, rows * cell
    sheet = Image.new("RGB", (W, H), (24, 20, 40))
    d = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
    except Exception:
        font = ImageFont.load_default()
    for i, (im, name) in enumerate(imgs):
        r, c = divmod(i, cols)
        x, y = c * cell, r * cell
        sheet.paste(im, (x + 10, y + 10), im if im.mode == "RGBA" else None)
        if label:
            d.text((x + 10, y + cell - 26), name[:28], fill=(230, 225, 255), font=font)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    sheet.save(out, quality=88)
    print("saved", out, sheet.size, f"{len(imgs)} imgs")

if __name__ == "__main__":
    out = sys.argv[1]
    args = sys.argv[2:]
    make(args, out)
