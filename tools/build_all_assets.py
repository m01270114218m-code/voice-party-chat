#!/usr/bin/env python3
"""Master asset build for VoiceChat v5.

Maps every generated sheet in /workspace/images/<dir>/ to the individual
assets it contains and writes transparent PNGs into ./assets/<subdir>/.

Run:  python3 tools/build_all_assets.py
"""
import os, sys, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from asset_pipeline import run_sheet, run_key

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(os.path.dirname(ROOT), "images")
ASSETS = os.path.join(ROOT, "assets")

# (images_dir, out_subdir, [names], cols, rows, size)
SHEETS = [
    ("vc_icons_sheet1_v2", "icons", ["search","bell","wallet","coins","diamond","gift","mic","mic_off","speaker","hand_raise","exit","settings"], 4, 3, 256),
    ("vc_icons_sheet1_v3", "icons", ["profile","friends","chat","like","comment","share","plus","lock","block","kick","translate","voice_changer"], 4, 3, 256),
    ("vc_icons_sheet1_v4", "icons", ["wheel","gamepad","crown","vip_silver","vip_gold","vip_diamond","level_star","home","live","headset","send","close"], 4, 3, 256),
    ("vc_icons_sheet1",    "icons", ["check","warning","info","refresh","filter","menu","camera","gallery","download","star","globe","fire"], 4, 3, 256),

    ("vc_room_sheet1",    "rooms", ["seat_empty","seat_occupied","seat_locked","host_frame","host_frame_vip","speaker_ring"], 3, 2, 256),
    ("vc_room_sheet1_v2", "rooms", ["waveform","stage_glow","vip_arch","mic_ring","family_frame","aura_ring"], 3, 2, 256),

    ("vc_gifts_sheet1",    "gifts", ["rose_bouquet","teddy_bear","chocolates","love_potion","diamond_ring","gold_bar","sports_car","private_jet","yacht","castle","crown_jewel","ruby_heart"], 3, 4, 256),
    ("vc_gifts_sheet1_v2", "gifts", ["lion_pet","dragon_pet","rocket","genie_lamp","treasure_chest","lucky_cat","red_envelope","firework","crystal_ball","golden_guitar","mystery_box","galaxy_orb"], 3, 4, 256),
    ("vc_gifts_sheet2",    "gifts", ["phoenix","pegasus","cosmic_whale","unicorn","golden_tiger","golden_turtle","angel_wings","thunder_hammer","wizard_wand","royal_scepter","golden_chariot","crystal_heart"], 3, 4, 256),
    ("vc_gifts_sheet2_v2", "gifts", ["hot_air_balloon","perfume","gold_watch","balloons","mystery_egg","large_roses"], 2, 3, 256),

    ("vc_games_sheet1",    "games", ["ludo_board","ludo_tokens","domino_tile","uno_card"], 2, 2, 384),
    ("vc_games_sheet1_v2", "games", ["wheel_fortune","dice","trophy","game_coins"], 2, 2, 256),

    ("vc_family_sheet1",    "family", ["badge_gem","badge_star","badge_flame","badge_crown"], 2, 2, 256),
    ("vc_family_sheet1_v2", "family", ["crest_lion","crest_eagle","crest_dragon","crest_wolf"], 2, 2, 256),

    ("vc_pk_sheet1",    "pk", ["pk_progress_bar","pk_victory","pk_defeat"], 3, 1, 512),
    ("vc_pk_sheet1_v2", "pk", ["tomato","egg","tomato_splat","confetti_burst"], 2, 2, 256),

    ("vc_vip_sheet1",    "vip", ["vip_limo","vip_sportscar","vip_lion","vip_peacock"], 2, 2, 384),
    ("vc_vip_sheet1_v2", "vip", ["vip_carpet","vip_spotlight","vip_badge_gem","royal_crown"], 2, 2, 384),

    ("vc_luckbox_sheet1",    "luckbox", ["lucky_envelope","mystery_box","open_box","timer_ring"], 2, 2, 256),
    ("vc_luckbox_sheet1_v2", "luckbox", ["golden_key","coin_stack","big_diamond","horseshoe_clover"], 2, 2, 256),

    ("vc_avatars_sheet1", "avatars", ["avatar_1","avatar_2","avatar_3","avatar_4","avatar_5","avatar_6"], 3, 2, 384),
    ("vc_frames_sheet1",  "frames", ["frame_blue","frame_pink","frame_flame","frame_gold","frame_frost","frame_galaxy"], 3, 2, 256),

    ("vc_ui_sheet1_v5", "ui", ["input_field","input_focused","input_error","tab_active","tab_inactive","card_glass","loading_ring","toast_success","toast_error"], 3, 3, 256),
    ("vc_ui_sheet1_v4", "ui", ["status_online","status_offline","status_inroom","progress_bar","sheet_handle","dialog_card"], 3, 2, 256),
    ("vc_bubbles_sheet1", "bubbles", ["bubble_in","bubble_out","bubble_system","bubble_danmaku","bubble_voice","bubble_gift"], 3, 2, 256),
    ("vc_effects_sheet1",    "effects", ["sparkle_burst","confetti_burst","heart_burst","ring_shockwave","star_trail","light_orb"], 3, 2, 256),
    ("vc_effects_sheet1_v2", "effects", ["splat_red","splat_yellow","splat_blue","coin_burst","smoke_puff","starburst"], 3, 2, 256),

    ("vc_btn_round_sheet", "buttons", ["btnr_magenta","btnr_violet","btnr_cyan","btnr_gold","btnr_green","btnr_red"], 3, 2, 256),
    ("vc_btn_pill_sheet",  "buttons", ["btnp_magenta","btnp_violet","btnp_cyan","btnp_gold","btnp_green","btnp_red"], 3, 2, 512),
]

