#!/usr/bin/env python3
"""Construit le dossier dist/ à partir de code/.

  python3 build.py                 copie code/ dans dist/ et génère dist/index.html
                                   (grille de cartes : icône, titre et description de chaque outil)
  python3 build.py --standalone    chaque page HTML de code/ est écrite dans dist/ avec TOUT ce dont elle
                                   dépend inséré : common.css et common.js, icônes en data:, et les
                                   bibliothèques / polices des CDN (téléchargées une fois, gardées dans
                                   .cache/standalone/). Une page = un fichier, utilisable hors ligne.
                                   --refresh retélécharge au lieu d'utiliser le cache.
  python3 build.py --pwa           comme le premier, et dist/ devient une application
                                   installable : manifest, service worker (hors ligne)
                                   et icônes générées. Incompatible avec --standalone.
  python3 build.py --deploy        après le build, envoie dist/ sur le serveur avec rsync
                                   (réglages dans deploy.conf, voir deploy.conf.example).
                                   Se combine avec les autres options : build.py --pwa --deploy

Python 3.8+, bibliothèque standard uniquement.
"""
import argparse
import base64
import configparser
import hashlib
import html
import json
import math
import os
import re
import shlex
import shutil
import struct
import subprocess
import sys
import urllib.error
import urllib.request
import zlib
from pathlib import Path
from urllib.parse import quote, urljoin, urlparse

ROOT = Path(__file__).resolve().parent
LINK_RE = re.compile(r"<link\b[^>]*>", re.I)
ATTR_RE = re.compile(r"""([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')""")
TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.I | re.S)
META_DESC_RE = re.compile(r"""<meta\b[^>]*\bname\s*=\s*["']description["'][^>]*>""", re.I)
SCRIPT_RE = re.compile(r"<script\b.*?</script\s*>", re.I | re.S)
HEAD_END_RE = re.compile(r"</head\s*>", re.I)

# Préfixe d'ordre « 10_ » devant le nom d'une page : sert uniquement à classer les outils.
# Il est retiré de tous les noms publiés (fichiers de dist/, adresses, index, manifest, cache).
ORDER_RE = re.compile(r"^(\d+)_")

APP_NAME = "WebApps"
APP_DESC = "Petits outils autonomes : une page HTML, pas de serveur."


def public_rel(rel):
    """Chemin publié d'une page : le préfixe d'ordre du nom de fichier est retiré."""
    return rel.with_name(ORDER_RE.sub("", rel.name, count=1))


def order_key(rel):
    """Ordre des outils : numéro du préfixe, puis nom. Sans préfixe : après les préfixés, par nom."""
    m = ORDER_RE.match(rel.name)
    return (0, int(m.group(1)), rel.as_posix().casefold()) if m else (1, 0, rel.as_posix().casefold())


def attrs(tag):
    return {m.group(1).lower(): html.unescape(m.group(2) if m.group(2) is not None else m.group(3)) for m in ATTR_RE.finditer(tag)}


def is_local(href):
    return bool(href) and not re.match(r"^([a-z][a-z0-9+.-]*:|//|#)", href, re.I)


IMG_RE = re.compile(r"<img\b[^>]*>", re.I)
ANCHOR_RE = re.compile(r"<a\b[^>]*>", re.I)
OPEN_SCRIPT_RE = re.compile(r"<script\b[^>]*>", re.I)
STOP_COLOR_RE = re.compile(r"""stop-color\s*=\s*["'](#[0-9a-fA-F]{6})["']""")
MIME = {".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon",
        ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".otf": "font/otf"}
APP_ICON = "icons/webapps.svg"   # icône de l'index et de l'ensemble ; facultative
CACHE_DIR = ROOT / ".cache" / "standalone"
USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"   # Google Fonts sert du woff2 aux navigateurs récents
MAX_REMOTE = 8 * 1024 * 1024
HTTPS_RE = re.compile(r"https://", re.I)
CSS_URL_RE = re.compile(r"""url\(\s*(['"]?)(.*?)\1\s*\)""", re.I | re.S)
FONT_FACE_RE = re.compile(r"/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{.*?\})", re.S)


