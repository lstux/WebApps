#!/usr/bin/env python3
"""Construit le dossier dist/ à partir de code/.

  python3 build.py                 copie code/ dans dist/ et génère dist/index.html
  python3 build.py --standalone    chaque page HTML de code/ est écrite dans dist/
                                   avec sa feuille de style locale (common.css)
                                   insérée dans un <style> : une page = un fichier
  python3 build.py --pwa           comme le premier, et dist/ devient une application
                                   installable : manifest, service worker (hors ligne)
                                   et icônes générées. Incompatible avec --standalone.

Python 3.8+, bibliothèque standard uniquement.
"""
import argparse
import hashlib
import html
import json
import math
import re
import shutil
import struct
import sys
import zlib
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
LINK_RE = re.compile(r"<link\b[^>]*>", re.I)
ATTR_RE = re.compile(r"""([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')""")
TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.I | re.S)
META_DESC_RE = re.compile(r"""<meta\b[^>]*\bname\s*=\s*["']description["'][^>]*>""", re.I)
SCRIPT_RE = re.compile(r"<script\b.*?</script\s*>", re.I | re.S)
HEAD_END_RE = re.compile(r"</head\s*>", re.I)

APP_NAME = "WebApps"
APP_DESC = "Petits outils autonomes : une page HTML, pas de serveur."


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
<title>{app_name}</title>
<meta name="description" content="{app_desc}">
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
      <h1 class="brand">{app_name}</h1>
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
    page = INDEX.format(app_name=APP_NAME, app_desc=html.escape(APP_DESC, quote=True), count=f"{n} outil{'s' if n > 1 else ''}", cards="\n".join(cards))
    (out / "index.html").write_text(page, encoding="utf-8")


# --------------------------------------------------------------------------- PWA

SW_TEMPLATE = r"""/* sw.js : généré par build.py, ne pas modifier à la main. */
const VERSION = "__VERSION__";
const CACHE = "webapps-" + VERSION;        /* pages et fichiers du site : change à chaque build */
const LIBS = "webapps-libs";               /* bibliothèques et polices des CDN : conservé d'un build à l'autre */
const PRECACHE = __PRECACHE__;
const LIB_HOSTS = ["cdnjs.cloudflare.com", "unpkg.com", "fonts.googleapis.com", "fonts.gstatic.com"];
const NETWORK_TIMEOUT = 4000;

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE.map((u) => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("webapps-") && k !== CACHE && k !== LIBS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const store = (cache, key, res) => { if (res.status === 200) cache.then((c) => c.put(key, res.clone())).catch(() => {}); return res; };

/* Pages : réseau d'abord (pour voir les mises à jour), cache si le réseau est absent ou trop lent. */
function pages(req) {
  const net = fetch(req).then((res) => store(caches.open(CACHE), req, res));
  const slow = new Promise((_, no) => setTimeout(no, NETWORK_TIMEOUT));
  return Promise.race([net, slow]).catch(() =>
    caches.match(req, { ignoreSearch: true })
      .then((hit) => hit || (req.mode === "navigate" ? caches.match(new URL("./", self.registration.scope).href) : null) || net)
  );
}

/* Autres fichiers du site : cache d'abord, remis à jour en arrière-plan. */
function files(req) {
  return caches.match(req, { ignoreSearch: true }).then((hit) => {
    const net = fetch(req).then((res) => store(caches.open(CACHE), req, res));
    if (hit) { net.catch(() => {}); return hit; }
    return net;
  });
}

/* Bibliothèques et polices des CDN : mêmes règles, relues en mode CORS pour ne pas stocker de réponse opaque. */
function libs(req) {
  return caches.open(LIBS).then((cache) =>
    cache.match(req.url).then((hit) => {
      const net = fetch(req.url, { mode: "cors", credentials: "omit" }).then((res) => store(Promise.resolve(cache), req.url, res));
      if (hit) { net.catch(() => {}); return hit; }
      return net;
    })
  );
}

/* Tout le reste (tuiles de carte, taux de change, recherche de lieu…) : réseau seul, volontairement non intercepté. */
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    const html = req.mode === "navigate" || req.destination === "document" || (req.headers.get("accept") || "").includes("text/html");
    e.respondWith(html ? pages(req) : files(req));
  } else if (LIB_HOSTS.includes(url.hostname)) {
    e.respondWith(libs(req));
  }
});
"""


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def css_colors(source):
    css_file = source / "common.css"
    css = css_file.read_text(encoding="utf-8") if css_file.is_file() else ""

    def first(name, default):
        m = re.search(r"--" + name + r"\s*:\s*(#[0-9a-fA-F]{6})\b", css)
        return m.group(1) if m else default

    bgs = re.findall(r"--bg\s*:\s*(#[0-9a-fA-F]{6})\b", css)
    return {"ac": first("ac", "#5b6cf0"), "ac2": first("ac2", "#a05cf0"),
            "bg": bgs[0] if bgs else "#f1f3f9", "bg_dark": bgs[1] if len(bgs) > 1 else "#0d1016"}


