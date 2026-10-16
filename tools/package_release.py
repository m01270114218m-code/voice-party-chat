#!/usr/bin/env python3
"""Render README.html and build the final release ZIP for VoiceChat v5."""
import os, re, html, subprocess, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # voicechat_v5
WS = os.path.dirname(ROOT)
OUT = os.path.join(WS, "webpages", "voicechat-showcase_v4")
ZIP = os.path.join(OUT, "voicechat_v5_final.zip")

CSS = """body{margin:0;background:#0a0618;color:#ece9ff;font-family:system-ui,Tahoma,sans-serif;line-height:1.75}
.wrap{max-width:900px;margin:0 auto;padding:32px 20px 80px}
h1,h2,h3{color:#fff;border-bottom:1px solid #2a2050;padding-bottom:6px}
h1{font-size:26px;background:linear-gradient(90deg,#fff,#ffd0ee,#c9b6ff);-webkit-background-clip:text;background-clip:text;color:transparent;border:0}
h2{font-size:20px;margin-top:34px}h3{font-size:16px;border:0}
code{background:#171030;border:1px solid #2a2050;border-radius:6px;padding:2px 6px;direction:ltr;display:inline-block}
pre{background:#120c26;border:1px solid #2a2050;border-radius:12px;padding:14px;overflow:auto;direction:ltr}
pre code{background:none;border:0;padding:0}
table{width:100%;border-collapse:collapse;margin:14px 0;font-size:14px}
th,td{border:1px solid #2a2050;padding:8px 10px;text-align:right}th{background:#171030}
a{color:#ff2fa8}li{margin:3px 0}
.back{display:inline-block;margin-bottom:18px;background:#171030;border:1px solid #2a2050;border-radius:999px;padding:7px 16px;text-decoration:none}"""


def render_readme():
    md = open(os.path.join(ROOT, "README.md"), encoding="utf-8").read()
    out = ['<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8">',
           '<meta name="viewport" content="width=device-width,initial-scale=1">',
           '<title>VoiceChat — دليل التشغيل</title><style>', CSS, '</style></head>',
           '<body><div class="wrap"><a class="back" href="index.html">← مكتبة الأصول</a>']
    in_code, in_table = False, False
    for ln in md.split("\n"):
        if ln.startswith("```"):
            if not in_code:
                out.append("<pre><code>"); in_code = True
            else:
                out.append("</code></pre>"); in_code = False
            continue
        e = html.escape(ln)
        if in_code:
            out.append(e); continue
        if ln.startswith("| "):
            if not in_table:
                out.append("<table>"); in_table = True
            cells = [c.strip() for c in ln.strip("|").split("|")]
            tag = "th" if set("".join(cells)) <= set("-: ") else "td"
            out.append("<tr>" + "".join(f"<{tag}>{html.escape(c)}</{tag}>" for c in cells) + "</tr>")
            continue
        elif in_table:
            out.append("</table>"); in_table = False
        if ln.startswith("### "): out.append(f"<h3>{e[4:]}</h3>")
        elif ln.startswith("## "): out.append(f"<h2>{e[3:]}</h2>")
        elif ln.startswith("# "): out.append(f"<h1>{e[2:]}</h1>")
        elif ln.startswith("- "): out.append(f"<li>{e[2:]}</li>")
        elif re.match(r"^\d+\. ", ln): out.append(f"<li>{e}</li>")
        elif ln.strip() == "": out.append("")
        else:
            s = re.sub(r"`([^`]+)`", lambda m: f"<code>{html.escape(m.group(1))}</code>", e)
            s = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", s)
            out.append(f"<p>{s}</p>")
    if in_table: out.append("</table>")
    if in_code: out.append("</code></pre>")
    out.append('</div></body></html>')
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "README.html"), "w", encoding="utf-8") as f:
        f.write("".join(out))
    print("README.html ->", os.path.join(OUT, "README.html"))


def make_zip():
    if os.path.exists(ZIP):
        os.remove(ZIP)
    # exclude the duplicated app/assets copy to keep the download lean;
    # README §2 documents `cp -r assets app/assets` as the restore step.
    cmd = ["zip", "-rq9", ZIP, ".", "-x", "*/__pycache__/*",
           "assets/qc/*", "app/assets/*", "app/build/*", "app/.dart_tool/*",
           "server/node_modules/*", "*.DS_Store"]
    subprocess.run(cmd, check=True)
    size = os.path.getsize(ZIP) / 1e6
    n = subprocess.run(["unzip", "-l", ZIP], capture_output=True, text=True).stdout.strip().split("\n")[-1].split()[1]
    print(f"ZIP -> {ZIP}  ({size:.1f} MB, {n} files)")


if __name__ == "__main__":
    render_readme()
    make_zip()
