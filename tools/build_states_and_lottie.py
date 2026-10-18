#!/usr/bin/env python3
"""Derive button states + emit Lottie animations + cleanup for VoiceChat v5."""
import os, json, glob, shutil
from PIL import Image, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # voicechat_v5
ASSETS = os.path.join(ROOT, "assets")

# ---------------------------------------------------------------- cleanup
for junk in ("logo", "lottie_v4"):
    d = os.path.join(ASSETS, junk)
    if os.path.isdir(d) and not os.listdir(d):
        os.rmdir(d); print("removed empty dir", junk)

# ------------------------------------------------- button states
BTN = os.path.join(ASSETS, "buttons")
for st in ("normal", "pressed", "disabled"):
    os.makedirs(os.path.join(BTN, st), exist_ok=True)

bases = [f for f in glob.glob(os.path.join(BTN, "*.png"))]
n = 0
for src in bases:
    name = os.path.splitext(os.path.basename(src))[0]
    im = Image.open(src).convert("RGBA")
    # normal
    im.save(os.path.join(BTN, "normal", f"{name}.png"))
    # pressed: darker + slightly scaled
    dark = ImageEnhance.Brightness(im).enhance(0.72)
    dark = ImageEnhance.Color(dark).enhance(1.10)
    dark.save(os.path.join(BTN, "pressed", f"{name}.png"))
    # disabled: desaturate + 45% alpha
    dis = ImageEnhance.Color(im).enhance(0.25)
    a = dis.split()[3].point(lambda v: int(v * 0.45))
    dis.putalpha(a)
    dis.save(os.path.join(BTN, "disabled", f"{name}.png"))
    n += 1
    os.remove(src)  # keep the tree tidy: bases now live in states
print(f"button states: {n} bases x 3 = {n*3} files")

# ------------------------------------------------- Lottie animations
LOT = os.path.join(ASSETS, "lottie")
os.makedirs(LOT, exist_ok=True)


def lottie(name, layers, w=512, h=512, fps=30, duration=60):
    doc = {"v": "5.7.4", "fr": fps, "ip": 0, "op": duration, "w": w, "h": h,
           "nm": name, "ddd": 0, "assets": [], "layers": layers}
    with open(os.path.join(LOT, f"{name}.json"), "w") as f:
        json.dump(doc, f, separators=(",", ":"))
    return name


def sh_layer(idx, color, start_sz, end_sz, op_ks, pos, rot_end=0):
    return {
        "ddd": 0, "ind": idx, "ty": 4, "nm": f"shape{idx}", "sr": 1,
        "ks": {
            "o": op_ks,
            "r": {"a": 1, "k": [{"t": 0, "s": [0]}, {"t": 60, "s": [rot_end]}]},
            "p": {"a": 0, "k": [pos[0], pos[1], 0]},
            "a": {"a": 0, "k": [0, 0, 0]},
            "s": {"a": 1, "k": [{"t": 0, "s": [start_sz, start_sz, 100]},
                                {"t": 60, "s": [end_sz, end_sz, 100]}]},
        },
        "ao": 0,
        "shapes": [{
            "ty": "gr", "nm": "grp",
            "it": [
                {"ty": "el", "p": {"a": 0, "k": [0, 0]}, "s": {"a": 0, "k": [160, 160]}, "nm": "el"},
                {"ty": "fl", "c": {"a": 0, "k": color}, "o": {"a": 0, "k": 100}, "nm": "fl"},
                {"ty": "tr", "p": {"a": 0, "k": [0, 0]}, "a": {"a": 0, "k": [0, 0]},
                 "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0}, "o": {"a": 0, "k": 100}},
            ],
        }],
        "ip": 0, "op": 60, "st": 0, "bm": 0,
    }


def opacity(t0, v0, t1, v1):
    return {"a": 1, "k": [{"t": t0, "s": [v0], "i": {"x": [0.4], "y": [1]}, "o": {"x": [0.6], "y": [0]}},
                           {"t": t1, "s": [v1]}]}


# 1) gift burst
layers = [
    sh_layer(1, [1, 0.25, 0.65, 1], 10, 350, opacity(0, 100, 55, 0), [256, 256]),
    sh_layer(2, [1, 0.75, 0.15, 1], 6, 260, opacity(0, 100, 50, 0), [180, 210], 90),
    sh_layer(3, [0.2, 0.85, 1, 1], 6, 240, opacity(0, 100, 48, 0), [330, 300], -70),
]
lottie("gift_burst", layers)

# 2) VIP entry
lottie("vip_entry", [
    sh_layer(1, [1, 0.82, 0.2, 1], 20, 300, opacity(0, 0, 20, 100), [256, 256]),
    sh_layer(2, [1, 0.3, 0.7, 1], 40, 220, opacity(0, 30, 30, 100), [256, 256], 30),
])

# 3) win
lottie("pk_win", [
    sh_layer(1, [0.2, 1, 0.4, 1], 30, 320, opacity(0, 100, 58, 0), [256, 256]),
    sh_layer(2, [1, 0.82, 0.2, 1], 20, 260, opacity(0, 80, 55, 0), [256, 256], 120),
])

# 4) lose
lottie("pk_lose", [
    sh_layer(1, [1, 0.3, 0.3, 1], 60, 200, opacity(0, 100, 30, 0), [256, 320]),
    sh_layer(2, [0.5, 0.5, 0.5, 1], 40, 150, opacity(0, 90, 30, 0), [256, 340], -30),
])

# 5) luckbox open
lottie("luckbox_open", [
    sh_layer(1, [1, 0.8, 0.2, 1], 20, 400, opacity(0, 100, 58, 0), [256, 300]),
    sh_layer(2, [1, 1, 1, 1], 10, 500, opacity(0, 70, 40, 0), [256, 240], 45),
])

# 6) loading spinner
lottie("loading", [
    {"ddd": 0, "ind": 1, "ty": 4, "nm": "ring", "sr": 1,
     "ks": {"o": {"a": 0, "k": 100},
            "r": {"a": 1, "k": [{"t": 0, "s": [0]}, {"t": 60, "s": [360]}]},
            "p": {"a": 0, "k": [256, 256, 0]}, "a": {"a": 0, "k": [0, 0, 0]},
            "s": {"a": 0, "k": [100, 100, 100]}},
     "ao": 0, "shapes": [{"ty": "gr", "it": [
         {"ty": "el", "p": {"a": 0, "k": [0, 0]}, "s": {"a": 0, "k": [300, 300]}},
         {"ty": "st", "c": {"a": 0, "k": [1, 0.2, 0.65, 1]}, "o": {"a": 0, "k": 100},
          "w": {"a": 0, "k": 18}, "lc": 2, "lj": 1},
         {"ty": "tm", "s": {"a": 0, "k": 0}, "e": {"a": 0, "k": 75}, "o": {"a": 0, "k": 0}, "m": 1},
         {"ty": "tr", "p": {"a": 0, "k": [0, 0]}, "a": {"a": 0, "k": [0, 0]},
          "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0}, "o": {"a": 0, "k": 100}},
     ]}], "ip": 0, "op": 60, "st": 0, "bm": 0},
])
print("lottie files:", len(glob.glob(os.path.join(LOT, "*.json"))))