class Remote:
    """Télécharge les ressources distantes (bibliothèques, polices) et les garde dans .cache/standalone/ :
    le premier build a besoin du réseau, les suivants non. refresh=True ignore le cache."""

    def __init__(self, cache=None, refresh=False):
        self.cache = Path(cache) if cache else CACHE_DIR
        self.refresh = refresh
        self.seen = {}          # url -> (octets, type) pour ce build
        self.fetched = 0        # téléchargés pendant ce build
        self.bytes = 0          # taille de tout ce qui a été intégré

    @staticmethod
    def key(url):
        return hashlib.sha256(url.encode("utf-8")).hexdigest()[:32]

    def get(self, url):
        if url in self.seen:
            return self.seen[url]
        body, meta = self.cache / (self.key(url) + ".bin"), self.cache / (self.key(url) + ".json")
        if not self.refresh and body.is_file() and meta.is_file():
            data, ctype = body.read_bytes(), json.loads(meta.read_text(encoding="utf-8")).get("type", "")
            print(f"    = {url}  (cache, {len(data) // 1024} Ko)")
        else:
            data, ctype = self.download(url)
            self.cache.mkdir(parents=True, exist_ok=True)
            body.write_bytes(data)
            meta.write_text(json.dumps({"url": url, "type": ctype}), encoding="utf-8")
            self.fetched += 1
            print(f"    ↓ {url}  ({len(data) // 1024} Ko)")
        self.seen[url] = (data, ctype)
        self.bytes += len(data)
        return data, ctype

    @staticmethod
    def download(url):
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "*/*"})
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read(MAX_REMOTE + 1)
                ctype = r.headers.get_content_type()
        except (urllib.error.URLError, OSError, ValueError) as e:
            sys.exit(f"Téléchargement impossible : {url}\n  {e}\n"
                     "  --standalone a besoin du réseau la première fois ; ensuite .cache/standalone/ suffit.")
        if len(data) > MAX_REMOTE:
            sys.exit(f"{url} dépasse {MAX_REMOTE // 1024 // 1024} Mo : refusé.")
        if ctype == "text/html":
            sys.exit(f"{url} renvoie une page HTML, pas le fichier attendu (adresse changée ?).")
        return data, ctype


def decode_text(url, data):
    try:
        return data.decode("utf-8")
    except UnicodeDecodeError:
        sys.exit(f"{url} n'est pas en UTF-8 : insertion impossible.")


def safe_js(js):
    """Prépare un script téléchargé pour vivre dans une balise <script> de la page."""
    js = re.sub(r"//[#@]\s*sourceMappingURL=\S+\s*$", "", js.strip())
    js = re.sub(r"</(script)", r"<\\/\1", js, flags=re.I)   # « </script » dans une chaîne fermerait la balise
    return js.replace("<!--", "<\\!--")


def latin_only(css):
    """Google Fonts renvoie un @font-face par alphabet : on ne garde que « latin » (le français y est entier)."""
    kept = [block for label, block in FONT_FACE_RE.findall(css) if label == "latin"]
    return "\n".join(kept) if kept else css


