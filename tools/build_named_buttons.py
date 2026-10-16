#!/usr/bin/env python3
"""Create per-action named button assets (normal/pressed/disabled) by cloning
a suitably-coloured base into every action the app references."""
import os, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
B = os.path.join(ROOT, "assets", "buttons")
STATES = ("normal", "pressed", "disabled")

# name -> (shape, colour)   shape: 'p' pill or 'r' round
MAP = {
    "btn_login": ("p", "magenta"), "btn_google": ("p", "cyan"),
    "btn_phone": ("p", "violet"), "btn_otp": ("p", "cyan"),
    "btn_guest": ("p", "violet"), "btn_create_room": ("p", "magenta"),
    "btn_launch_room": ("p", "magenta"), "btn_send_gift": ("p", "gold"),
    "btn_send_text": ("p", "cyan"), "btn_leave_room": ("p", "red"),
    "btn_edit_profile": ("p", "violet"), "btn_wallet": ("p", "gold"),
    "btn_tool_store": ("p", "violet"), "btn_logout": ("p", "red"),
    "btn_buy_pack": ("p", "gold"), "btn_convert_diamond": ("p", "cyan"),
    "btn_convert_coins": ("p", "cyan"), "btn_withdraw": ("p", "gold"),
    "btn_send_ticket": ("p", "violet"), "btn_report": ("p", "red"),
    "btn_delete_account": ("p", "red"), "btn_create_family": ("p", "magenta"),
    "btn_join_family": ("p", "green"), "btn_start_pk": ("p", "magenta"),
    "btn_support_host": ("p", "gold"), "btn_luck_box": ("p", "gold"),
    "btn_games_menu": ("p", "violet"), "btn_invite_play": ("p", "cyan"),
    "btn_broadcast": ("p", "violet"), "btn_block_device": ("p", "red"),
    "btn_approve": ("p", "green"), "btn_reject": ("p", "red"),
    # round action buttons
    "btn_mic_on": ("r", "green"), "btn_mic_off": ("r", "red"),
    "btn_speaker": ("r", "cyan"), "btn_gift_box": ("r", "magenta"),
    "btn_primary": ("p", "magenta"), "btn_secondary": ("p", "violet"),
    "btn_gold": ("p", "gold"), "btn_cyan": ("p", "cyan"),
    "btn_danger": ("p", "red"), "btn_success": ("p", "green"),
    "btn_circle": ("r", "magenta"), "btn_icon_square": ("r", "violet"),
    "btn_small": ("p", "cyan"), "btn_wide": ("p", "magenta"),
    "btn_ghost": ("p", "violet"), "btn_dark": ("p", "violet"),
}

n = 0
for name, (shape, colour) in MAP.items():
    src_stem = f"btn{shape}_{colour}"
    for st in STATES:
        src = os.path.join(B, st, f"{src_stem}.png")
        dst = os.path.join(B, st, f"{name}.png")
        if os.path.exists(src) and not os.path.exists(dst):
            shutil.copyfile(src, dst); n += 1
print(f"named button files created: {n}  (x3 states)")
