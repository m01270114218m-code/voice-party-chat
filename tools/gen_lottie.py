#!/usr/bin/env python3
"""
VoiceChat v6 — generate valid Lottie (bodymovin v5) animation files.

Produces real, playable Lottie JSON for the gift/effect/VIP/PK/luckbox
animations. These are the ready-to-use alternative to binary SVGA files
(see assets/SVGA_GUIDE.md for exporting .svga from Adobe Animate).
"""
import os, json, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "lottie")
os.makedirs(OUT, exist_ok=True)

W = H = 512
FR = 30


def _shape_layer(name, color, kind="circle", size=120, count=1, spread=0.0, delay=0):
    """A simple animated shape layer (scale + opacity pulse)."""
    shapes = []
    for i in range(count):
        ang = (i / max(1, count)) * 2 * math.pi
        px = math.cos(ang) * spread
        py = math.sin(ang) * spread
        if kind == "circle":
            shp = {"ty": "el", "p": {"a": 0, "k": [0, 0]}, "s": {"a": 0, "k": [size, size]}}
        elif kind == "star":
            shp = {"ty": "sr", "sy": 1, "d": 1, "pt": {"a": 0, "k": 5},
                   "p": {"a": 0, "k": [0, 0]}, "r": {"a": 0, "k": 0},
                   "or": {"a": 0, "k": size / 2}, "os": {"a": 0, "k": 0},
                   "ir": {"a": 0, "k": size / 4}, "is": {"a": 0, "k": 0}}
        else:  # rect
            shp = {"ty": "rc", "p": {"a": 0, "k": [0, 0]}, "s": {"a": 0, "k": [size, size / 3]}, "r": {"a": 0, "k": 8}}
        shapes.append({"ty": "gr", "it": [
            shp,
            {"ty": "fl", "c": {"a": 0, "k": color}, "o": {"a": 0, "k": 100}},
            {"ty": "tr", "p": {"a": 0, "k": [px, py]}, "a": {"a": 0, "k": [0, 0]},
             "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0}, "o": {"a": 0, "k": 100}},
        ]})
    return {
        "ddd": 0, "ind": 1, "ty": 4, "nm": name, "sr": 1,
        "ks": {
            "o": {"a": 1, "k": [
                {"t": delay, "s": [0]}, {"t": delay + 6, "s": [100]},
                {"t": 40, "s": [100]}, {"t": 50, "s": [0]}]},
            "r": {"a": 0, "k": 0},
            "p": {"a": 0, "k": [W / 2, H / 2, 0]},
            "a": {"a": 0, "k": [0, 0, 0]},
            "s": {"a": 1, "k": [
                {"t": delay, "s": [20, 20, 100]},
                {"t": delay + 12, "s": [120, 120, 100]},
                {"t": 50, "s": [100, 100, 100]}]},
        },
        "ao": 0, "shapes": shapes, "ip": 0, "op": 60, "st": 0, "bm": 0,
    }


def lottie(name, layers, op=60):
    return {
        "v": "5.7.4", "fr": FR, "ip": 0, "op": op, "w": W, "h": H, "nm": name, "ddd": 0,
        "assets": [], "layers": layers, "markers": [],
    }


MAGENTA = [1, 0.18, 0.72, 1]
CYAN = [0.2, 0.9, 1, 1]
GOLD = [1, 0.8, 0.2, 1]
PURPLE = [0.6, 0.3, 1, 1]
RED = [1, 0.25, 0.3, 1]
GREEN = [0.3, 0.9, 0.5, 1]

ANIMS = {
    "gift_burst": lottie("gift_burst", [
        _shape_layer("coins", GOLD, "circle", 40, 12, 150),
        _shape_layer("stars", MAGENTA, "star", 60, 8, 110, delay=4),
        _shape_layer("sparkles", CYAN, "circle", 24, 16, 190, delay=8),
    ]),
    "vip_entry": lottie("vip_entry", [
        _shape_layer("rays", GOLD, "rect", 300, 8, 0),
        _shape_layer("sparkles", CYAN, "star", 50, 10, 160, delay=6),
        _shape_layer("glow", PURPLE, "circle", 220, 1, 0, delay=2),
    ]),
    "pk_win": lottie("pk_win", [
        _shape_layer("confetti", GOLD, "rect", 60, 20, 200),
        _shape_layer("stars", MAGENTA, "star", 70, 8, 120, delay=4),
    ]),
    "pk_lose": lottie("pk_lose", [
        _shape_layer("splat", RED, "circle", 90, 6, 130),
        _shape_layer("smoke", PURPLE, "circle", 120, 5, 90, delay=6),
    ]),
    "luckbox_open": lottie("luckbox_open", [
        _shape_layer("coins", GOLD, "circle", 46, 14, 170),
        _shape_layer("gems", CYAN, "star", 54, 8, 120, delay=5),
        _shape_layer("burst", MAGENTA, "circle", 200, 1, 0, delay=1),
    ]),
    "loading": lottie("loading", [
        _shape_layer("ring", MAGENTA, "circle", 120, 1, 0),
        _shape_layer("dot", CYAN, "circle", 30, 1, 0, delay=3),
    ], op=45),
}

for name, data in ANIMS.items():
    with open(os.path.join(OUT, f"{name}.json"), "w") as fh:
        json.dump(data, fh)
    print(f"wrote assets/lottie/{name}.json")
print(f"{len(ANIMS)} lottie animations")
