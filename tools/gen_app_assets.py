#!/usr/bin/env python3
"""
VoiceChat v6 — generate app/lib/core/app_assets.dart from assets_manifest.json.

Produces a central registry `A` with one constant per asset (camelCase) plus
helpers for button states, so no screen ever hard-codes an asset path.
"""
import os, json, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from asset_spec import ACTION_BUTTONS

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, "assets_manifest.json")
OUT = os.path.join(ROOT, "app", "lib", "core", "app_assets.dart")


def camel(name):
    parts = re.split(r"[_\-]+", name)
    return parts[0] + "".join(p.capitalize() for p in parts[1:])


def main():
    m = json.load(open(MANIFEST))
    cats = m["categories"]

    lines = [
        "/// Central registry of every bundled asset — one source of truth for paths",
        "/// so screens never hard-code strings. AUTO-GENERATED from",
        "/// assets/assets_manifest.json by tools/gen_app_assets.py — do not edit by hand.",
        "///",
        "/// RULE: never write an asset path inside a screen; always use `A.<name>`.",
        "class A {",
        "  A._();",
        "",
    ]

    # per-category constants
    for cat in sorted(cats):
        items = cats[cat]["items"]
        if not items:
            continue
        lines.append(f"  // ── {cat} " + "─" * max(0, 66 - len(cat)))
        for it in items:
            const = camel(it["name"])
            lines.append(f"  static const String {const} = '{it['path']}';")
        lines.append("")

    # button-state helper
    lines += [
        "  // ── Button states ────────────────────────────────────────────────────────",
        "  /// Returns the asset for a button in a given state.",
        "  /// [state] is one of: normal, pressed, disabled.",
        "  static String btnState(String base, String state) =>",
        "      'assets/buttons/btn_${base}_$state.png';",
        "",
        "  static const String btnNormal = 'normal';",
        "  static const String btnPressed = 'pressed';",
        "  static const String btnDisabled = 'disabled';",
        "",
        "  // ── Category lists (for galleries / preloading) ──────────────────────────",
    ]
    for cat in sorted(cats):
        items = cats[cat]["items"]
        if not items:
            continue
        consts = ", ".join(camel(it["name"]) for it in items)
        lines.append(f"  static const List<String> all{cat.capitalize()} = [{consts}];")
    # ── named action-button constants (btn_<action>_normal) ──────────────────
    lines.append("  // ── Named action buttons (normal state) ──────────────────────────────────")
    for action in ACTION_BUTTONS:
        c = camel(action)
        lines.append(f"  static const String btn{c[0].upper() + c[1:]} = 'assets/buttons/btn_{action}_normal.png';")
    lines.append("")

    # ── compatibility aliases used by the screens ────────────────────────────
    lines += [
        "  // ── Compatibility aliases (names used by screens) ────────────────────────",
        "  static const String stateNormal = btnNormal;",
        "  static const String statePressed = btnPressed;",
        "  static const String stateDisabled = btnDisabled;",
        "  static const String micOn = mic;",
        "  static const String micOff = micMute;",
        "  static const String chat = messages;",
        "  static const String seatOccupied = seatBusy;",
        "  static const String headset = speaker;",
        "  static const String info = bell;",
        "  static const String warning = report;",
        "  static const String live = roomLiveBadge;",
        "  static const String familyShield = crestLion;",
        "  static const String bgRoom1 = bgRoomCity;",
        "  static const String pkVs = pkSwords;",
        "  static const String pkTomato = tomato;",
        "  static const String pkEgg = egg;",
        "  static const String gameLudoBoard = ludoBoard;",
        "  static const String gameDomino = domino;",
        "  static const String gameUnoStack = unoDeck;",
        "  static const String gameWheel = wheel;",
        "  static const String btnLuckBox = btnOpenLuckbox;",
        "  static const String vipSilver = frameSilver;",
        "  static const String vipGold = frameGold;",
        "  static const String vipDiamond = frameDiamond;",
        "  static const String lottieGiftBurst = 'assets/lottie/gift_burst.json';",
        "",
        "  // ── Category lists (for galleries / preloading) ──────────────────────────",
        "  static const List<String> avatars = allAvatars;",
        "  static const List<String> frames = allFrames;",
        "  static const List<String> giftCatalog = allGifts;",
        "  static const List<String> roomBackgrounds = allBackgrounds;",
        "",
        "}",
        "",
    ]
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as fh:
        fh.write("\n".join(lines))
    total = sum(len(c["items"]) for c in cats.values())
    print(f"wrote {OUT}  ({total} constants across {len(cats)} categories)")


if __name__ == "__main__":
    main()