def remote_css(remote, url):
    """Feuille de style distante, prête à être insérée : url() remplacés par des data:."""
    data, _ = remote.get(url)
    css = decode_text(url, data)
    if urlparse(url).hostname == "fonts.googleapis.com":
        css = latin_only(css)

    def embed(m):
        ref = m.group(2).strip()
        if not ref or ref.startswith(("data:", "#")):
            return m.group(0)
        target = urljoin(url, ref)
        if not HTTPS_RE.match(target):
            return m.group(0)
        blob, ctype = remote.get(target)
        ext_mime = MIME.get(Path(urlparse(target).path).suffix.lower())
        mime = ext_mime if (not ctype or ctype in ("application/octet-stream", "text/plain", "binary/octet-stream")) and ext_mime else ctype
        return f'url("data:{mime};base64,{base64.b64encode(blob).decode("ascii")}")'

    css = CSS_URL_RE.sub(embed, css)
    css = re.sub(r"/\*[#@]\s*sourceMappingURL=.*?\*/", "", css).strip()
    if re.search(r"</style", css, re.I):
        sys.exit(f"{url} contient « </style » : insertion impossible")
    return css


def bare_script_tag(opening):
    """Balise <script> ouvrante sans les attributs qui n'ont plus de sens une fois le code dans la page."""
    for name in ("src", "integrity", "crossorigin", "referrerpolicy", "nonce"):
        opening = drop_attr(opening, name)
    return re.sub(r"\s+(?:async|defer|crossorigin)(?=[\s>])", "", opening, flags=re.I)


def set_attr(tag, name, value):
    """Remplace la valeur de l'attribut « name » (entre guillemets) dans une balise."""
    pat = re.compile(r"""(\b%s\s*=\s*)(["'])(.*?)\2""" % re.escape(name), re.I | re.S)
    return pat.sub(lambda m: f'{m.group(1)}"{html.escape(value, quote=True)}"', tag, count=1)


def drop_attr(tag, name):
    return re.sub(r"""\s+%s\s*=\s*(["']).*?\1""" % re.escape(name), "", tag, count=1, flags=re.I | re.S)


def data_uri(path):
    mime = MIME[path.suffix.lower()]
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")


def inline_page(page, source_root, remote=None):
    """Rend une page autonome : feuilles de style et scripts locaux insérés dans la page, icône et
    images locales en data:, lien d'accueil (data-home) neutralisé. Avec remote (un Remote), les
    <script src> et <link rel=stylesheet> en https:// sont eux aussi téléchargés et insérés."""
    text = page.read_text(encoding="utf-8")
    name = page.relative_to(source_root)

    def local(href):
        if not is_local(href):
            return None
        path = (page.parent / href.split("?")[0].split("#")[0]).resolve()
        try:
            path.relative_to(source_root)
        except ValueError:
            sys.exit(f"{name} : {href} sort du dossier {source_root.name}/")
        if not path.is_file():
            sys.exit(f"{name} : fichier introuvable : {href}")
        return path

    def link(m):
        tag = m.group(0)
        a = attrs(tag)
        rels = a.get("rel", "").lower().split()
        href = a.get("href", "")
        if remote and HTTPS_RE.match(href):
            if "stylesheet" in rels:
                media = f' media="{html.escape(a["media"])}"' if a.get("media") else ""
                return f"<style{media}>\n/* {href} */\n{remote_css(remote, href)}\n</style>"
            if {"preconnect", "dns-prefetch", "preload", "prefetch"} & set(rels):
                return ""   # indications de connexion devenues inutiles
            return tag
        path = local(href)
        if path is None:
            return tag
        if "stylesheet" in rels:
            css = path.read_text(encoding="utf-8").strip()
            if re.search(r"</style", css, re.I):
                sys.exit(f"{a['href']} contient « </style » : insertion impossible")
            media = f' media="{html.escape(a["media"])}"' if a.get("media") else ""
            return f"<style{media}>\n/* {path.name} */\n{css}\n</style>"
        if "icon" in rels or "apple-touch-icon" in rels:
            if path.suffix.lower() not in MIME:
                return tag
            return set_attr(tag, "href", data_uri(path))
        return tag

    def img(m):
        tag = m.group(0)
        path = local(attrs(tag).get("src", ""))
        if path is None or path.suffix.lower() not in MIME:
            return tag
        return set_attr(tag, "src", data_uri(path))

    def anchor(m):
        tag = m.group(0)
        return drop_attr(tag, "href") if re.search(r"\sdata-home(?=[\s>=/])", tag, re.I) else tag

    def script(m):
        block = m.group(0)
        opening = OPEN_SCRIPT_RE.match(block).group(0)
        src = attrs(opening).get("src", "")
        inner = block[len(opening):block.lower().rfind("</script")]
        if inner.strip():
            return block
        if remote and HTTPS_RE.match(src):
            data, _ = remote.get(src)
            return f"{bare_script_tag(opening)}\n/* {src} */\n{safe_js(decode_text(src, data))}\n</script>"
        path = local(src)
        if path is None:
            return block
        js = path.read_text(encoding="utf-8").strip()
        if re.search(r"</script", js, re.I):
            sys.exit(f"{path.name} contient « </script » : insertion impossible")
        return f"{bare_script_tag(opening)}\n/* {path.name} */\n{js}\n</script>"

    def plain(chunk):
        # <link> en dernier : le CSS inséré par link() ne doit pas être relu (ses commentaires contiennent du HTML d'exemple)
        return LINK_RE.sub(link, ANCHOR_RE.sub(anchor, IMG_RE.sub(img, chunk)))

    # Le JavaScript peut contenir du HTML sous forme de texte (par exemple le code généré par le gestionnaire
    # de cartes) : seuls les <script src="local"> sont remplacés, le contenu des scripts n'est jamais retouché.
    out, pos = [], 0
    for m in SCRIPT_RE.finditer(text):
        out.append(plain(text[pos:m.start()]))
        out.append(script(m))
        pos = m.end()
    out.append(plain(text[pos:]))
    return "".join(out)


