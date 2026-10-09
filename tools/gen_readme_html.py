#!/usr/bin/env python3
"""Render README.md into a styled README.html for the showcase page."""
import os, re, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "README.md")
OUT = os.path.join(ROOT, "webpages", "voicechat-showcase_v5", "README.html")

md = open(SRC).read()


def inline(t):
    t = html.escape(t)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', t)
    return t


out, in_code, in_table = [], False, False
for line in md.split("\n"):
    if line.startswith("```"):
        out.append("</pre>" if in_code else "<pre>")
        in_code = not in_code
        continue
    if in_code:
        out.append(html.escape(line))
        continue
    if line.startswith("|"):
        cells = [c.strip() for c in line.strip("|").split("|")]
        if set("".join(cells)) <= set("-: "):
            continue
        if not in_table:
            out.append("<table>")
            in_table = True
        tag = "th" if not any("<table>" in o for o in out[-3:]) and out[-1] == "<table>" else "td"
        out.append("<tr>" + "".join(f"<{tag}>{inline(c)}</{tag}>" for c in cells) + "</tr>")
        continue
    if in_table:
        out.append("</table>")
        in_table = False
    if line.startswith("### "):
        out.append(f"<h3>{inline(line[4:])}</h3>")
    elif line.startswith("## "):
        out.append(f"<h2>{inline(line[3:])}</h2>")
    elif line.startswith("# "):
        out.append(f"<h1>{inline(line[2:])}</h1>")
    elif line.startswith("> "):
        out.append(f"<blockquote>{inline(line[2:])}</blockquote>")
    elif line.startswith("- "):
        out.append(f"<li>{inline(line[2:])}</li>")
    elif re.match(r"^\d+\. ", line):
        out.append(f"<li>{inline(re.sub(r'^[0-9]+. ', '', line))}</li>")
    elif line.strip() == "":
        out.append("")
    else:
        out.append(f"<p>{inline(line)}</p>")
if in_table:
    out.append("</table>")
if in_code:
    out.append("</pre>")

body = "\n".join(out)
page = f'''<!DOCTYPE html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>VoiceChat v6 — دليل التشغيل والبناء</title>
<style>
 body {{ margin:0; background:#0b0714; color:#efe9ff;
   font-family:"Segoe UI",Tahoma,system-ui,sans-serif; line-height:1.9; }}
 .wrap {{ max-width:900px; margin:0 auto; padding:40px 24px 80px; }}
 h1 {{ font-size:32px; background:linear-gradient(90deg,#ff2fb0,#22d3ee);
   -webkit-background-clip:text; background-clip:text; color:transparent; }}
 h2 {{ margin-top:38px; border-bottom:1px solid #2a1f45; padding-bottom:8px; color:#ffc93c; }}
 h3 {{ color:#22d3ee; }}
 code {{ background:#1b1330; border:1px solid #2a1f45; border-radius:6px; padding:2px 6px;
   font-family:ui-monospace,Menlo,monospace; font-size:13px; color:#ffd9f2; }}
 pre {{ background:#120c22; border:1px solid #2a1f45; border-radius:12px; padding:16px;
   overflow:auto; direction:ltr; text-align:left; }}
 pre code {{ background:none; border:none; padding:0; }}
 table {{ width:100%; border-collapse:collapse; margin:16px 0; font-size:14px; }}
 th,td {{ border:1px solid #2a1f45; padding:8px 12px; text-align:right; }}
 th {{ background:#1b1330; color:#ffc93c; }}
 blockquote {{ border-right:4px solid #ff2fb0; background:#171029; margin:16px 0;
   padding:12px 18px; border-radius:0 12px 12px 0; color:#cbbdf0; }}
 a {{ color:#22d3ee; }}
 li {{ margin:4px 0; }}
 .back {{ display:inline-block; margin-bottom:20px; text-decoration:none; color:#fff;
   background:linear-gradient(90deg,#ff2fb0,#8b3dff); padding:10px 18px; border-radius:10px; }}
</style></head><body><div class="wrap">
<a class="back" href="index.html">← رجوع إلى معرض الأصول</a>
{body}
</div></body></html>'''

open(OUT, "w").write(page)
print("wrote", OUT, len(page), "bytes")
