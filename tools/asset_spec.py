#!/usr/bin/env python3
"""
VoiceChat v6 — MASTER ASSET SPEC (single source of truth).

Every asset is generated INDIVIDUALLY (one image per asset, never a sheet).
Style contract (applied to every prompt):
  glossy 3D / glassmorphism, neon magenta-purple-cyan palette, gold accents,
  single centered object, generous even margins, pure flat #FF00FF magenta
  background (chroma-keyed to transparency), no text, no watermark, no border.
"""

# ---------------------------------------------------------------- style block
STYLE = (
    "glossy 3D render, glassmorphism, premium mobile game asset, "
    "vibrant neon magenta purple and cyan palette with gold accents, "
    "soft studio lighting, subtle rim light, high detail, centered single object, "
    "generous even empty margin on all four sides, object fully inside frame, "
    "flat solid pure magenta #FF00FF background, "
    "no text, no letters, no numbers, no watermark, no logo, no border, no frame, "
    "no shadow on background, no other objects, no collage, no grid, no sheet"
)

# ---------------------------------------------------------------- categories
# (category, size, [names])  — name -> prompt fragment
SPEC = {}

# ============================== BRAND =====================================
SPEC["brand"] = {
    "size": (1024, 1024),
    "items": {
        "logo_3d": "app logo emblem: a glossy 3D speech bubble merged with a microphone, neon magenta to purple gradient with cyan glow and gold trim",
        "app_icon": "mobile app icon: rounded squircle tile with a glossy 3D microphone and sound waves, neon magenta purple gradient, gold accents",
        "splash_emblem": "splash screen emblem: a large glossy 3D microphone inside a glowing neon ring with sparkles, magenta purple cyan gradient, gold accents",
        "coin_icon": "a single glossy 3D gold coin with a star embossed, shiny metallic gold, cyan rim light",
        "diamond_icon": "a single glossy 3D faceted diamond gem, cyan and purple crystal, bright sparkle highlights",
        "store_icon_512": "a glossy 3D shopping bag with a gift ribbon, magenta purple gradient with gold accents",
        "banner_recharge": "a wide promotional banner: glossy 3D gold coins and a purple gem pot with neon glow, magenta purple gradient background, empty space on the left for text",
    },
}

# ============================== ICONS =====================================
ICONS = {
    "search": "a magnifying glass",
    "bell": "a notification bell",
    "wallet": "a wallet with a coin",
    "coins": "a stack of gold coins",
    "diamond": "a faceted diamond gem",
    "gift": "a gift box with a ribbon",
    "mic": "a microphone",
    "mic_mute": "a microphone with a diagonal slash",
    "speaker": "a speaker with sound waves",
    "hand_raise": "a raised open hand",
    "close": "an X cross mark",
    "settings": "a gear cog",
    "profile": "a user avatar silhouette in a circle",
    "friends": "two user silhouettes together",
    "messages": "a chat speech bubble",
    "like": "a heart",
    "comment": "a speech bubble with three dots",
    "share": "a share arrow node",
    "plus": "a plus sign",
    "lock": "a padlock",
    "block": "a circle with a diagonal bar",
    "kick": "a boot kicking a small figure",
    "translate": "a globe with two speech bubbles",
    "voice_changer": "a microphone with a magic wand and sparkles",
    "wheel": "a fortune wheel with segments",
    "games": "a game controller",
    "crown": "a royal crown",
    "vip_badge": "a shield badge with a star and a small crown",
    "level_badge": "a hexagonal level badge with a star",
    "home": "a house",
    "room": "a door with sound waves",
    "camera": "a camera",
    "image": "a picture frame with a mountain",
    "send": "a paper plane",
    "emoji": "a smiling face",
    "more": "three horizontal dots",
    "filter": "a funnel filter",
    "check": "a checkmark",
    "star": "a five point star",
    "heart": "a heart",
    "fire": "a flame",
    "trophy": "a trophy cup",
    "medal": "a medal with a ribbon",
    "shield": "a shield",
    "eye": "an eye",
    "edit": "a pencil",
    "logout": "a door with an arrow",
    "refresh": "two circular arrows",
}
SPEC["icons"] = {
    "size": (256, 256),
    "items": {k: f"a single 3D icon of {v}, glossy glass style, neon magenta purple with cyan glow and gold accents" for k, v in ICONS.items()},
}