def page_info(page, source_root):
    """Titre, description, icône (chemin relatif à code/) et couleurs du dégradé de l'icône."""
    text = page.read_text(encoding="utf-8")
    text = text.split("</head>", 1)[0]  # titre et description : dans l'en-tête seulement
    t = TITLE_RE.search(text)
    title = html.unescape(re.sub(r"\s+", " ", t.group(1)).strip()) if t else ORDER_RE.sub("", page.stem, count=1)
    d = META_DESC_RE.search(text)
    desc = attrs(d.group(0)).get("content", "").strip() if d else ""
    icon, colors = None, None
    for tag in LINK_RE.findall(text):
        a = attrs(tag)
        if "icon" in a.get("rel", "").lower().split() and is_local(a.get("href", "")):
            p = (page.parent / a["href"].split("?")[0].split("#")[0]).resolve()
            try:
                icon = p.relative_to(source_root) if p.is_file() else None
            except ValueError:
                icon = None
            break
    if icon is not None and icon.suffix.lower() == ".svg":
        stops = STOP_COLOR_RE.findall((source_root / icon).read_text(encoding="utf-8"))
        if len(stops) >= 2:
            colors = (stops[0], stops[1])
    return title, desc, icon, colors


INDEX = """<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>@@APP_NAME@@</title>
<meta name="description" content="@@APP_DESC@@">
<link rel="stylesheet" href="common.css">
@@HEAD_EXTRA@@<script src="common.js"></script>
<style>
.hero { max-width: 960px; margin: 0 auto; padding: calc(30px + env(safe-area-inset-top,0px)) 16px 22px; display: flex; align-items: center; gap: 16px; }
.hero .logo { flex: none; width: 68px; height: 68px; border-radius: 19px; filter: drop-shadow(0 8px 16px color-mix(in srgb,var(--ac) 35%,transparent)); animation: logo-in .8s var(--spring) both; }
.hero .grow { flex: 1; min-width: 0; }
.hero .brand { font-size: clamp(34px, 8vw, 48px); letter-spacing: -.04em; }
.hero p { margin: 4px 0 0; color: var(--mut); }
.count { display: inline-block; margin-top: 10px; padding: 2px 11px; border-radius: 999px; background: var(--ac-soft); color: var(--ac); font-size: 13px; font-weight: 700; }
main { max-width: 960px; margin: 0 auto; padding: 4px 16px calc(44px + env(safe-area-inset-bottom,0px)); }
.tools { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); }
.tool { --c1: var(--ac); --c2: var(--ac2); position: relative; display: flex; align-items: flex-start; gap: 16px; margin: 0; padding: 16px; overflow: hidden; color: inherit; text-decoration: none;
  animation: rise .6s var(--spring) both; animation-delay: calc(var(--i, 0) * 70ms + 100ms);
  transition: transform .25s var(--spring), border-color .2s, box-shadow .25s; }
.tool::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .65; transition: opacity .25s;
  background: linear-gradient(135deg, color-mix(in srgb,var(--c1) 11%,transparent), color-mix(in srgb,var(--c2) 6%,transparent) 55%, transparent 80%); }
.tool:hover { transform: translateY(-4px); border-color: color-mix(in srgb,var(--c1) 55%,var(--line));
  box-shadow: 0 14px 32px color-mix(in srgb,var(--c1) 24%,transparent), var(--shadow); }
.tool:hover::before { opacity: 1; }
.tool:active { transform: scale(.98); }
.ticon { position: relative; flex: none; width: 64px; height: 64px; border-radius: 18px; transition: transform .4s var(--spring);
  box-shadow: 0 6px 14px color-mix(in srgb,var(--c2) 28%,transparent); }
.tool:hover .ticon { transform: rotate(-7deg) scale(1.1); }
.ticon.fb { display: grid; place-items: center; font-size: 28px; font-weight: 800; color: #fff; background: linear-gradient(135deg, var(--c1), var(--c2)); }
.tbody { position: relative; min-width: 0; flex: 1; padding-top: 2px; }
.tool h2 { margin: 0; font-size: 19px; font-weight: 800; letter-spacing: -.02em; }
.tool:hover h2 { background: linear-gradient(90deg, var(--c1), var(--c2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.tool p { margin: 3px 0 0; color: var(--mut); font-size: 14px; line-height: 1.4; }
.tool .file { margin-top: 8px; font: 12px var(--f-mono); color: var(--mut); opacity: .75; }
.tool .arrow { position: absolute; top: 14px; right: 16px; font-size: 22px; line-height: 1; color: var(--c1); opacity: 0; transform: translateX(-8px); transition: opacity .2s, transform .3s var(--spring); }
.tool:hover .arrow, .tool:focus-visible .arrow { opacity: 1; transform: none; }
@keyframes rise { from { opacity: 0; transform: translateY(16px) scale(.97); } }
@keyframes logo-in { from { opacity: 0; transform: rotate(-16deg) scale(.55); } }
@media (max-width: 480px) { .ticon { width: 56px; height: 56px; border-radius: 16px; } .tool .arrow { display: none; } }
</style>
</head>
<body>
<header class="hero">
@@LOGO@@  <div class="grow">
    <h1 class="brand">@@APP_NAME@@</h1>
    <p>@@APP_DESC@@</p>
    <span class="count">@@COUNT@@</span>
  </div>
  <button class="iconbtn themebtn" data-theme-toggle></button>
</header>
<main>
  <div class="tools">
@@CARDS@@
  </div>
</main>
</body>
</html>
"""
CARD = """    <a class="card tool" href="@@HREF@@" style="--i:@@I@@@@COLORS@@">
      @@ICON@@
      <div class="tbody">
        <h2>@@TITLE@@</h2>
@@DESC@@        <div class="file">@@PATH@@</div>
      </div>
      <span class="arrow" aria-hidden="true">→</span>
    </a>"""


