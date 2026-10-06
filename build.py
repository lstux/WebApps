#!/usr/bin/env python3
"""Construit le dossier dist/ à partir de code/.

  python3 build.py                 copie code/ dans dist/ et génère dist/index.html
  python3 build.py --standalone    chaque page HTML de code/ est écrite dans dist/
                                   avec sa feuille de style locale (common.css)
                                   insérée dans un <style> : une page = un fichier

Python 3.8+, bibliothèque standard uniquement.
"""
import argparse
import html
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LINK_RE = re.compile(r"<link\b[^>]*>", re.I)
ATTR_RE = re.compile(r"""([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')""")
TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.I | re.S)
META_DESC_RE = re.compile(r"""<meta\b[^>]*\bname\s*=\s*["']description["'][^>]*>""", re.I)
SCRIPT_RE = re.compile(r"<script\b.*?</script\s*>", re.I | re.S)


def attrs(tag):
    return {m.group(1).lower(): html.unescape(m.group(2) if m.group(2) is not None else m.group(3)) for m in ATTR_RE.finditer(tag)}


def is_local(href):
    return bool(href) and not re.match(r"^([a-z][a-z0-9+.-]*:|//|#)", href, re.I)


def inline_css(page, source_root):
    """Remplace chaque <link rel="stylesheet" href="local.css"> par un <style>."""
    text = page.read_text(encoding="utf-8")

    def repl(m):
        a = attrs(m.group(0))
        rels = a.get("rel", "").lower().split()
        href = a.get("href", "")
        if "stylesheet" not in rels or not is_local(href):
            return m.group(0)
        css_path = (page.parent / href.split("?")[0].split("#")[0]).resolve()
        try:
            css_path.relative_to(source_root)
        except ValueError:
            sys.exit(f"{page.relative_to(source_root)} : {href} sort du dossier {source_root.name}/")
        if not css_path.is_file():
            sys.exit(f"{page.relative_to(source_root)} : feuille de style introuvable : {href}")
        css = css_path.read_text(encoding="utf-8").strip()
        if re.search(r"</style", css, re.I):
            sys.exit(f"{href} contient « </style » : insertion impossible")
        media = f' media="{html.escape(a["media"])}"' if a.get("media") else ""
        return f"<style{media}>\n/* {css_path.name} */\n{css}\n</style>"

    # Les <script> sont laissés tels quels : le JavaScript peut contenir du HTML sous forme de texte
    # (par exemple le code généré par le gestionnaire de cartes).
    out, pos = [], 0
    for m in SCRIPT_RE.finditer(text):
        out.append(LINK_RE.sub(repl, text[pos:m.start()]))
        out.append(m.group(0))
        pos = m.end()
    out.append(LINK_RE.sub(repl, text[pos:]))
    return "".join(out)


def page_info(page):
    text = page.read_text(encoding="utf-8")
    text = text.split("</head>", 1)[0]  # titre et description : dans l'en-tête seulement
    t = TITLE_RE.search(text)
    title = html.unescape(re.sub(r"\s+", " ", t.group(1)).strip()) if t else page.stem
    d = META_DESC_RE.search(text)
    desc = attrs(d.group(0)).get("content", "").strip() if d else ""
    return title, desc


INDEX = """<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>WebApps</title>
<meta name="description" content="Petits outils autonomes : une page HTML, pas de serveur.">
<link rel="stylesheet" href="common.css">
<style>
main {{ max-width: 720px; margin: 0 auto; padding: 14px 12px calc(28px + env(safe-area-inset-bottom,0px)); }}
.tools {{ display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }}
.tool {{ display: block; margin: 0; color: inherit; text-decoration: none; transition: transform .12s, border-color .12s; }}
.tool:hover {{ border-color: var(--ac); }}
.tool:active {{ transform: scale(.98); }}
.tool h2 {{ margin: 0 0 4px; font-size: 18px; }}
.tool p {{ margin: 0; color: var(--mut); font-size: 14px; }}
.tool .path {{ margin-top: 8px; font: 12px var(--f-mono); color: var(--mut2); }}
</style>
</head>
<body>
<header class="topbar">
  <div class="topbar-in">
    <div class="grow">
      <h1 class="brand">WebApps</h1>
      <div class="subtitle">{count}</div>
    </div>
  </div>
</header>
<main>
  <div class="tools">
{cards}
  </div>
</main>
</body>
</html>
"""
CARD = """    <a class="card tool" href="{href}">
      <h2>{title}</h2>
{desc}      <div class="path">{path}</div>
    </a>"""


def build_index(out, tools):
    cards = []
    for rel, title, desc in tools:
        href = html.escape(rel.as_posix().replace(" ", "%20"), quote=True)
        d = f"      <p>{html.escape(desc)}</p>\n" if desc else ""
        cards.append(CARD.format(href=href, title=html.escape(title), desc=d, path=html.escape(rel.as_posix())))
    n = len(tools)
    page = INDEX.format(count=f"{n} outil{'s' if n > 1 else ''}", cards="\n".join(cards))
    (out / "index.html").write_text(page, encoding="utf-8")


def clean(out, source):
    if out == source or out in source.parents or out == ROOT or out in ROOT.parents:
        sys.exit(f"Dossier de sortie refusé : {out}")
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)


def main():
    ap = argparse.ArgumentParser(description="Construit dist/ à partir de code/.")
    ap.add_argument("--standalone", action="store_true",
                    help="une page HTML par outil, common.css inséré dans la page (pas d'index)")
    ap.add_argument("--src", default="code", help="dossier des sources (défaut : code)")
    ap.add_argument("--out", default="dist", help="dossier de sortie (défaut : dist)")
    args = ap.parse_args()

    source = (ROOT / args.src).resolve()
    out = (ROOT / args.out).resolve()
    if not source.is_dir():
        sys.exit(f"Dossier introuvable : {source}")
    pages = sorted(p for p in source.rglob("*.html") if p.is_file())
    if not pages:
        sys.exit(f"Aucune page .html dans {source}")
    if not args.standalone and any(p.relative_to(source).as_posix() == "index.html" for p in pages):
        sys.exit("code/index.html existe déjà : il serait écrasé par l'index généré.")
    clean(out, source)

    if args.standalone:
        for p in pages:
            rel = p.relative_to(source)
            dest = out / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(inline_css(p, source), encoding="utf-8")
            print(f"  {rel}")
        print(f"{len(pages)} page(s) autonome(s) dans {out.relative_to(ROOT)}/")
    else:
        shutil.copytree(source, out, dirs_exist_ok=True)
        tools = []
        for p in pages:
            title, desc = page_info(p)
            tools.append((p.relative_to(source), title, desc))
        tools.sort(key=lambda t: t[1].casefold())
        build_index(out, tools)
        print(f"{len(pages)} outil(s) copié(s) dans {out.relative_to(ROOT)}/ + index.html")


if __name__ == "__main__":
    main()