# ============================== BUTTONS ===================================
# base plates (no icon) — the design-system primitives
BASE_BUTTONS = {
    "primary": "a wide rounded pill button plate, neon magenta to purple gradient, glossy glass, gold rim",
    "secondary": "a wide rounded pill button plate, deep purple glass, cyan rim light",
    "ghost": "a wide rounded pill button plate, translucent frosted glass, thin cyan outline",
    "danger": "a wide rounded pill button plate, red to magenta gradient, glossy glass",
    "success": "a wide rounded pill button plate, teal to cyan gradient, glossy glass",
    "gold": "a wide rounded pill button plate, metallic gold gradient, glossy, purple rim",
}
CIRCLE_BUTTONS = {
    "circle_primary": "a round circular button plate, neon magenta to purple gradient, glossy glass, gold rim",
    "circle_secondary": "a round circular button plate, deep purple glass, cyan rim light",
    "circle_ghost": "a round circular button plate, translucent frosted glass, thin cyan outline",
    "circle_gold": "a round circular button plate, metallic gold gradient, glossy, purple rim",
}
# named action buttons (icon + label-free plate)
ACTION_BUTTONS = {
    "login": "a key",
    "google": "a stylized letter G in a circle",
    "phone": "a mobile phone",
    "otp": "a shield with a checkmark",
    "guest": "a user silhouette with a mask",
    "create_room": "a plus sign inside a room door",
    "launch_room": "a rocket",
    "mic_on": "a microphone",
    "mic_off": "a microphone with a slash",
    "speaker": "a speaker with sound waves",
    "gift_box": "a gift box",
    "send_gift": "a gift box with a paper plane",
    "send_text": "a paper plane",
    "leave_room": "an X cross",
    "edit_profile": "a pencil",
    "wallet": "a wallet with a coin",
    "tool_store": "a shopping bag",
    "logout": "a door with an arrow",
    "buy_pack": "a stack of gold coins with a plus",
    "convert_diamond": "a diamond with two arrows",
    "withdraw": "a hand holding a coin",
    "send_ticket": "a paper plane with a ticket",
    "report": "a warning triangle with an exclamation",
    "delete_account": "a trash bin",
    "create_family": "a shield with a crown",
    "join_family": "a shield with a plus",
    "start_pk": "two crossed swords",
    "support_host": "a heart with a gift",
    "open_luckbox": "a treasure chest",
    "games_menu": "a game controller",
    "invite_play": "two game controllers",
    "convert_coins": "two circular arrows with a coin",
    "broadcast": "a megaphone",
    "block_device": "a phone with a slash",
    "approve": "a checkmark",
    "reject": "an X cross",
}
SPEC["buttons"] = {
    "size": (512, 512),
    "items": {},
}
for k, v in BASE_BUTTONS.items():
    SPEC["buttons"]["items"][f"btn_{k}_normal"] = f"{v}, normal resting state, bright and saturated"
    SPEC["buttons"]["items"][f"btn_{k}_pressed"] = f"{v}, pressed state, slightly darker and inset with a soft inner shadow"
    SPEC["buttons"]["items"][f"btn_{k}_disabled"] = f"{v}, disabled state, desaturated greyed out and flat"
for k, v in CIRCLE_BUTTONS.items():
    SPEC["buttons"]["items"][f"btn_{k}_normal"] = f"{v}, normal resting state, bright and saturated"
    SPEC["buttons"]["items"][f"btn_{k}_pressed"] = f"{v}, pressed state, slightly darker and inset with a soft inner shadow"
    SPEC["buttons"]["items"][f"btn_{k}_disabled"] = f"{v}, disabled state, desaturated greyed out and flat"
for k, v in ACTION_BUTTONS.items():
    SPEC["buttons"]["items"][f"btn_{k}_normal"] = f"a wide rounded pill button plate with a single 3D icon of {v} centered on it, neon magenta to purple gradient, glossy glass, gold rim, normal state"
    SPEC["buttons"]["items"][f"btn_{k}_pressed"] = f"a wide rounded pill button plate with a single 3D icon of {v} centered on it, neon magenta to purple gradient, glossy glass, gold rim, pressed state slightly darker and inset"
    SPEC["buttons"]["items"][f"btn_{k}_disabled"] = f"a wide rounded pill button plate with a single 3D icon of {v} centered on it, desaturated greyed out flat, disabled state"

