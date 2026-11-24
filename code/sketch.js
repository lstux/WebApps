/* sketch.js — croquis à main levée, plein écran : stylo (pression du stylet), surligneur, gomme, couleurs,
   annuler/rétablir, déplacement et zoom à deux doigts (ou molette), fond uni, quadrillé ou à points, export PNG/SVG.

     <script src="sketch.js"></script>   (après common.js ; styles injectés ici, couleurs de common.css)

   Données (JSON, en vecteurs) : { v:1, bg:'plain'|'grid'|'dots', s:[trait…] }
     trait : { t:'pen'|'hl', c:'ink'|'#rrggbb', w:épaisseur, p:[x0,y0,x1,y1,…], r?:[pression 0…1 par point] }
     'ink' = couleur du texte : noir en thème clair, blanc en sombre.

   WebAppsSketch.open({ title, titlePlaceholder, data, onSave(data, title), onClose(data, title), menu:[{label, fn}] })
   WebAppsSketch.svg(data, { cls, ink, bg, pad, max })  → <svg> ajusté au dessin ('' si vide) ; ink par défaut : currentColor
   WebAppsSketch.count(data)                            → nombre de traits
   Avec un stylet, le doigt ne dessine plus : il déplace (la paume ne laisse pas de traces). */
(function () {
  "use strict";
  var CSS = [
    ".skx{position:fixed;inset:0;z-index:100;display:flex;flex-direction:column;background:var(--bg,#fff);color:var(--fg);height:100dvh;user-select:none;-webkit-user-select:none}",
    ".skx-hd{display:flex;align-items:center;gap:4px;padding:calc(8px + env(safe-area-inset-top,0px)) 8px 8px;border-bottom:1px solid var(--line);background:var(--card)}",
    ".skx-hd input{flex:1;min-width:0;font-weight:700;font-size:17px;border:0;background:none;padding:8px 6px;color:inherit;user-select:text;-webkit-user-select:text}",
    ".skx-hd input:focus{outline:none;background:var(--card2);border-radius:10px}",
    ".skx-b{width:40px;height:40px;flex:none;display:grid;place-items:center;border-radius:50%;background:none;color:var(--fg);font-size:19px;border:0;cursor:pointer}",
    ".skx-b:hover{background:var(--hover)} .skx-b:disabled{opacity:.3;cursor:default;background:none}",
    ".skx-st{font-size:12px;color:var(--mut);white-space:nowrap}",
    ".skx-cv{flex:1;min-height:0;position:relative;overflow:hidden;background:var(--card)}",
    ".skx-cv>svg{position:absolute;inset:0;width:100%;height:100%;touch-action:none;display:block}",
    ".skx-cv[data-tool=pan]>svg{cursor:grab} .skx-cv[data-tool=pen]>svg,.skx-cv[data-tool=hl]>svg{cursor:crosshair} .skx-cv[data-tool=er]>svg{cursor:cell}",
    ".skx-hint{position:absolute;left:50%;top:12px;transform:translateX(-50%);background:var(--fg);color:var(--bg);font-size:13px;padding:6px 12px;border-radius:999px;opacity:.85;pointer-events:none;transition:opacity .4s;white-space:nowrap}",
    ".skx-tb{position:absolute;left:50%;bottom:calc(12px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:2px 4px;padding:6px;background:var(--card);border:1px solid var(--line);border-radius:24px;box-shadow:0 8px 26px #0003;width:max-content;max-width:calc(100% - 16px)}",
        ".skx-tb button{flex:none;width:40px;height:40px;border:0;border-radius:50%;background:none;color:var(--fg);display:grid;place-items:center;cursor:pointer;padding:0}",
    ".skx-tb button.on{background:var(--ac-soft,#ddd);color:var(--ac)}",
    ".skx-tb svg{width:22px;height:22px}",
    ".skx-tb .sep{width:1px;height:26px;background:var(--line);flex:none;margin:0 2px}",
    ".skx-tb .col{width:30px;height:30px}",
    ".skx-tb .col i{width:22px;height:22px;border-radius:50%;background:var(--c);box-shadow:0 0 0 1px #0003 inset}",
    ".skx-tb .col.on{background:none;box-shadow:0 0 0 2px var(--ac)}",
    ".skx-tb .sz i{display:block;border-radius:50%;background:currentColor}",
    ".skx-menu{position:absolute;right:8px;top:calc(56px + env(safe-area-inset-top,0px));z-index:3;background:var(--card);border:1px solid var(--line);border-radius:14px;box-shadow:0 10px 30px #0003;padding:6px;display:grid;min-width:230px}",
    ".skx-menu button{border:0;background:none;color:var(--fg);font:inherit;text-align:left;padding:10px 12px;border-radius:10px;cursor:pointer}",
    ".skx-menu button:hover{background:var(--hover)} .skx-menu .on::after{content:' ✓';color:var(--ac)}",
    ".skx-menu hr{border:0;border-top:1px solid var(--line);margin:4px 6px}",
    "html.mde-on{overflow:hidden}"
  ].join("\n");
  function injectCSS() {
    if (document.getElementById("skx-css")) return;
    var s = document.createElement("style"); s.id = "skx-css"; s.textContent = CSS; document.head.appendChild(s);
  }
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var r1 = function (v) { return Math.round(v * 10) / 10; };

  var COLORS = ["ink", "#e5484d", "#2f6fed", "#16a34a", "#f59e0b", "#8b5cf6", "#facc15"];
  var SIZES = { pen: [1.6, 3, 6], hl: [10, 18, 28], er: [8, 16, 30] };
  var ICONS = {
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    hl: '<path d="M9 15l-4 5h6l2-2"/><path d="M9 15l8-11 4 3-8 11z"/>',
    er: '<path d="M8 20h12"/><path d="M5 15l9-10 6 6-9 9H8z"/><path d="M10 10l6 6"/>',
    pan: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11.5V4a1.5 1.5 0 0 1 3 0v8M14 11.5V5.5a1.5 1.5 0 0 1 3 0V13M17 9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-2a6 6 0 0 1-5-2.7L4.3 14a1.5 1.5 0 0 1 2.4-1.8L8 14"/>'
  };
  var ico = function (k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[k] + "</svg>"; };

  function norm(d) {
    d = d && typeof d === "object" ? d : {};
    return { v: 1, bg: ["plain", "grid", "dots"].indexOf(d.bg) >= 0 ? d.bg : "plain", s: Array.isArray(d.s) ? d.s.filter(function (k) { return k && Array.isArray(k.p) && k.p.length >= 2; }) : [] };
  }
  function pts(k) { var o = []; for (var i = 0; i + 1 < k.p.length; i += 2) o.push([k.p[i], k.p[i + 1]]); return o; }

  /* Tracé lissé (courbes par les milieux) ; avec la pression : contour plein à largeur variable. */
  function smooth(P) {
    if (P.length < 3) return "M" + P.map(function (q) { return r1(q[0]) + " " + r1(q[1]); }).join("L");
    var d = "M" + r1(P[0][0]) + " " + r1(P[0][1]);
    for (var i = 1; i < P.length - 1; i++) d += "Q" + r1(P[i][0]) + " " + r1(P[i][1]) + " " + r1((P[i][0] + P[i + 1][0]) / 2) + " " + r1((P[i][1] + P[i + 1][1]) / 2);
    var l = P[P.length - 1]; return d + "L" + r1(l[0]) + " " + r1(l[1]);
  }
  function outline(P, R) {
    var n = P.length, L = [], Rt = [];
    for (var i = 0; i < n; i++) {
      var a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
      var nx = -dy / len, ny = dx / len;
      L.push([P[i][0] + nx * R[i], P[i][1] + ny * R[i]]); Rt.push([P[i][0] - nx * R[i], P[i][1] - ny * R[i]]);
    }
    var arc = function (r, q) { return "A" + r1(r) + " " + r1(r) + " 0 0 1 " + r1(q[0]) + " " + r1(q[1]); };
    return smooth(L) + arc(R[n - 1], Rt[n - 1]) + smooth(Rt.slice().reverse()).replace(/^M/, "L") + arc(R[0], L[0]) + "Z";
  }
  function strokeSVG(k, ink) {
    var P = pts(k), c = k.c === "ink" ? ink : k.c, w = k.w || 3;
    if (k.t === "hl") return '<path d="' + smooth(P.length === 1 ? [P[0], [P[0][0] + .1, P[0][1]]] : P) + '" fill="none" stroke="' + esc(c) + '" stroke-opacity=".35" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
    if (P.length === 1) return '<circle cx="' + P[0][0] + '" cy="' + P[0][1] + '" r="' + w / 2 + '" fill="' + esc(c) + '"/>';
    if (k.r && k.r.length === P.length) {
      var R = k.r.map(function (p, i) { var a = k.r[Math.max(0, i - 1)], b = k.r[Math.min(k.r.length - 1, i + 1)]; return w / 2 * (.3 + .7 * (a + 2 * p + b) / 4); });
      return '<path d="' + outline(P, R) + '" fill="' + esc(c) + '"/>';
    }
    return '<path d="' + smooth(P) + '" fill="none" stroke="' + esc(c) + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function bbox(d) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    d.s.forEach(function (k) {
      var h = (k.w || 3) / 2;
      for (var i = 0; i + 1 < k.p.length; i += 2) { x0 = Math.min(x0, k.p[i] - h); x1 = Math.max(x1, k.p[i] + h); y0 = Math.min(y0, k.p[i + 1] - h); y1 = Math.max(y1, k.p[i + 1] + h); }
    });
    return isFinite(x0) ? { x0: x0, y0: y0, x1: x1, y1: y1 } : null;
  }
  function bgDefs(bg, id, col, tf) {
    if (bg === "plain") return "";
    var inner = bg === "grid" ? '<path d="M24 0H0V24" fill="none" stroke="' + col + '" stroke-width=".6"/>' : '<circle cx="12" cy="12" r="1.1" fill="' + col + '"/>';
    return '<defs><pattern id="' + id + '" width="24" height="24" patternUnits="userSpaceOnUse"' + (tf ? ' patternTransform="' + tf + '"' : "") + ">" + inner + "</pattern></defs>";
  }
  function svgOf(data, o) {
    o = o || {};
    var d = norm(data), b = bbox(d); if (!b) return "";
    var pad = o.pad == null ? 12 : o.pad, x = b.x0 - pad, y = b.y0 - pad, w = b.x1 - b.x0 + 2 * pad, h = b.y1 - b.y0 + 2 * pad, ink = o.ink || "currentColor";
    var id = "skp" + Math.random().toString(36).slice(2, 7);
    var dims = o.max ? (function () { var s = Math.min(1, o.max / Math.max(w, h)) * (o.scale || 1); return ' width="' + Math.round(w * s) + '" height="' + Math.round(h * s) + '"'; })() : "";
    return '<svg xmlns="http://www.w3.org/2000/svg"' + (o.cls ? ' class="' + esc(o.cls) + '"' : "") + ' viewBox="' + r1(x) + " " + r1(y) + " " + r1(w) + " " + r1(h) + '"' + dims + ' role="img" aria-label="Croquis">' +
      (o.bg ? '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" fill="' + o.bg + '"/>' : "") +
      (o.bg && d.bg !== "plain" ? bgDefs(d.bg, id, "#00000022") + '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" fill="url(#' + id + ')"/>' : "") +
      d.s.map(function (k) { return strokeSVG(k, ink); }).join("") + "</svg>";
  }

  /* Douglas-Peucker : garde les indices des points utiles (la pression suit). */
  function simplify(P, eps) {
    if (P.length < 3) return P.map(function (_, i) { return i; });
    var keep = new Uint8Array(P.length); keep[0] = keep[P.length - 1] = 1;
    var stack = [[0, P.length - 1]];
    while (stack.length) {
      var se = stack.pop(), s = se[0], e = se[1], a = P[s], b = P[e], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1e-9, best = -1, bd = 0;
      for (var i = s + 1; i < e; i++) { var dd = Math.abs(dy * P[i][0] - dx * P[i][1] + b[0] * a[1] - b[1] * a[0]) / L; if (dd > bd) { bd = dd; best = i; } }
      if (bd > eps) { keep[best] = 1; stack.push([s, best], [best, e]); }
    }
    var out = []; for (var j = 0; j < P.length; j++) if (keep[j]) out.push(j); return out;
  }
  function segDist(px, py, ax, ay, bx, by) {
    var dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy, t = l ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l)) : 0;
    return Math.hypot(px - ax - t * dx, py - ay - t * dy);
  }
  function download(name, blob) {
    var l = document.createElement("a"); l.href = URL.createObjectURL(blob); l.download = name; document.body.appendChild(l); l.click(); l.remove();
    setTimeout(function () { URL.revokeObjectURL(l.href); }, 1500);
  }
  function fileName(t) { return (String(t || "croquis").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "croquis"); }

  function open(o) {
    injectCSS();
    var old = document.querySelector(".skx"); if (old && old._close) old._close();
    var data = norm(JSON.parse(JSON.stringify(o.data || {})));
    var tool = "pen", color = "ink", size = 1, penSeen = false;
    try { var pref = JSON.parse(localStorage.getItem("webapps.sketch.tool")) || {}; if (SIZES[pref.tool] || pref.tool === "pan") tool = pref.tool; if (COLORS.indexOf(pref.color) >= 0) color = pref.color; if (pref.size >= 0 && pref.size < 3) size = pref.size; } catch (e) { /* défauts */ }
    var hasTitle = o.title !== null;
    var root = document.createElement("div"); root.className = "skx"; root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true");
    root.innerHTML =
      '<div class="skx-hd"><button class="skx-b" data-k="close" aria-label="Fermer" title="Fermer (enregistré)">‹</button>' +
      (hasTitle ? '<input class="skx-ti" type="text" autocomplete="off" placeholder="' + esc(o.titlePlaceholder || "Titre") + '" value="' + esc(o.title || "") + '">' : '<span style="flex:1"></span>') +
      '<span class="skx-st" aria-live="polite"></span>' +
      '<button class="skx-b" data-k="undo" aria-label="Annuler" title="Annuler (Ctrl+Z)">↶</button><button class="skx-b" data-k="redo" aria-label="Rétablir" title="Rétablir (Ctrl+Y)">↷</button>' +
      '<button class="skx-b" data-k="menu" aria-label="Plus">⋯</button></div>' +
      '<div class="skx-cv"><svg xmlns="http://www.w3.org/2000/svg"><g class="bgp"></g><rect class="bgr" width="100%" height="100%" fill="none"/><g class="vw"><g class="ink"></g><g class="live"></g></g><circle class="ercur" r="0" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-dasharray="3 3"/></svg>' +
      '<div class="skx-hint">Deux doigts : déplacer et zoomer</div><div class="skx-tb" role="toolbar" aria-label="Outils"></div></div>';
    document.body.appendChild(root);
    document.documentElement.classList.add("mde-on");
    var cv = root.querySelector(".skx-cv"), svg = cv.querySelector("svg"), gV = svg.querySelector(".vw"), gInk = svg.querySelector(".ink"), gLive = svg.querySelector(".live");
    var gBg = svg.querySelector(".bgp"), rBg = svg.querySelector(".bgr"), erc = svg.querySelector(".ercur"), tb = root.querySelector(".skx-tb"), st = root.querySelector(".skx-st"), ti = root.querySelector(".skx-ti");
    var title = function () { return ti ? ti.value.trim() : undefined; };
    setTimeout(function () { var h = root.querySelector(".skx-hint"); if (h) h.style.opacity = 0; }, 2600);

    var view = { x: 0, y: 0, s: 1 };
    function applyView() {
      gV.setAttribute("transform", "translate(" + view.x + " " + view.y + ") scale(" + view.s + ")");
      var tf = "translate(" + view.x + " " + view.y + ") scale(" + view.s + ")";
      gBg.innerHTML = bgDefs(data.bg, "skbg", "color-mix(in srgb, currentColor 18%, transparent)", tf);
      rBg.setAttribute("fill", data.bg === "plain" ? "none" : "url(#skbg)");
    }
    function fit() {
      var b = bbox(data), r = svg.getBoundingClientRect();
      if (!b) { view = { x: 0, y: 0, s: 1 }; applyView(); return; }
      var W = r.width, H = r.height - 70, bw = b.x1 - b.x0 + 40, bh = b.y1 - b.y0 + 40;
      view.s = Math.max(.1, Math.min(3, Math.min(W / bw, H / bh)));
      view.x = W / 2 - (b.x0 + b.x1) / 2 * view.s; view.y = H / 2 - (b.y0 + b.y1) / 2 * view.s;
      applyView();
    }
    function drawAll() { gInk.innerHTML = data.s.map(function (k) { return strokeSVG(k, "currentColor"); }).join(""); }
    function toWorld(cx, cy) { var r = svg.getBoundingClientRect(); return [(cx - r.left - view.x) / view.s, (cy - r.top - view.y) / view.s]; }

    /* Annuler / rétablir : instantanés de la liste des traits (les traits eux-mêmes ne changent jamais). */
    var undo = [], redo = [];
    function snap() { undo.push(data.s.slice()); if (undo.length > 150) undo.shift(); redo = []; buttons(); }
    function buttons() { root.querySelector("[data-k=undo]").disabled = !undo.length; root.querySelector("[data-k=redo]").disabled = !redo.length; }
    function doUndo() { if (!undo.length) return; redo.push(data.s); data.s = undo.pop(); drawAll(); buttons(); save(); }
    function doRedo() { if (!redo.length) return; undo.push(data.s); data.s = redo.pop(); drawAll(); buttons(); save(); }

    var timer = null, savedKey = JSON.stringify(data) + "\u0000" + (ti ? ti.value : "");
    function save(now) {
      clearTimeout(timer);
      var go = function () {
        var k = JSON.stringify(data) + "\u0000" + (ti ? ti.value : ""); if (k === savedKey) return; savedKey = k;
        try { o.onSave && o.onSave(JSON.parse(JSON.stringify(data)), title()); st.textContent = "enregistré"; } catch (e) { st.textContent = "⚠ non enregistré"; }
      };
      if (now) go(); else { st.textContent = "…"; timer = setTimeout(go, 500); }
    }
    if (ti) ti.addEventListener("input", function () { save(); });
    if (ti) ti.addEventListener("keydown", function (e) { if (e.key === "Enter") ti.blur(); });

    function toolbar() {
      var h = ["pen", "hl", "er", "pan"].map(function (k) {
        var nm = { pen: "Stylo", hl: "Surligneur", er: "Gomme", pan: "Main (déplacer)" }[k];
        return '<button data-tool="' + k + '" class="' + (tool === k ? "on" : "") + '" aria-label="' + nm + '" title="' + nm + '">' + ico(k) + "</button>";
      }).join("");
      if (tool === "pen" || tool === "hl") h += '<span class="sep"></span>' + COLORS.map(function (c) {
        return '<button class="col ' + (c === color ? "on" : "") + '" data-col="' + c + '" aria-label="Couleur ' + (c === "ink" ? "encre" : c) + '"><i style="--c:' + (c === "ink" ? "var(--fg)" : c) + '"></i></button>';
      }).join("");
      if (tool !== "pan") h += '<span class="sep"></span>' + [0, 1, 2].map(function (i) {
        var px = [5, 9, 14][i];
        return '<button class="sz ' + (i === size ? "on" : "") + '" data-sz="' + i + '" aria-label="Taille ' + (i + 1) + '"><i style="width:' + px + "px;height:" + px + 'px"></i></button>';
      }).join("");
      tb.innerHTML = h; cv.dataset.tool = tool;
      try { localStorage.setItem("webapps.sketch.tool", JSON.stringify({ tool: tool, color: color, size: size })); } catch (e) { /* rien */ }
    }
    tb.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.tool) tool = b.dataset.tool;
      if (b.dataset.col) color = b.dataset.col;
      if (b.dataset.sz) size = +b.dataset.sz;
      if (tool === "hl" && color === "ink") color = "#facc15";
      toolbar();
    });

    /* ---------- pointeurs ---------- */
    var ptrs = new Map(), owner = null, mode = null, cur = null, gest = null, panLast = null, erSnap = false;
    function liveDraw() { gLive.innerHTML = cur ? strokeSVG(cur.k, "currentColor") : ""; }
    function addPt(e) {
      var w = toWorld(e.clientX, e.clientY), P = cur.k.p, n = P.length;
      if (n >= 2 && Math.hypot(w[0] - P[n - 2], w[1] - P[n - 1]) < .8 / view.s) return;
      P.push(r1(w[0]), r1(w[1]));
      if (cur.pr) cur.k.r.push(Math.round((e.pressure || .5) * 100) / 100);
    }
    function eraseAt(e) {
      var w = toWorld(e.clientX, e.clientY), R = SIZES.er[size] / view.s, hit = [];
      data.s.forEach(function (k, idx) {
        var h = R + (k.w || 3) / 2, P = k.p;
        if (P.length === 2) { if (Math.hypot(w[0] - P[0], w[1] - P[1]) <= h) hit.push(idx); return; }
        for (var i = 0; i + 3 < P.length; i += 2) if (segDist(w[0], w[1], P[i], P[i + 1], P[i + 2], P[i + 3]) <= h) { hit.push(idx); return; }
      });
      if (!hit.length) return;
      if (!erSnap) { snap(); erSnap = true; }
      data.s = data.s.filter(function (_, i) { return hit.indexOf(i) < 0; }); drawAll();
    }
    function erCursor(e) {
      if (tool !== "er" || (e && e.pointerType === "touch" && penSeen)) { erc.setAttribute("r", 0); return; }
      var r = svg.getBoundingClientRect(); erc.setAttribute("cx", e.clientX - r.left); erc.setAttribute("cy", e.clientY - r.top); erc.setAttribute("r", SIZES.er[size]);
    }
    function startGesture() {
      var a = Array.from(ptrs.values());
      if (cur) { cur = null; liveDraw(); }   // le premier doigt avait commencé un trait : on l'annule
      gest = { d: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) || 1, m: [(a[0].x + a[1].x) / 2, (a[0].y + a[1].y) / 2], v: { x: view.x, y: view.y, s: view.s } };
      mode = "gest";
    }
    svg.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "pen") penSeen = true;
      closeMenu();
      try { svg.setPointerCapture(e.pointerId); } catch (x) { /* rien */ }
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, type: e.pointerType });
      var touches = Array.from(ptrs.values()).filter(function (p) { return p.type === "touch"; }).length;
      if (touches >= 2) { if (cur && cur.k.p.length > 2 && cur.type !== "touch") { /* le stylet dessine : on ignore la main */ } else { startGesture(); return; } }
      if (ptrs.size > 1) return;
      owner = e.pointerId;
      var panning = tool === "pan" || e.button === 1 || (e.pointerType === "touch" && penSeen) || spaceDown;
      if (panning) { mode = "pan"; panLast = [e.clientX, e.clientY]; return; }
      if (e.button > 0) return;
      if (tool === "er") { mode = "er"; erSnap = false; eraseAt(e); erCursor(e); return; }
      mode = "draw";
      var k = { t: tool, c: tool === "hl" && color === "ink" ? "#facc15" : color, w: SIZES[tool][size], p: [] };
      cur = { k: k, pr: e.pointerType === "pen", type: e.pointerType }; if (cur.pr) k.r = [];
      addPt(e); liveDraw();
    });
    svg.addEventListener("pointermove", function (e) {
      erCursor(e);
      if (!ptrs.has(e.pointerId)) return;
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, type: e.pointerType });
      if (mode === "gest" && ptrs.size >= 2) {
        var a = Array.from(ptrs.values()), d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) || 1, m = [(a[0].x + a[1].x) / 2, (a[0].y + a[1].y) / 2];
        var s = Math.max(.1, Math.min(8, gest.v.s * d / gest.d)), r = svg.getBoundingClientRect();
        var wx = (gest.m[0] - r.left - gest.v.x) / gest.v.s, wy = (gest.m[1] - r.top - gest.v.y) / gest.v.s;
        view = { s: s, x: m[0] - r.left - wx * s, y: m[1] - r.top - wy * s }; applyView(); return;
      }
      if (e.pointerId !== owner) return;
      if (mode === "pan") { view.x += e.clientX - panLast[0]; view.y += e.clientY - panLast[1]; panLast = [e.clientX, e.clientY]; applyView(); return; }
      if (mode === "er") { eraseAt(e); return; }
      if (mode === "draw" && cur) {
        var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; if (!evs.length) evs = [e];
        evs.forEach(addPt); liveDraw();
      }
    });
    function up(e) {
      if (!ptrs.has(e.pointerId)) return;
      ptrs.delete(e.pointerId);
      if (e.pointerId === owner && mode === "draw" && cur) {
        var k = cur.k, P = pts(k), keep = simplify(P, .35);
        k.p = []; keep.forEach(function (i) { k.p.push(P[i][0], P[i][1]); });
        if (k.r) { var r = k.r; k.r = keep.map(function (i) { return r[i]; }); if (!k.r.some(function (v) { return Math.abs(v - .5) > .02; })) delete k.r; }
        snap(); data.s = data.s.concat([k]); cur = null; liveDraw(); drawAll(); save();
      }
      if (e.pointerId === owner && mode === "er" && erSnap) save();
      if (e.pointerId === owner && mode !== "gest") { mode = ptrs.size ? "wait" : null; owner = null; }
      if (ptrs.size === 0) { mode = null; gest = null; }
      else if (mode === "gest" && ptrs.size < 2) mode = "wait";   // reste un doigt : rien jusqu'à ce qu'il se lève
    }
    svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
    svg.addEventListener("pointerleave", function () { erc.setAttribute("r", 0); });
    svg.addEventListener("wheel", function (e) {
      e.preventDefault();
      var r = svg.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) {
        var s = Math.max(.1, Math.min(8, view.s * Math.exp(-e.deltaY * .01))), cx = e.clientX - r.left, cy = e.clientY - r.top;
        view.x = cx - (cx - view.x) * s / view.s; view.y = cy - (cy - view.y) * s / view.s; view.s = s;
      } else { view.x -= e.deltaX; view.y -= e.deltaY; }
      applyView();
    }, { passive: false });
    var spaceDown = false;
    function onKey(e) {
      if (e.target === ti) { if (e.key === "Escape") ti.blur(); return; }
      var k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === "z") { e.preventDefault(); e.shiftKey ? doRedo() : doUndo(); return; }
      if ((e.ctrlKey || e.metaKey) && k === "y") { e.preventDefault(); doRedo(); return; }
      if (e.key === " ") { spaceDown = e.type === "keydown"; return; }
      if (e.type !== "keydown" || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Escape") { e.preventDefault(); if (root.querySelector(".skx-menu")) closeMenu(); else closeBtn(); return; }
      var map = { p: "pen", s: "hl", e: "er", h: "pan" }; if (map[k]) { tool = map[k]; toolbar(); }
    }
    document.addEventListener("keydown", onKey); document.addEventListener("keyup", onKey);

    /* ---------- menu, export ---------- */
    function closeMenu() { var m = root.querySelector(".skx-menu"); if (m) m.remove(); }
    function menu() {
      var m = document.createElement("div"); m.className = "skx-menu";
      m.innerHTML = '<button data-mk="fit">⤢ Ajuster la vue</button><hr>' +
        ["plain", "grid", "dots"].map(function (b) { return '<button data-bg="' + b + '" class="' + (data.bg === b ? "on" : "") + '">' + { plain: "▭ Fond uni", grid: "▦ Fond quadrillé", dots: "⠿ Fond à points" }[b] + "</button>"; }).join("") +
        '<hr><button data-mk="png">⬇ Image PNG</button><button data-mk="svg">⬇ Image SVG</button>' +
        '<hr><button data-mk="clear">🗑 Tout effacer</button>' +
        (o.menu || []).map(function (it, i) { return (i ? "" : "<hr>") + '<button data-mi="' + i + '">' + esc(it.label) + "</button>"; }).join("");
      root.appendChild(m);
    }
    function exportSVG() { return svgOf(data, { ink: "#1d1b2e", bg: "#ffffff", pad: 20 }); }
    function exportPNG() {
      var s = exportSVG(); if (!s) { st.textContent = "rien à exporter"; return; }
      var b = bbox(data), w = b.x1 - b.x0 + 40, h = b.y1 - b.y0 + 40, k = Math.min(3, 4096 / Math.max(w, h));
      var img = new Image();
      img.onload = function () {
        var c = document.createElement("canvas"); c.width = Math.round(w * k); c.height = Math.round(h * k);
        var g = c.getContext("2d"); g.drawImage(img, 0, 0, c.width, c.height);
        c.toBlob(function (bl) { if (bl) download(fileName(title()) + ".png", bl); }, "image/png");
      };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s.replace("<svg ", '<svg width="' + Math.round(w * k) + '" height="' + Math.round(h * k) + '" '));
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || tb.contains(b)) return;
      var inMenu = b.closest(".skx-menu");
      if (b.dataset.k === "close") return closeBtn();
      if (b.dataset.k === "undo") return doUndo();
      if (b.dataset.k === "redo") return doRedo();
      if (b.dataset.k === "menu") { if (root.querySelector(".skx-menu")) closeMenu(); else menu(); return; }
      if (!inMenu) return;
      if (b.dataset.mk === "clear" && !b.dataset.armed) { b.dataset.armed = 1; b.textContent = "🗑 Confirmer : tout effacer"; return; }
      closeMenu();
      if (b.dataset.mk === "fit") fit();
      if (b.dataset.bg) { data.bg = b.dataset.bg; applyView(); save(); }
      if (b.dataset.mk === "png") exportPNG();
      if (b.dataset.mk === "svg") { var s = exportSVG(); if (s) download(fileName(title()) + ".svg", new Blob([s], { type: "image/svg+xml" })); else st.textContent = "rien à exporter"; }
      if (b.dataset.mk === "clear" && data.s.length) { snap(); data.s = []; drawAll(); save(); }
      if (b.dataset.mi != null) { save(true); o.menu[+b.dataset.mi].fn(api); }
    });

    /* ---------- fermeture (bouton ‹, Échap, retour du téléphone) ---------- */
    try { history.pushState({ skx: 1 }, ""); } catch (e) { /* rien */ }
    function onPop() { close(true); }
    window.addEventListener("popstate", onPop);
    function onHide() { save(true); }
    window.addEventListener("pagehide", onHide); document.addEventListener("visibilitychange", onHide);
    function onResize() { applyView(); }
    window.addEventListener("resize", onResize);
    function closeBtn() { history.state && history.state.skx ? history.back() : close(); }
    var closed = false;
    function close(fromPop) {
      if (closed) return; closed = true;
      save(true);
      window.removeEventListener("popstate", onPop); window.removeEventListener("pagehide", onHide); window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onHide); document.removeEventListener("keydown", onKey); document.removeEventListener("keyup", onKey);
      if (!fromPop && history.state && history.state.skx) { try { history.back(); } catch (e) { /* rien */ } }
      root.remove();
      if (!document.querySelector(".mde,.skx")) document.documentElement.classList.remove("mde-on");
      o.onClose && o.onClose(JSON.parse(JSON.stringify(data)), title());
    }
    root._close = function () { close(); };
    var api = { close: function () { close(); }, root: root };

    toolbar(); drawAll(); buttons(); requestAnimationFrame(fit);
    return api;
  }

  window.WebAppsSketch = { open: open, svg: svgOf, count: function (d) { return norm(d).s.length; } };
})();