def fill(template, **values):
    for k, v in values.items():
        template = template.replace(f"@@{k}@@", v)
    return template


def build_index(out, tools, extras, source):
    cards = []
    for i, (rel, title, desc) in enumerate(tools):
        icon, colors = extras.get(rel, (None, None))
        if icon is not None:
            ic = f'<img class="ticon" src="{html.escape(quote(icon.as_posix()), quote=True)}" alt="" width="64" height="64" loading="lazy">'
        else:
            ic = f'<span class="ticon fb" aria-hidden="true">{html.escape(title[:1].upper())}</span>'
        cs = f";--c1:{colors[0]};--c2:{colors[1]}" if colors else ""
        d = f"        <p>{html.escape(desc)}</p>\n" if desc else ""
        cards.append(fill(CARD, HREF=html.escape(quote(rel.as_posix()), quote=True), I=str(i), COLORS=cs, ICON=ic,
                          TITLE=html.escape(title), DESC=d, PATH=html.escape(rel.as_posix())))
    n = len(tools)
    has_logo = (source / APP_ICON).is_file()
    page = fill(INDEX, APP_NAME=APP_NAME, APP_DESC=html.escape(APP_DESC, quote=True), COUNT=f"{n} outil{'s' if n > 1 else ''}",
                CARDS="\n".join(cards),
                HEAD_EXTRA=f'<link rel="icon" type="image/svg+xml" href="{APP_ICON}">\n' if has_logo else "",
                LOGO=f'  <img class="logo" src="{APP_ICON}" alt="" width="68" height="68">\n' if has_logo else "")
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
    return {"ac": first("ac", "#5b4bff"), "ac2": first("ac2", "#e63b97"), "ac3": first("ac3", "#ffb020"),
            "bg": bgs[0] if bgs else "#f7f5ff", "bg_dark": bgs[1] if len(bgs) > 1 else "#0f0c22"}


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