# ============================== BACKGROUNDS ===============================
SPEC["backgrounds"] = {
    "size": (1080, 1920),
    "items": {
        "bg_home": "mobile app home screen background, dark navy to deep purple gradient with soft neon magenta and cyan glow orbs, subtle bokeh, no objects, no text",
        "bg_login": "mobile app login screen background, dark purple gradient with a large soft neon magenta glow and floating sparkles, no objects, no text",
        "bg_room_city": "voice chat room stage background, night city skyline silhouette with neon magenta and cyan lights, dark purple sky, no text",
        "bg_room_vip": "voice chat room stage background, luxurious dark purple velvet with gold light rays and sparkles, no text",
        "bg_room_party": "voice chat room stage background, vibrant party lights with magenta and cyan beams and confetti bokeh, dark background, no text",
        "bg_profile": "mobile app profile screen background, soft dark purple gradient with a subtle neon glow at the top, no objects, no text",
        "bg_wallet": "mobile app wallet screen background, dark purple gradient with golden light rays and floating coin bokeh, no text",
        "bg_leaderboard": "mobile app leaderboard screen background, dark navy gradient with a golden podium glow and sparkles, no text",
        "bg_neon_1": "abstract neon background, flowing magenta and cyan light ribbons on dark background, no text",
        "bg_celebration": "celebration background, dark purple with golden confetti and fireworks bokeh, no text",
    },
}

# ============================== ROOMS =====================================
SPEC["rooms"] = {
    "size": (512, 512),
    "items": {
        "seat_empty": "a circular glass microphone seat pod, empty, translucent frosted glass with a thin cyan outline and a faint microphone glyph",
        "seat_busy": "a circular glass microphone seat pod, occupied, glowing magenta purple with a bright microphone glyph",
        "seat_locked": "a circular glass microphone seat pod, locked, dark grey glass with a padlock glyph",
        "seat_muted": "a circular glass microphone seat pod, muted, dim purple with a microphone with a slash glyph",
        "host_frame": "an ornate golden circular avatar frame with a crown on top, glossy 3D, gold and magenta",
        "host_frame_vip": "an ornate royal circular avatar frame with a large crown and purple gems, glossy 3D gold and purple",
        "aura_ring": "a glowing circular aura ring, neon magenta to cyan gradient, soft glow, transparent center",
        "speaker_ring": "a glowing circular speaker ring with animated sound wave arcs, cyan and magenta neon",
        "voice_waveform": "a horizontal audio waveform bar of glowing vertical bars, magenta to cyan gradient",
        "hand_badge": "a small glossy 3D raised hand badge with a number one, gold and magenta",
        "mic_btn": "a glossy 3D microphone button, magenta purple gradient, gold rim",
        "chat_btn": "a glossy 3D chat bubble button, cyan purple gradient",
        "gift_btn": "a glossy 3D gift box button, magenta gold gradient",
        "coin_pouch": "a glossy 3D pouch overflowing with gold coins",
        "family_frame": "a circular avatar frame with a family crest shield, gold and purple",
        "stage_platform": "a semi circular glowing stage platform, dark glass with neon magenta edge light",
        "room_card_frame": "a rounded rectangular room card frame, glassmorphism with a neon magenta border",
        "room_live_badge": "a small glossy LIVE badge pill, red to magenta gradient with a glowing dot",
        "room_lock_badge": "a small glossy padlock badge pill, purple glass",
    },
}

