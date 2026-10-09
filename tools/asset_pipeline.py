#!/usr/bin/env python3
"""
VoiceChat v5 asset pipeline.

Turns AI-generated asset SHEETS (objects on a solid magenta #FF00FF background)
into individual, tightly-cropped, transparent PNGs ready to ship in assets/.

Steps per sheet:
  1. Build an "ink" mask = pixels far from magenta.
  2. Segment into cells using row/column projection profiles.
  3. Tight-crop each cell's ink bounding box (with padding) and resize.
  4. Key out the magenta background with a SOFT alpha ramp and despill the
     magenta fringe so icons composite cleanly on any background.

Usage:
    python asset_pipeline.py sheet <src.png> <outdir> <name1,name2,...> [--cols N] [--rows N] [--size 256]
    python asset_pipeline.py key  <src.png> <out.png> [--size 256]
"""
import os, sys, argparse
import numpy as np
from PIL import Image

MAGENTA = np.array([255.0, 0.0, 255.0])


def ink_mask(rgb, bg=MAGENTA, tol=105.0):
    d = np.linalg.norm(rgb.astype(np.float32) - bg, axis=-1)
    return d > tol


def _runs(profile, min_len):
    runs, s = [], None
    for i, v in enumerate(profile):
        if v and s is None:
            s = i
        elif not v and s is not None:
            runs.append((s, i)); s = None
    if s is not None:
        runs.append((s, len(profile)))
    return [(a, b) for a, b in runs if (b - a) >= min_len]


def _merge_runs(runs, gap):
    if not runs:
        return runs
    out = [list(runs[0])]
    for a, b in runs[1:]:
        if a - out[-1][1] <= gap:
            out[-1][1] = b
        else:
            out.append([a, b])
    return [tuple(r) for r in out]


def _even_split(n, k):
    step = n / k
    return [(int(i * step), int((i + 1) * step)) for i in range(k)]


def segment(mask, cols=None, rows=None, min_len_ratio=0.045):
    h, w = mask.shape
    col_ink = mask.sum(axis=0) > max(2, h * 0.006)
    row_ink = mask.sum(axis=1) > max(2, w * 0.006)
    col_runs = _merge_runs(_runs(col_ink, int(w * min_len_ratio)), int(w * 0.02))
    row_runs = _merge_runs(_runs(row_ink, int(h * min_len_ratio)), int(h * 0.02))
    if cols and len(col_runs) != cols:
        col_runs = _even_split(w, cols)
    if rows and len(row_runs) != rows:
        row_runs = _even_split(h, rows)
    return [(x0, y0, x1, y1) for (y0, y1) in row_runs for (x0, x1) in col_runs]


def tight_crop(mask, box):
    x0, y0, x1, y1 = box
    sub = mask[y0:y1, x0:x1]
    if sub.size == 0 or not sub.any():
        return None
    ys, xs = np.where(sub)
    return (x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1)


def key_magenta(cell_rgb):
    f = cell_rgb.astype(np.float32)
    d = np.linalg.norm(f - MAGENTA, axis=-1)
    alpha = np.clip((d - 40.0) / 90.0, 0.0, 1.0)
    magness = np.clip((200.0 - d) / 200.0, 0.0, 1.0)   # 1 near magenta
    g = f[..., 1]
    r = f[..., 0] * (1 - 0.75 * magness) + g * (0.75 * magness)
    b = f[..., 2] * (1 - 0.75 * magness) + g * (0.75 * magness)
    rgb = np.clip(np.dstack([r, g, b]), 0, 255)
    return np.dstack([rgb, alpha * 255]).astype(np.uint8)


def save_png(rgba, path, size=None, pad_ratio=0.10):
    im = Image.fromarray(rgba, "RGBA")
    if size:
        w, h = im.size
        s = int(max(w, h) * (1 + 2 * pad_ratio))
        canvas = Image.new("RGBA", (s, s), (0, 0, 0, 0))
        canvas.paste(im, ((s - w) // 2, (s - h) // 2), im)
        im = canvas.resize((size, size), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path)
    return im.size


def run_sheet(src, outdir, names, cols=None, rows=None, size=256):
    rgb = np.asarray(Image.open(src).convert("RGB"))
    mask = ink_mask(rgb)
    cells = segment(mask, cols=cols, rows=rows)
    H = max(1, rgb.shape[0])
    cells.sort(key=lambda c: (round(c[1] / H * 100), c[0]))
    print(f"  detected {len(cells)} cells for {len(names)} names")
    results = []
    for i, name in enumerate(names):
        if i >= len(cells):
            print(f"  ! no cell for {name}"); continue
        tc = tight_crop(mask, cells[i])
        if tc is None:
            print(f"  ! empty cell for {name}"); continue
        x0, y0, x1, y1 = tc
        p = 6
        x0, y0 = max(0, x0 - p), max(0, y0 - p)
        x1, y1 = min(rgb.shape[1], x1 + p), min(rgb.shape[0], y1 + p)
        rgba = key_magenta(rgb[y0:y1, x0:x1])
        out = os.path.join(outdir, f"{name}.png")
        save_png(rgba, out, size=size)
        results.append(out)
        print(f"  + {out}")
    return results


def run_key(src, out, size=256):
    rgb = np.asarray(Image.open(src).convert("RGB"))
    mask = ink_mask(rgb)
    tc = tight_crop(mask, (0, 0, rgb.shape[1], rgb.shape[0]))
    if tc is None:
        print("  ! nothing found"); return []
    x0, y0, x1, y1 = tc
    save_png(key_magenta(rgb[y0:y1, x0:x1]), out, size=size)
    print(f"  + {out}")
    return [out]


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("sheet"); s.add_argument("src"); s.add_argument("outdir")
    s.add_argument("names"); s.add_argument("--cols", type=int, default=None)
    s.add_argument("--rows", type=int, default=None); s.add_argument("--size", type=int, default=256)
    k = sub.add_parser("key"); k.add_argument("src"); k.add_argument("out"); k.add_argument("--size", type=int, default=256)
    a = ap.parse_args()
    if a.cmd == "sheet":
        run_sheet(a.src, a.outdir, [n.strip() for n in a.names.split(",") if n.strip()],
                  cols=a.cols, rows=a.rows, size=a.size)
    else:
        run_key(a.src, a.out, size=a.size)
