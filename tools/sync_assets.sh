#!/usr/bin/env bash
# Mirror the master asset library into the Flutter app bundle.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf app/assets
mkdir -p app/assets
cp -r assets/* app/assets/
# Keep declared animation directory present even before real SVGA exports are supplied.
mkdir -p app/assets/svga
rm -f app/assets/assets_manifest.json app/assets/SVGA_GUIDE.md
echo "synced $(find app/assets -type f | wc -l) files into app/assets/"