# ============================== GIFTS =====================================
GIFTS_COMMON = {
    "rose": "a single red rose", "heart": "a glossy red heart", "chocolate": "a box of chocolates",
    "teddy": "a cute teddy bear", "balloon": "a bunch of colorful balloons", "cake": "a birthday cake",
    "coffee": "a cup of coffee", "perfume": "an elegant perfume bottle", "ring": "a diamond ring",
    "watch": "a luxury gold watch", "guitar": "a golden guitar", "microphone": "a golden microphone",
    "crown": "a jeweled crown", "castle": "a fantasy castle", "yacht": "a luxury yacht",
    "car": "a luxury sports car", "plane": "a private jet", "rocket": "a golden rocket",
    "dragon": "a cute baby dragon", "lion": "a majestic lion", "peacock": "a peacock",
    "whale": "a cosmic whale", "galaxy": "a galaxy orb", "firework": "a firework burst",
    "genie": "a magic genie lamp", "turtle": "a golden turtle", "cat": "a lucky cat",
    "unicorn": "a unicorn", "phoenix": "a phoenix", "diamond_gem": "a giant diamond gem",
    "treasure": "a treasure chest", "mystery_box": "a mystery gift box", "red_envelope": "a red envelope",
    "star_shower": "a shower of golden stars", "angel_wings": "a pair of angel wings",
    "hot_air_balloon": "a hot air balloon", "crystal_ball": "a crystal ball",
    "golden_key": "a golden key", "horseshoe": "a lucky horseshoe", "clover": "a four leaf clover",
    "lucky_coin": "a giant lucky coin", "wish_lamp": "a wishing lamp",
}
SPEC["gifts"] = {
    "size": (512, 512),
    "items": {k: f"a single glossy 3D gift item: {v}, premium game gift asset, neon magenta purple with gold accents, sparkles" for k, v in GIFTS_COMMON.items()},
}

# ============================== GAMES =====================================
SPEC["games"] = {
    "size": (512, 512),
    "items": {
        "ludo_board": "a glossy 3D ludo board game, square board with four colored home areas, top down view",
        "ludo_dice": "a glossy 3D white dice with black pips",
        "ludo_pawn": "a glossy 3D ludo pawn token, red",
        "ludo_tokens": "a set of four glossy 3D ludo tokens in red green yellow blue",
        "domino": "a glossy 3D domino tile with white pips",
        "domino_tile": "a single glossy 3D domino tile, ivory with black pips",
        "uno_card": "a glossy 3D uno style playing card, red with a large oval",
        "uno_deck": "a fanned deck of glossy 3D colorful playing cards",
        "wheel": "a glossy 3D fortune wheel with colorful segments and a golden pointer",
        "wheel_pointer": "a glossy 3D golden wheel pointer arrow",
        "game_coins": "a pile of glossy 3D gold game coins",
        "game_trophy": "a glossy 3D golden trophy cup",
        "game_controller": "a glossy 3D game controller, magenta and cyan",
        "game_dice_pair": "two glossy 3D dice, one red one blue",
    },
}

# ============================== VIP =======================================
SPEC["vip"] = {
    "size": (512, 512),
    "items": {
        "vip_car": "a glossy 3D luxury sports car, gold and magenta, side view",
        "vip_limo": "a glossy 3D stretch limousine, black and gold",
        "vip_boat": "a glossy 3D luxury yacht, white and gold",
        "vip_plane": "a glossy 3D private jet, white and gold",
        "vip_lion": "a majestic 3D lion with a golden mane, walking pose",
        "vip_peacock": "a 3D peacock with iridescent purple and cyan feathers",
        "vip_carpet": "a 3D magic flying carpet, purple and gold",
        "vip_dragon": "a 3D golden dragon, flying pose",
        "royal_crown": "a large ornate 3D royal crown with purple gems and gold",
        "vip_badge_gem": "a glossy 3D VIP badge with a purple gem and gold wings",
        "vip_entry_effect": "a burst of golden light rays and sparkles for a VIP entrance effect",
    },
}

