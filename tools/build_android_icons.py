#!/usr/bin/env python3
"""Generate Android launcher icons (all densities) + adaptive icon layers
from the AI-generated app_icon.png."""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "brand", "app_icon.png")
RES = os.path.join(ROOT, "app", "android", "app", "src", "main", "res")

DENSITIES = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}

src = Image.open(SRC).convert("RGBA")


def square(im, size, pad_ratio=0.0):
    """Fit onto a transparent square canvas."""
    w, h = im.size
    s = int(max(w, h) * (1 + 2 * pad_ratio))
    cv = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    cv.paste(im, ((s - w) // 2, (s - h) // 2), im)
    return cv.resize((size, size), Image.LANCZOS)


n = 0
for dens, size in DENSITIES.items():
    d = os.path.join(RES, f"mipmap-{dens}")
    os.makedirs(d, exist_ok=True)
    square(src, size).save(os.path.join(d, "ic_launcher.png"))
    # round variant (same art; Android masks it)
    square(src, size).save(os.path.join(d, "ic_launcher_round.png"))
    n += 2

    # adaptive icon: foreground = art inset 25% (safe zone), background = flat brand colour
    fg = square(src, int(size * 1.5), pad_ratio=0.28)
    fg.save(os.path.join(d, "ic_launcher_foreground.png"))
    n += 1

os.makedirs(os.path.join(RES, "mipmap-anydpi-v26"), exist_ok=True)
adaptive = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
"""
for name in ("ic_launcher.xml", "ic_launcher_round.xml"):
    with open(os.path.join(RES, "mipmap-anydpi-v26", name), "w") as f:
        f.write(adaptive)
    n += 1

drawable = os.path.join(RES, "drawable")
os.makedirs(drawable, exist_ok=True)
with open(os.path.join(drawable, "ic_launcher_background.xml"), "w") as f:
    f.write('<?xml version="1.0" encoding="utf-8"?>\n'
            '<shape xmlns:android="http://schemas.android.com/apk/res/android" '
            'android:shape="rectangle">\n'
            '    <gradient android:startColor="#7B2FF7" android:endColor="#FF2FA8" '
            'android:angle="135"/>\n</shape>\n')
n += 1

# Play Store listing icon (512)
store = os.path.join(ROOT, "assets", "brand", "store_icon_512.png")
square(src, 512).save(store)
n += 1

print(f"android icons written: {n}  (+ mipmaps: {', '.join(DENSITIES)})")