# Single-object brand art (keyed)
BRAND = [
    ("vc_logo_3d",    "brand", "logo_3d",       512),
    ("vc_logo_3d_v2", "brand", "app_icon",      1024),
    ("vc_logo_3d_v5", "brand", "splash_emblem", 768),
]
BANNER = ("vc_logo_3d_v3", "brand", "banner_recharge")

# Full-bleed backgrounds (copy as-is)
BG = [
    ("vc_logo_3d_v6",       "backgrounds", "bg_neon_1"),
    ("vc_logo_3d_v4",       "backgrounds", "bg_celebration"),
    ("vc_bg_home",          "backgrounds", "bg_home"),
    ("vc_bg_home_v2",       "backgrounds", "bg_login"),
    ("vc_bg_wallet",        "backgrounds", "bg_wallet"),
    ("vc_bg_wallet_v2",     "backgrounds", "bg_profile"),
    ("vc_bg_leaderboard",   "backgrounds", "bg_stage"),
    ("vc_bg_leaderboard_v2","backgrounds", "bg_leaderboard"),
    ("vc_bg_room_2",        "backgrounds", "bg_room_city"),
    ("vc_bg_room_2_v2",     "backgrounds", "bg_room_vip"),
]


def sheet_path(name):
    """First PNG inside images/<name>/ (dir names and file names differ)."""
    hits = sorted(glob.glob(os.path.join(IMG, name, "*.png")))
    return hits[0] if hits else None


def main():
    # wipe only the AI-generated subdirs so we never mix old v4 art in
    import shutil
    for sub in {s[1] for s in SHEETS} | {b[1] for b in BRAND} | {b[1] for b in BG} | {BANNER[1]}:
        d = os.path.join(ASSETS, sub)
        if os.path.isdir(d):
            for f in glob.glob(os.path.join(d, "*")):
                os.remove(f) if os.path.isfile(f) else shutil.rmtree(f, ignore_errors=True)

    total = 0
    for sheet, sub, names, cols, rows, size in SHEETS:
        src = sheet_path(sheet)
        if not src:
            print(f"MISSING sheet: {sheet}"); continue
        print(f"[{sheet}] -> assets/{sub}/")
        total += len(run_sheet(src, os.path.join(ASSETS, sub), names, cols=cols, rows=rows, size=size))

    for sheet, sub, name, size in BRAND:
        src = sheet_path(sheet)
        if not src:
            print(f"MISSING brand: {sheet}"); continue
        total += len(run_key(src, os.path.join(ASSETS, sub, f"{name}.png"), size=size))
        print(f"[brand] {name}")

    src = sheet_path(BANNER[0])
    if src:
        total += len(run_key(src, os.path.join(ASSETS, BANNER[1], f"{BANNER[2]}.png"), size=0))
        print(f"[banner] {BANNER[2]}")

    from PIL import Image
    for sheet, sub, name in BG:
        src = sheet_path(sheet)
        if not src:
            print(f"MISSING bg: {sheet}"); continue
        im = Image.open(src).convert("RGB")
        w, h = im.size
        if w != 1080:
            im = im.resize((1080, int(h * 1080 / w)), Image.LANCZOS)
        out = os.path.join(ASSETS, sub, f"{name}.jpg")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        im.save(out, quality=88, optimize=True)
        total += 1
        print(f"  + {out}")

    print(f"\nTOTAL assets written: {total}")


if __name__ == "__main__":
    main()