# ============================== FRAMES ====================================
SPEC["frames"] = {
    "size": (512, 512),
    "items": {
        "frame_gold": "an ornate circular avatar frame, metallic gold, glossy 3D",
        "frame_silver": "an ornate circular avatar frame, polished silver, glossy 3D",
        "frame_bronze": "an ornate circular avatar frame, bronze, glossy 3D",
        "frame_fire": "a circular avatar frame made of flames, orange and red glow",
        "frame_ice": "a circular avatar frame made of ice crystals, cyan and white",
        "frame_galaxy": "a circular avatar frame with a galaxy nebula, purple and cyan stars",
        "frame_neon": "a circular avatar frame of neon light tubes, magenta and cyan",
        "frame_diamond": "a circular avatar frame encrusted with diamonds, sparkling",
        "frame_flower": "a circular avatar frame of pink flowers and leaves",
        "frame_angel": "a circular avatar frame with white angel wings",
        "frame_dragon": "a circular avatar frame with a golden dragon coiling around it",
        "frame_royal": "a circular avatar frame with a crown and purple velvet, gold trim",
        "frame_cyber": "a circular avatar frame with a cyberpunk circuit pattern, cyan and magenta",
    },
}

# ============================== BUBBLES ===================================
SPEC["bubbles"] = {
    "size": (512, 512),
    "items": {
        "bubble_in": "a chat message bubble pointing left, glassmorphism purple, rounded",
        "bubble_out": "a chat message bubble pointing right, neon magenta gradient, rounded",
        "bubble_gift": "a chat message bubble with a small gift icon, gold and magenta",
        "bubble_system": "a chat message bubble for system notices, translucent grey glass",
        "bubble_voice": "a chat message bubble with a small waveform, cyan glass",
        "bubble_danmaku": "a long horizontal floating message banner, translucent magenta glass with gold trim",
    },
}

# ============================== FAMILY ====================================
SPEC["family"] = {
    "size": (512, 512),
    "items": {
        "crest_lion": "a heraldic family crest shield with a lion head, gold and purple",
        "crest_eagle": "a heraldic family crest shield with an eagle, gold and cyan",
        "crest_wolf": "a heraldic family crest shield with a wolf head, silver and purple",
        "crest_dragon": "a heraldic family crest shield with a dragon, gold and magenta",
        "crest_phoenix": "a heraldic family crest shield with a phoenix, orange and gold",
        "badge_crown": "a small glossy 3D crown badge, gold",
        "badge_star": "a small glossy 3D star badge, gold and magenta",
        "badge_flame": "a small glossy 3D flame badge, orange and red",
        "badge_gem": "a small glossy 3D gem badge, purple and cyan",
    },
}

# ============================== PK ========================================
SPEC["pk"] = {
    "size": (512, 512),
    "items": {
        "pk_progress_bar": "a horizontal versus progress bar, red on the left and blue on the right with a golden divider",
        "pk_bar_red": "a horizontal red team progress bar segment, glossy",
        "pk_bar_blue": "a horizontal blue team progress bar segment, glossy",
        "pk_victory": "a golden victory laurel wreath with a star, glossy 3D",
        "pk_defeat": "a cracked grey shield with a broken sword, glossy 3D",
        "tomato": "a glossy 3D red tomato",
        "egg": "a glossy 3D white egg",
        "splat_red": "a red paint splat",
        "splat_blue": "a blue paint splat",
        "pk_swords": "two crossed swords, gold and silver, glossy 3D",
        "pk_timer": "a glossy 3D stopwatch with a golden rim",
    },
}

# ============================== LUCKBOX ===================================
SPEC["luckbox"] = {
    "size": (512, 512),
    "items": {
        "luckbox_closed": "a glossy 3D treasure chest closed with a golden lock, purple and gold",
        "luckbox_open": "a glossy 3D treasure chest open bursting with gold coins and gems",
        "luckbox_timer": "a glossy 3D countdown timer dial, gold and magenta",
        "lucky_envelope": "a glossy 3D red envelope with a golden pattern",
        "golden_key": "a glossy 3D golden key with a gem",
        "coin_stack": "a tall stack of glossy 3D gold coins",
        "big_diamond": "a large glossy 3D diamond gem, cyan and purple",
        "horseshoe_clover": "a lucky horseshoe with a four leaf clover, gold and green",
        "mystery_gift": "a glossy 3D mystery gift box with a question mark",
        "jackpot_star": "a large glossy 3D golden star with a jackpot glow",
        "envelope_open": "a glossy 3D red envelope open with gold coins flying out",
    },
}

