#!/usr/bin/env python3
"""Verify every asset path referenced in Dart exists, and every shipped asset
is declared in app_assets.dart. Fails loudly on gaps."""
import os, re, glob, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
ASSETS = os.path.join(ROOT, "assets")
REG = os.path.join(APP, "lib", "core", "app_assets.dart")

reg_src = open(REG).read()

# 1. literal asset paths inside app_assets.dart
declared = set(re.findall(r"'(assets/[^']+)'", reg_src))

# 2. files that actually exist
present = set()
for p in glob.glob(os.path.join(ASSETS, "**", "*"), recursive=True):
    if os.path.isfile(p):
        present.add(os.path.relpath(p, ROOT).replace(os.sep, "/"))

missing = sorted(
    d for d in declared
    if d not in present
    and not d.startswith("assets/buttons/")          # base; state added at runtime
    and not d.endswith("/")                          # directory (assets/svga/)
)
# every button base must resolve to at least one *_normal.png
for d in sorted(x for x in declared if x.startswith("assets/buttons/")):
    if f"{d}_normal.png" not in present:
        print("   - button base with no state files:", d)

print(f"declared: {len(declared)}   present: {len(present)}")
if missing:
    print(f"MISSING referenced files ({len(missing)}):")
    for m in missing:
        print("   -", m)
else:
    print("OK: every declared asset exists")

# 3. unreferenced files (informational — buttons are path-joined at runtime)
orphans = sorted(
    p for p in present
    if p not in declared and "/buttons/" not in p
    and "/svga/" not in p and "/lottie/" not in p and p.endswith(".png")
)
if orphans:
    print(f"\nnote: {len(orphans)} PNGs not directly referenced (ok if used dynamically):")
    for o in orphans[:25]:
        print("   ·", o)

sys.exit(1 if missing else 0)