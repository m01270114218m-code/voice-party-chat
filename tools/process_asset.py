#!/usr/bin/env python3
"""
VoiceChat v6 — asset post-processing pipeline.

Takes a raw generated image (single object on flat magenta #FF00FF) and produces
a clean, normalized PNG:
  1. chroma-key the magenta background -> alpha (soft edges, despill)
  2. trim to the object's alpha bbox
  3. re-center on a square canvas with EQUAL margins on all four sides
  4. resize to the category's standard size
  5. verify: object present, not touching edges, margins even

Usage:
  python3 tools/process_asset.py <raw.png> <out.png> <size>
"""
import sys
from PIL import Image, ImageFilter
import numpy as np


def chroma_key(im: Image.Image) -> Image.Image:
    """Remove a flat magenta background, returning RGBA with soft alpha."""
    im = im.convert("RGBA")
    arr = np.asarray(im).astype(np.float32)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]

    # magenta-ness: high R, low G, high B
    # distance from the magenta axis
    magenta = np.array([255.0, 0.0, 255.0])
    dist = np.sqrt((r - magenta[0]) ** 2 + (g - magenta[1]) ** 2 + (b - magenta[2]) ** 2)

    # alpha ramp: fully transparent near magenta, fully opaque far from it
    lo, hi = 60.0, 150.0
    alpha = np.clip((dist - lo) / (hi - lo), 0.0, 1.0)

    # despill: pull magenta cast out of semi-transparent edge pixels
    spill = (1.0 - alpha) * 0.6
    # reduce R and B toward G on edges
    arr[..., 0] = arr[..., 0] * (1 - spill) + g * spill
    arr[..., 2] = arr[..., 2] * (1 - spill) + g * spill

    out = np.dstack([arr[..., :3], alpha * 255.0]).clip(0, 255).astype(np.uint8)
    res = Image.fromarray(out, "RGBA")

    # soften the alpha edge slightly to kill jaggies
    a = res.split()[3].filter(ImageFilter.GaussianBlur(0.6))
    res.putalpha(a)
    return res


def content_bbox(im: Image.Image, thr: int = 100, rel: float = 0.03):
    """Bounding box of the main object, ignoring faint background glow tails.

    Thresholds the alpha, then drops rows/columns whose pixel count is a tiny
    fraction of the densest row/column (those are glow tails, not the object).
    """
    a = np.asarray(im.split()[3])
    mask = a > thr
    if not mask.any():
        return None
    col = mask.sum(axis=0).astype(np.float64)
    row = mask.sum(axis=1).astype(np.float64)
    keep_c = np.where(col > rel * col.max())[0]
    keep_r = np.where(row > rel * row.max())[0]
    if len(keep_c) == 0 or len(keep_r) == 0:
        return None
    return (int(keep_c.min()), int(keep_r.min()), int(keep_c.max()) + 1, int(keep_r.max()) + 1)


def normalize(im: Image.Image, size: int, margin_ratio: float = 0.10) -> Image.Image:
    """Trim to the main object, then center on a square canvas with even margins."""
    bbox = content_bbox(im)
    if bbox is None:
        raise ValueError("empty image after chroma key")
    obj = im.crop(bbox)

    inner = int(size * (1 - 2 * margin_ratio))
    obj.thumbnail((inner, inner), Image.LANCZOS)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    x = (size - obj.width) // 2
    y = (size - obj.height) // 2
    canvas.alpha_composite(obj, (x, y))
    return canvas


def verify(im: Image.Image, size: int) -> dict:
    a = np.asarray(im.split()[3])
    bbox = content_bbox(im)
    if bbox is None:
        return {"ok": False, "reason": "empty"}
    L, T, R, B = bbox
    W, H = im.size
    m = [L, T, H - B, W - R]
    touch = min(m) < 2
    # centered: left ~= right and top ~= bottom (equal margins per axis)
    centered = abs(m[0] - m[3]) <= max(2, int(size * 0.03)) and abs(m[1] - m[2]) <= max(2, int(size * 0.03))
    coverage = float((a > 100).mean())
    return {
        "ok": (not touch) and centered and 0.02 < coverage < 0.92,
        "margins": m, "touch": touch, "centered": centered, "coverage": round(coverage, 3),
    }


def process(raw_path: str, out_path: str, size: int) -> dict:
    im = Image.open(raw_path)
    keyed = chroma_key(im)
    norm = normalize(keyed, size)
    norm.save(out_path)
    return verify(norm, size)


def process_dir(raw_dir: str, out_dir: str, size: int, margin_ratio: float = 0.10) -> dict:
    """Batch-process every PNG in raw_dir -> out_dir. Returns a report."""
    import os, glob
    os.makedirs(out_dir, exist_ok=True)
    report = {"ok": [], "failed": []}
    for raw in sorted(glob.glob(os.path.join(raw_dir, "*.png"))):
        name = os.path.basename(raw)
        out = os.path.join(out_dir, name)
        try:
            im = Image.open(raw)
            keyed = chroma_key(im)
            norm = normalize(keyed, size, margin_ratio)
            norm.save(out)
            v = verify(norm, size)
            (report["ok"] if v["ok"] else report["failed"]).append((name, v))
        except Exception as e:  # noqa
            report["failed"].append((name, {"error": str(e)}))
    return report


if __name__ == "__main__":
    if len(sys.argv) >= 4 and sys.argv[1] == "--dir":
        rep = process_dir(sys.argv[2], sys.argv[3], int(sys.argv[4]))
        print(f"OK: {len(rep['ok'])}  FAILED: {len(rep['failed'])}")
        for n, v in rep["failed"]:
            print("  FAIL", n, v)
    else:
        raw, out, size = sys.argv[1], sys.argv[2], int(sys.argv[3])
        print(process(raw, out, size))