# ============================== UI ========================================
SPEC["ui"] = {
    "size": (512, 512),
    "items": {
        "input_field": "a rounded rectangular text input field, glassmorphism dark purple, thin cyan outline",
        "input_focused": "a rounded rectangular text input field, glassmorphism, glowing magenta outline",
        "input_error": "a rounded rectangular text input field, glassmorphism, glowing red outline",
        "card_glass": "a rounded rectangular glassmorphism card panel, translucent purple with a soft neon edge",
        "dialog_card": "a rounded rectangular modal dialog panel, glassmorphism purple with a gold top trim",
        "sheet_handle": "a small horizontal rounded grab handle bar, translucent white",
        "tab_active": "a rounded tab pill, active state, neon magenta gradient with a glow",
        "tab_inactive": "a rounded tab pill, inactive state, translucent dark glass",
        "progress_bar": "a horizontal progress bar track with a magenta to cyan gradient fill",
        "loading_ring": "a circular loading spinner ring, magenta to cyan gradient, glowing",
        "toast_success": "a rounded toast notification panel with a green checkmark, glassmorphism",
        "toast_error": "a rounded toast notification panel with a red exclamation, glassmorphism",
        "status_online": "a small glossy green dot status indicator with a glow",
        "status_offline": "a small glossy grey dot status indicator",
        "status_in_room": "a small glossy blue dot status indicator with a glow",
        "badge_count": "a small red circular notification count badge",
        "divider": "a thin horizontal glowing divider line, magenta to cyan gradient",
        "checkbox_on": "a rounded square checkbox, checked, magenta gradient with a white check",
        "checkbox_off": "a rounded square checkbox, unchecked, translucent glass with a cyan outline",
        "switch_on": "a rounded toggle switch, on, magenta gradient",
        "switch_off": "a rounded toggle switch, off, grey glass",
    },
}

# ============================== EFFECTS ===================================
SPEC["effects"] = {
    "size": (512, 512),
    "items": {
        "coin_burst": "a burst of gold coins flying outward, radial",
        "confetti_burst": "a burst of colorful confetti, radial",
        "heart_burst": "a burst of pink hearts, radial",
        "star_burst": "a burst of golden stars, radial",
        "sparkle_burst": "a burst of white and cyan sparkles, radial",
        "ring_shockwave": "a glowing circular shockwave ring, magenta to cyan",
        "light_orb": "a glowing spherical light orb, magenta and cyan",
        "smoke_puff": "a soft purple smoke puff cloud",
        "glow_flare": "a horizontal lens flare glow, cyan and magenta",
        "magic_circle": "a glowing magic circle rune, purple and gold",
        "lightning": "a stylized neon lightning bolt, cyan",
        "bubble_pop": "a glossy bubble popping with droplets, cyan",
    },
}

# ============================== AVATARS ===================================
SPEC["avatars"] = {
    "size": (512, 512),
    "items": {
        "avatar_1": "a 3D cartoon avatar portrait of a young woman with long dark hair, friendly smile, stylized game character",
        "avatar_2": "a 3D cartoon avatar portrait of a young man with short hair and a beard, friendly smile, stylized game character",
        "avatar_3": "a 3D cartoon avatar portrait of a woman with a hijab, friendly smile, stylized game character",
        "avatar_4": "a 3D cartoon avatar portrait of a man wearing a cap and headphones, stylized game character",
        "avatar_5": "a 3D cartoon avatar portrait of a cute cat character, stylized game character",
        "avatar_6": "a 3D cartoon avatar portrait of a cute robot character, cyan and magenta, stylized game character",
        "avatar_7": "a 3D cartoon avatar portrait of a young woman with curly hair and glasses, stylized game character",
        "avatar_8": "a 3D cartoon avatar portrait of a man with sunglasses, stylized game character",
    },
}

# ---------------------------------------------------------------- helpers
def all_items():
    """Yield (category, name, prompt, size) for every asset."""
    for cat, spec in SPEC.items():
        for name, frag in spec["items"].items():
            yield cat, name, f"{frag}, {STYLE}", spec["size"]

def counts():
    return {cat: len(spec["items"]) for cat, spec in SPEC.items()}

if __name__ == "__main__":
    c = counts()
    for k, v in c.items():
        print(f"{k:14s} {v}")
    print("-" * 24)
    print(f"{'TOTAL':14s} {sum(c.values())}")