def render_icon(size, c1, c2, c3, rounded, glyph):
    """Icône « grille d'applications » sur un dégradé (comme icons/webapps.svg). rounded : coins arrondis transparents
    (icône ordinaire) ou plein cadre (icône maskable et icône Apple). glyph : part du côté occupée par le motif."""
    a, b, sun = hex_rgb(c1), hex_rgb(c2), hex_rgb(c3)
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
                    if k == 3:   # la quatrième case est un rond de la troisième couleur : la place d'un futur outil
                        sd, tint = math.hypot(x - cx, y - cy) - tile / 2, sun
                    else:
                        sd, tint = round_rect_sd(x, y, cx, cy, tile / 2, tile / 2, radius), (255, 255, 255)
                    w = min(1.0, max(0.0, 0.5 - sd))
                    if w > 0:
                        r, g, bl = r + (tint[0] - r) * w, g + (tint[1] - g) * w, bl + (tint[2] - bl) * w
            row += bytes((round(r), round(g), round(bl))) if channels == 3 else bytes((round(r), round(g), round(bl), round(cov * 255)))
        rows.append(row)
    return png_bytes(size, size, rows, channels)


def write_icons(out, colors):
    d = out / "icons"
    d.mkdir(parents=True, exist_ok=True)
    spec = {"icon-192.png": (192, True, 0.56), "icon-512.png": (512, True, 0.56),
            "icon-maskable-512.png": (512, False, 0.48), "apple-touch-icon.png": (180, False, 0.56)}
    for name, (size, rounded, glyph) in spec.items():
        (d / name).write_bytes(render_icon(size, colors["ac"], colors["ac2"], colors["ac3"], rounded, glyph))
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


# ------------------------------------------------------------------ Déploiement

DEPLOY_CONF = ROOT / "deploy.conf"
HOST_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*$")
USER_RE = re.compile(r"^[A-Za-z0-9_][A-Za-z0-9._-]*$")
REMOTE_PATH_RE = re.compile(r"^[A-Za-z0-9_./~+@%=-]+$")