def png_bytes(w, h, rows, channels):
    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    raw = b"".join(b"\x00" + bytes(r) for r in rows)
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 6 if channels == 4 else 2, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")


def round_rect_sd(x, y, cx, cy, hx, hy, r):
    """Distance signée (en pixels, négative à l'intérieur) à un rectangle aux coins arrondis."""
    qx = abs(x - cx) - (hx - r)
    qy = abs(y - cy) - (hy - r)
    return math.hypot(max(qx, 0.0), max(qy, 0.0)) + min(max(qx, qy), 0.0) - r


def render_icon(size, c1, c2, rounded, glyph):
    """Icône « grille d'applications » sur un dégradé. rounded : coins arrondis transparents
    (icône ordinaire) ou plein cadre (icône maskable et icône Apple). glyph : part du côté occupée par le motif."""
    a, b = hex_rgb(c1), hex_rgb(c2)
    box = glyph * size
    gap = 0.14 * box
    tile = (box - gap) / 2
    x0 = (size - box) / 2
    radius = 0.24 * tile
    centers = [(x0 + tile / 2 + i * (tile + gap), x0 + tile / 2 + j * (tile + gap)) for j in (0, 1) for i in (0, 1)]
    corner = 0.22 * size
    channels = 4 if rounded else 3
    rows = []
    for py in range(size):
        y = py + 0.5
        row = bytearray()
        for px in range(size):
            x = px + 0.5
            t = (x + y) / (2.0 * size)
            r, g, bl = (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t)
            cov = 1.0
            if rounded and (min(x, size - x) < corner + 1 and min(y, size - y) < corner + 1):
                cov = min(1.0, max(0.0, 0.5 - round_rect_sd(x, y, size / 2, size / 2, size / 2, size / 2, corner)))
            if x0 - 1 <= x <= x0 + box + 1 and x0 - 1 <= y <= x0 + box + 1:
                for k, (cx, cy) in enumerate(centers):
                    if k == 3:   # la quatrième case est un rond, plus discret : un « + » en devenir
                        sd, alpha = math.hypot(x - cx, y - cy) - tile / 2, 0.6
                    else:
                        sd, alpha = round_rect_sd(x, y, cx, cy, tile / 2, tile / 2, radius), 1.0
                    w = min(1.0, max(0.0, 0.5 - sd)) * alpha
                    if w > 0:
                        r, g, bl = r + (255 - r) * w, g + (255 - g) * w, bl + (255 - bl) * w
            row += bytes((round(r), round(g), round(bl))) if channels == 3 else bytes((round(r), round(g), round(bl), round(cov * 255)))
        rows.append(row)
    return png_bytes(size, size, rows, channels)


def write_icons(out, colors):
    d = out / "icons"
    d.mkdir(parents=True, exist_ok=True)
    spec = {"icon-192.png": (192, True, 0.56), "icon-512.png": (512, True, 0.56),
            "icon-maskable-512.png": (512, False, 0.48), "apple-touch-icon.png": (180, False, 0.56)}
    for name, (size, rounded, glyph) in spec.items():
        (d / name).write_bytes(render_icon(size, colors["ac"], colors["ac2"], rounded, glyph))
    return list(spec)


