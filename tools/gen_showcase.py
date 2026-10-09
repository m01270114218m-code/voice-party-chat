#!/usr/bin/env python3
"""Generate the interactive asset showcase webpage from assets_manifest.json."""
import os, json, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "webpages", "voicechat-showcase_v5")
os.makedirs(OUT_DIR, exist_ok=True)

m = json.load(open(os.path.join(ROOT, "assets_manifest.json")))
cov = json.load(open(os.path.join(ROOT, "coverage_report.json")))

CAT_AR = {
    "brand": "الهوية والشعار", "icons": "أيقونات الواجهة", "buttons": "الأزرار (3 حالات)",
    "backgrounds": "خلفيات الشاشات", "rooms": "أصول الغرفة الصوتية", "gifts": "الهدايا",
    "games": "الألعاب المصغرة", "vip": "تنبيهات VIP", "frames": "إطارات البروفايل",
    "bubbles": "فقاعات الدردشة", "family": "العائلات والقبائل", "pk": "تحديات PK",
    "luckbox": "صندوق الحظ", "ui": "عناصر الواجهة", "effects": "المؤثرات", "avatars": "الأفاتارات",
}
CAT_ICON = {
    "brand": "💎", "icons": "🔷", "buttons": "🔘", "backgrounds": "🌌", "rooms": "🎙️",
    "gifts": "🎁", "games": "🎲", "vip": "👑", "frames": "🖼️", "bubbles": "💬",
    "family": "🛡️", "pk": "⚔️", "luckbox": "🎰", "ui": "🧩", "effects": "✨", "avatars": "🧑",
}

cards = []
for cat in sorted(m["categories"], key=lambda c: -m["categories"][c]["count"]):
    c = m["categories"][cat]
    if not c["items"]:
        continue
    tiles = []
    for it in c["items"]:
        tiles.append(
            f'<figure class="tile"><img loading="lazy" src="{it["url"]}" alt="{html.escape(it["name"])}">'
            f'<figcaption>{html.escape(it["name"])}</figcaption></figure>'
        )
    cards.append(f'''
    <section class="cat" id="{cat}">
      <h2><span class="ci">{CAT_ICON.get(cat,"📦")}</span> {CAT_AR.get(cat,cat)}
        <span class="badge">{c["count"]}</span></h2>
      <p class="usage">{html.escape(c["usage"])}</p>
      <div class="grid">{"".join(tiles)}</div>
    </section>''')

nav = "".join(
    f'<a href="#{cat}">{CAT_ICON.get(cat,"📦")} {CAT_AR.get(cat,cat)} <b>{m["categories"][cat]["count"]}</b></a>'
    for cat in sorted(m["categories"], key=lambda c: -m["categories"][c]["count"])
    if m["categories"][cat]["items"]
)

SITE = "https://static.teamily.ai/sites/da89b665-c5e0-4d9c-a857-d61bcea39549"

