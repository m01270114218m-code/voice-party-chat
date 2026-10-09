#!/usr/bin/env python3
"""
VoiceChat v6 — collect raw generated images -> processed category assets.

For every asset in asset_spec.SPEC, look for the raw generation at
  /workspace/images/{name}/{name}.png
process it (chroma-key + center + normalize) and write
  voicechat_v6/assets/{category}/{name}.png

Usage:
  python3 tools/collect_assets.py [category ...]     # default: all
"""
import os, sys, glob, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from asset_spec import SPEC
from process_asset import chroma_key, normalize, verify
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # voicechat_v6
IMG_ROOT = "/workspace/images"
OUT_ROOT = os.path.join(ROOT, "assets")

# only accept raw images generated in THIS run (v6 started ~20:44 on 2026-10-09)
CUTOFF = 1791578640.0   # 2026-10-09 20:44 local

# backgrounds are full-bleed (no chroma key, no transparency)
FULLBLEED = {"backgrounds"}


def find_raw(name):
    """Locate the raw generated image for an asset name (tries name and icon_name).
    Only accepts images generated in THIS run (mtime >= CUTOFF) so old v5
    sheet-cropped assets are never reused."""
    for base in (name, f"icon_{name}"):
        cands = [os.path.join(IMG_ROOT, base, f"{base}.png")]
        cands += sorted(glob.glob(os.path.join(IMG_ROOT, f"{base}_v*", f"{base}.png")), reverse=True)
        for c in cands:
            if os.path.exists(c) and os.path.getmtime(c) >= CUTOFF:
                return c
    return None


def collect(categories=None):
    report = {"ok": [], "missing": [], "failed": []}
    for cat, spec in SPEC.items():
        if categories and cat not in categories:
            continue
        size = spec["size"]
        out_dir = os.path.join(OUT_ROOT, cat)
        os.makedirs(out_dir, exist_ok=True)
        for name in spec["items"]:
            raw = find_raw(name)
            if not raw:
                report["missing"].append(f"{cat}/{name}")
                continue
            out = os.path.join(out_dir, f"{name}.png")
            try:
                im = Image.open(raw)
                if cat in FULLBLEED:
                    im = im.convert("RGB").resize(size, Image.LANCZOS)
                    im.save(out)
                    report["ok"].append(f"{cat}/{name}")
                else:
                    keyed = chroma_key(im)
                    norm = normalize(keyed, size[0])
                    norm.save(out)
                    v = verify(norm, size[0])
                    (report["ok"] if v["ok"] else report["failed"]).append(f"{cat}/{name} {v}")
            except Exception as e:  # noqa
                report["failed"].append(f"{cat}/{name} ERROR {e}")
    return report


if __name__ == "__main__":
    cats = sys.argv[1:] or None
    rep = collect(cats)
    print(f"OK: {len(rep['ok'])}  MISSING: {len(rep['missing'])}  FAILED: {len(rep['failed'])}")
    for m in rep["missing"]:
        print("  MISSING", m)
    for f in rep["failed"]:
        print("  FAIL", f)