def write_manifest(out, tools, colors):
    manifest = {
        "name": APP_NAME, "short_name": APP_NAME, "description": APP_DESC, "lang": "fr",
        "id": "./", "start_url": "./", "scope": "./", "display": "standalone",
        "background_color": colors["bg"], "theme_color": colors["bg"], "categories": ["productivity", "utilities"],
        "icons": [
            {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
            {"src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
        "shortcuts": [{"name": title, "url": quote(rel.as_posix()), "description": desc} if desc
                      else {"name": title, "url": quote(rel.as_posix())} for rel, title, desc in tools[:10]],
    }
    (out / "manifest.webmanifest").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def head_end(text):
    """Position du </head> réel : celui qui n'est pas dans un <script> (le JavaScript peut en contenir un en texte)."""
    pos = 0
    for m in SCRIPT_RE.finditer(text):
        h = HEAD_END_RE.search(text, pos, m.start())
        if h:
            return h.start()
        pos = m.end()
    h = HEAD_END_RE.search(text, pos)
    return h.start() if h else -1


def inject_pwa(page, out, colors):
    text = page.read_text(encoding="utf-8")
    end = head_end(text)
    if end < 0:
        print(f"  ! {page.relative_to(out)} : pas de </head>, page laissée telle quelle")
        return
    head = text[:end]
    prefix = "../" * (len(page.relative_to(out).parts) - 1)

    def has(pattern):
        return re.search(pattern, head, re.I) is not None

    def attr(name, value):
        return rf"""{name}\s*=\s*["']{value}["']"""

    lines = []
    if not has(attr("rel", "manifest")):
        lines.append(f'<link rel="manifest" href="{prefix}manifest.webmanifest">')
    if not has(r"""rel\s*=\s*["'](?:shortcut )?icon["']"""):
        lines.append(f'<link rel="icon" type="image/png" sizes="192x192" href="{prefix}icons/icon-192.png">')
    if not has(attr("rel", "apple-touch-icon")):
        lines.append(f'<link rel="apple-touch-icon" href="{prefix}icons/apple-touch-icon.png">')
    if not has(attr("name", "theme-color")):
        lines.append(f'<meta name="theme-color" content="{colors["bg"]}" media="(prefers-color-scheme: light)">')
        lines.append(f'<meta name="theme-color" content="{colors["bg_dark"]}" media="(prefers-color-scheme: dark)">')
    if not has(attr("name", "mobile-web-app-capable")):
        lines.append('<meta name="mobile-web-app-capable" content="yes">')
    if not has(attr("name", "apple-mobile-web-app-capable")):
        lines.append('<meta name="apple-mobile-web-app-capable" content="yes">')
    if not has(attr("name", "apple-mobile-web-app-title")):
        lines.append(f'<meta name="apple-mobile-web-app-title" content="{html.escape(APP_NAME, quote=True)}">')
    lines.append('<script>if("serviceWorker"in navigator)addEventListener("load",function(){'
                 f'navigator.serviceWorker.register("{prefix}sw.js").catch(function(){{}})}})</script>')
    page.write_text(text[:end] + "\n".join(lines) + "\n" + text[end:], encoding="utf-8")


def write_service_worker(out):
    files = sorted(p for p in out.rglob("*") if p.is_file() and p.name != "sw.js")
    h = hashlib.sha256(SW_TEMPLATE.encode("utf-8"))
    for p in files:
        h.update(p.relative_to(out).as_posix().encode("utf-8") + b"\0" + p.read_bytes())
    version = h.hexdigest()[:12]
    precache = ["./"] + [quote(p.relative_to(out).as_posix()) for p in files]
    sw = SW_TEMPLATE.replace("__VERSION__", version).replace("__PRECACHE__", json.dumps(precache, indent=2))
    (out / "sw.js").write_text(sw, encoding="utf-8")
    return version, len(precache)


def build_pwa(out, source, tools):
    colors = css_colors(source)
    icons = write_icons(out, colors)
    write_manifest(out, tools, colors)
    for page in sorted(out.rglob("*.html")):
        inject_pwa(page, out, colors)
    version, n = write_service_worker(out)
    print(f"PWA : manifest, {len(icons)} icônes, sw.js (version {version}, {n} entrées pré-chargées)")


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
    ap.add_argument("--pwa", action="store_true",
                    help="application installable : manifest, service worker (hors ligne) et icônes (pas avec --standalone)")
    ap.add_argument("--src", default="code", help="dossier des sources (défaut : code)")
    ap.add_argument("--out", default="dist", help="dossier de sortie (défaut : dist)")
    args = ap.parse_args()
    if args.pwa and args.standalone:
        ap.error("--pwa ne se combine pas avec --standalone : une PWA a besoin de son manifest, de son service worker "
                 "et de ses icônes à côté des pages, et d'un index pour démarrer.")

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
        if args.pwa:
            build_pwa(out, source, tools)


if __name__ == "__main__":
    main()