def load_deploy_conf(conf=DEPLOY_CONF):
    """Lit et valide deploy.conf ; quitte avec un message clair au moindre doute."""
    name = conf.name
    if not conf.is_file():
        sys.exit(f"{name} introuvable : copie deploy.conf.example en {name}, remplis-le, puis relance.")
    cp = configparser.ConfigParser(inline_comment_prefixes=("#", ";"))
    try:
        cp.read(conf, encoding="utf-8")
    except configparser.Error as e:
        sys.exit(f"{name} illisible : {e}")
    if not cp.has_section("deploy"):
        sys.exit(f"{name} : la section [deploy] est absente.")
    c = cp["deploy"]

    def get(key):
        return c.get(key, "").strip()

    host, user, path = get("host"), get("user"), get("path")
    if not host:
        sys.exit(f"{name} : « host » est obligatoire (nom du serveur, ou alias défini dans ~/.ssh/config).")
    if not HOST_RE.match(host):
        sys.exit(f"{name} : « host » contient des caractères non acceptés : {host!r}")
    if user and not USER_RE.match(user):
        sys.exit(f"{name} : « user » contient des caractères non acceptés : {user!r}")
    if not path:
        sys.exit(f"{name} : « path » est obligatoire (chemin réel du dossier publié sur le serveur).")
    parts = [x for x in path.split("/") if x]
    if not REMOTE_PATH_RE.match(path) or path.strip("/~.") == "" or ".." in parts:
        sys.exit(f"{name} : « path » refusé : {path!r} (caractères non acceptés, ou chemin trop général).")
    try:
        delete = c.getboolean("delete", fallback=False)
    except ValueError:
        sys.exit(f"{name} : « delete » doit valoir yes ou no.")
    if delete and len(parts) < 2:
        sys.exit(f"{name} : avec delete = yes, « path » doit avoir au moins deux niveaux (reçu {path!r}).")
    port = None
    if get("port"):
        try:
            port = int(get("port"))
            if not 1 <= port <= 65535:
                raise ValueError
        except ValueError:
            sys.exit(f"{name} : « port » doit être un nombre entre 1 et 65535.")
    keyfile = None
    if get("keyfile"):
        keyfile = Path(os.path.expanduser(get("keyfile")))
        if not keyfile.is_file():
            sys.exit(f"{name} : clé introuvable : {keyfile}")
    return {"host": host, "user": user, "path": path, "port": port, "keyfile": keyfile, "delete": delete}


def check_deploy_tools():
    missing = [t for t in ("rsync", "ssh") if not shutil.which(t)]
    if missing:
        sys.exit(f"{' et '.join(missing)} introuvable sur ce poste. rsync doit aussi être installé sur le serveur.")


def rsync_command(out, cfg):
    ssh = ["ssh"]
    if cfg["port"]:
        ssh += ["-p", str(cfg["port"])]
    if cfg["keyfile"]:
        ssh += ["-i", str(cfg["keyfile"]), "-o", "IdentitiesOnly=yes"]
    target = (cfg["user"] + "@" if cfg["user"] else "") + f'{cfg["host"]}:{cfg["path"]}'
    # -t garde les dates (les fichiers inchangés ne sont pas renvoyés) ; --chmod rend les fichiers lisibles par le
    # serveur web quel que soit l'umask du poste ; --delete seulement si deploy.conf le demande.
    cmd = ["rsync", "-rltvz", "--chmod=D755,F644", "-e", shlex.join(ssh)]
    if cfg["delete"]:
        cmd.append("--delete")
    return cmd + [str(out) + "/", target]


