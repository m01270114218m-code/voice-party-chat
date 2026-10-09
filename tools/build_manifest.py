#!/usr/bin/env python3
"""
VoiceChat v6 — coverage report + assets_manifest.json.

Compares the required spec (asset_spec.SPEC) against what is actually on disk
in assets/, reports required/found/missing/extra, and writes a manifest that
maps every asset to its path, permanent URL and code usage.
"""
import os, sys, json, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from asset_spec import SPEC

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")
SITE = "https://static.teamily.ai/sites/da89b665-c5e0-4d9c-a857-d61bcea39549"

USAGE = {
    "brand": "Splash screen, app icon, wallet header, recharge banner",
    "icons": "App-wide icon set (nav bar, headers, lists, actions)",
    "buttons": "Every button in every screen (normal/pressed/disabled)",
    "backgrounds": "Screen backgrounds (home, login, room, profile, wallet, leaderboard)",
    "rooms": "Voice room stage: mic seats, host frame, waveform, badges",
    "gifts": "Gift panel + gift animations in the voice room",
    "games": "Mini-games panel (Ludo, Domino, Uno, fortune wheel)",
    "vip": "VIP entry alerts and VIP badges",
    "frames": "Profile avatar frames (tool store)",
    "bubbles": "Chat message bubbles in room + DM",
    "family": "Families/tribes crests and badges",
    "pk": "PK battle screen: progress bar, win/lose effects, tomato/egg",
    "luckbox": "Lucky box / red envelope feature",
    "ui": "UI kit: inputs, tabs, cards, toasts, status dots, switches",
    "effects": "Full-screen gift/celebration effects",
    "avatars": "Default avatar gallery",
}


def main():
    required = {}
    for cat, spec in SPEC.items():
        for name in spec["items"]:
            required[f"{cat}/{name}"] = spec["size"]

    found = {}
    for f in glob.glob(os.path.join(ASSETS, "*", "*")):
        if not f.lower().endswith((".png", ".jpg", ".jpeg")):
            continue
        rel = os.path.relpath(f, ASSETS).replace(os.sep, "/")
        found[rel.rsplit(".", 1)[0]] = f

    missing = sorted(set(required) - set(found))
    extra = sorted(set(found) - set(required))

    manifest = {
        "project": "VoiceChat",
        "version": "v6",
        "style": "glossy 3D / glassmorphism, neon magenta-purple-cyan + gold accents",
        "generation": "each asset generated individually (one image per asset, no sheets, no cropping)",
        "total_required": len(required),
        "total_found": len(found),
        "categories": {},
    }
    for cat, spec in SPEC.items():
        items = []
        for name in spec["items"]:
            rel = f"{cat}/{name}"
            if rel in found:
                ext = os.path.splitext(found[rel])[1]
                items.append({
                    "name": name,
                    "path": f"assets/{rel}{ext}",
                    "url": f"{SITE}/images/{cat}__{name}/{cat}__{name}{ext}",
                    "size": list(spec["size"]),
                    "usage": USAGE.get(cat, ""),
                })
        manifest["categories"][cat] = {
            "count": len(items),
            "usage": USAGE.get(cat, ""),
            "items": items,
        }

    with open(os.path.join(ROOT, "assets_manifest.json"), "w") as fh:
        json.dump(manifest, fh, indent=2, ensure_ascii=False)

    report = {
        "required": len(required),
        "found": len(found),
        "missing": missing,
        "extra": extra,
        "per_category": {c: len(s["items"]) for c, s in SPEC.items()},
    }
    with open(os.path.join(ROOT, "coverage_report.json"), "w") as fh:
        json.dump(report, fh, indent=2, ensure_ascii=False)

    print(f"REQUIRED {len(required)}  FOUND {len(found)}  MISSING {len(missing)}  EXTRA {len(extra)}")
    for m in missing:
        print("  MISSING", m)
    for e in extra:
        print("  EXTRA", e)
    return report


if __name__ == "__main__":
    main()