page = f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>VoiceChat — مكتبة الأصول v6</title>
<style>
  :root {{
    --mag:#ff2fb0; --pur:#8b3dff; --cyan:#22d3ee; --gold:#ffc93c;
    --bg:#0b0714; --card:#171029; --line:#2a1f45; --txt:#efe9ff; --dim:#a99cc9;
  }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; background:radial-gradient(1200px 600px at 80% -10%, #2a0f4d 0%, var(--bg) 55%);
    color:var(--txt); font-family:"Segoe UI",Tahoma,system-ui,sans-serif; }}
  header {{ padding:48px 24px 28px; text-align:center; }}
  .logo {{ width:120px; height:120px; object-fit:contain; filter:drop-shadow(0 0 26px var(--mag)); }}
  h1 {{ margin:14px 0 6px; font-size:34px; background:linear-gradient(90deg,var(--mag),var(--cyan));
    -webkit-background-clip:text; background-clip:text; color:transparent; }}
  .sub {{ color:var(--dim); max-width:760px; margin:0 auto; line-height:1.8; }}
  .stats {{ display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin:26px 0 8px; }}
  .stat {{ background:var(--card); border:1px solid var(--line); border-radius:16px; padding:14px 22px; min-width:130px; }}
  .stat b {{ display:block; font-size:26px; color:var(--gold); }}
  .stat span {{ color:var(--dim); font-size:13px; }}
  .ok {{ color:#4ade80; }}
  nav {{ position:sticky; top:0; z-index:9; background:rgba(11,7,20,.92); backdrop-filter:blur(10px);
    border-bottom:1px solid var(--line); padding:12px; display:flex; gap:8px; overflow-x:auto; }}
  nav a {{ white-space:nowrap; text-decoration:none; color:var(--txt); background:var(--card);
    border:1px solid var(--line); border-radius:999px; padding:8px 14px; font-size:13px; }}
  nav a b {{ color:var(--gold); }}
  main {{ max-width:1280px; margin:0 auto; padding:24px; }}
  .cat {{ margin:38px 0; }}
  .cat h2 {{ font-size:22px; display:flex; align-items:center; gap:10px; margin:0 0 4px; }}
  .ci {{ font-size:24px; }}
  .badge {{ background:linear-gradient(90deg,var(--mag),var(--pur)); border-radius:999px;
    padding:2px 12px; font-size:13px; }}
  .usage {{ color:var(--dim); font-size:13px; margin:0 0 16px; }}
  .grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); gap:12px; }}
  .tile {{ margin:0; background:var(--card); border:1px solid var(--line); border-radius:14px;
    padding:10px; text-align:center; transition:.18s; }}
  .tile:hover {{ transform:translateY(-3px); border-color:var(--mag); box-shadow:0 8px 26px rgba(255,47,176,.22); }}
  .tile img {{ width:100%; height:96px; object-fit:contain;
    background:repeating-conic-gradient(#241a3d 0% 25%, #1b1330 0% 50%) 50%/16px 16px; border-radius:10px; }}
  .tile figcaption {{ font-size:11px; color:var(--dim); margin-top:8px; word-break:break-all; }}
  .links {{ display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin:30px 0; }}
  .links a {{ text-decoration:none; color:#fff; background:linear-gradient(90deg,var(--mag),var(--pur));
    padding:12px 22px; border-radius:12px; font-weight:600; }}
  .links a.alt {{ background:linear-gradient(90deg,var(--cyan),var(--pur)); }}
  footer {{ text-align:center; color:var(--dim); padding:40px 20px; font-size:13px; }}
</style>
</head>
<body>
<header>
  <img class="logo" src="{SITE}/images/logo_3d/logo_3d.png" alt="VoiceChat">
  <h1>VoiceChat — مكتبة الأصول الكاملة</h1>
  <p class="sub">كل أصل مولّد <b>على حدة</b> (صورة واحدة لكل أصل — بدون أوراق مجمّعة وبدون قصّ)،
  بخلفية شفافة، بهوامش متساوية، وبأسلوب 3D لامع موحّد (ماجنتا/بنفسجي/سماوي + ذهبي).</p>
  <div class="stats">
    <div class="stat"><b>{cov["required"]}</b><span>المطلوب</span></div>
    <div class="stat"><b class="ok">{cov["found"]}</b><span>الموجود</span></div>
    <div class="stat"><b class="ok">{len(cov["missing"])}</b><span>الناقص</span></div>
    <div class="stat"><b class="ok">{len(cov["extra"])}</b><span>الزائد</span></div>
    <div class="stat"><b>16</b><span>فئة</span></div>
  </div>
  <div class="links">
    <a href="{SITE}/webpages/voicechat-showcase_v5/voicechat_v6_final.zip">⬇️ تحميل الحزمة الكاملة (ZIP)</a>
    <a class="alt" href="{SITE}/webpages/voicechat-showcase_v5/README.html">📘 دليل التشغيل والبناء</a>
    <a class="alt" href="{SITE}/documents/voicechat_v6/assets_manifest.json">📄 المانيفست (JSON)</a>
    <a class="alt" href="{SITE}/documents/voicechat_v6/SVGA_GUIDE.md">🎬 دليل SVGA</a>
  </div>
</header>
<nav>{nav}</nav>
<main>{"".join(cards)}</main>
<footer>VoiceChat v6 · 380 أصل · مولّدة فردياً · أسلوب 3D لامع موحّد</footer>
</body>
</html>'''

with open(os.path.join(OUT_DIR, "index.html"), "w") as fh:
    fh.write(page)
print("wrote", os.path.join(OUT_DIR, "index.html"), len(page), "bytes")