def deploy(out, cfg):
    cmd = rsync_command(out, cfg)
    print("Déploiement :", shlex.join(cmd))
    try:
        rc = subprocess.run(cmd).returncode
    except OSError as e:
        sys.exit(f"Impossible de lancer rsync : {e}")
    if rc:
        sys.exit(f"rsync a échoué (code {rc}) : l'état du serveur n'est pas garanti, relance après correction.")
    print(f"Déployé sur {cfg['host']}:{cfg['path']}" + (" (fichiers orphelins supprimés)" if cfg["delete"] else ""))


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
    ap.add_argument("--refresh", action="store_true",
                    help="avec --standalone : retélécharge les bibliothèques et polices au lieu d'utiliser .cache/standalone/")
    ap.add_argument("--pwa", action="store_true",
                    help="application installable : manifest, service worker (hors ligne) et icônes (pas avec --standalone)")
    ap.add_argument("--deploy", action="store_true",
                    help="après le build, envoie dist/ sur le serveur avec rsync (réglages dans deploy.conf)")
    ap.add_argument("--src", default="code", help="dossier des sources (défaut : code)")
    ap.add_argument("--out", default="dist", help="dossier de sortie (défaut : dist)")
    args = ap.parse_args()
    if args.refresh and not args.standalone:
        ap.error("--refresh ne sert qu'avec --standalone.")
    if args.pwa and args.standalone:
        ap.error("--pwa ne se combine pas avec --standalone : une PWA a besoin de son manifest, de son service worker "
                 "et de ses icônes à côté des pages, et d'un index pour démarrer.")

    deploy_cfg = None
    if args.deploy:   # on vérifie la configuration avant de construire : inutile de bâtir pour échouer ensuite
        deploy_cfg = load_deploy_conf()
        check_deploy_tools()

    source = (ROOT / args.src).resolve()
    out = (ROOT / args.out).resolve()
    if not source.is_dir():
        sys.exit(f"Dossier introuvable : {source}")
    pages = sorted((p for p in source.rglob("*.html") if p.is_file()), key=lambda p: order_key(p.relative_to(source)))
    if not pages:
        sys.exit(f"Aucune page .html dans {source}")
    names = {}
    for p in pages:   # deux sources ne doivent pas donner le même nom publié
        pub = public_rel(p.relative_to(source)).as_posix()
        if pub in names:
            sys.exit(f"Conflit de noms : {names[pub]} et {p.relative_to(source).as_posix()} donneraient tous deux {pub}.")
        names[pub] = p.relative_to(source).as_posix()
    others = {p.relative_to(source).as_posix() for p in source.rglob("*") if p.is_file() and p.suffix.lower() != ".html"}
    for pub, src in names.items():
        if pub in others:
            sys.exit(f"Conflit de noms : {src} donnerait {pub}, qui existe déjà dans {source.name}/.")
    if not args.standalone and "index.html" in names:
        sys.exit("code/index.html (ou NN_index.html) existe déjà : il serait écrasé par l'index généré.")
    clean(out, source)

    if args.standalone:
        remote = Remote(refresh=args.refresh)
        for p in pages:
            rel = public_rel(p.relative_to(source))
            print(f"  {rel}")
            dest = out / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(inline_page(p, source, remote), encoding="utf-8")
        print(f"{len(pages)} page(s) autonome(s) dans {out.relative_to(ROOT)}/"
              + (f" ({len(remote.seen)} ressource(s) distante(s) intégrée(s), {remote.fetched} téléchargée(s))" if remote.seen else ""))
    else:
        shutil.copytree(source, out, dirs_exist_ok=True)
        tools, extras = [], {}   # dans l'ordre des préfixes
        for p in pages:
            rel = p.relative_to(source)
            pub = public_rel(rel)
            if pub != rel:
                (out / rel).rename(out / pub)
            title, desc, icon, colors = page_info(p, source)
            tools.append((pub, title, desc))
            extras[pub] = (icon, colors)
        build_index(out, tools, extras, source)
        print(f"{len(pages)} outil(s) copié(s) dans {out.relative_to(ROOT)}/ + index.html")
        if args.pwa:
            build_pwa(out, source, tools)

    if args.deploy:
        deploy(out, deploy_cfg)


if __name__ == "__main__":
    main()
