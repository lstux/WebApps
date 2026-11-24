/* mdedit.js — éditeur Markdown plein écran, partagé par les pages (Notebook ; la Liseuse pourra s'en servir).

     <script src="mdedit.js"></script>   (après common.js ; styles injectés ici, couleurs de common.css)

   const ed = WebAppsMD.open({
     title: 'Titre',  titlePlaceholder: 'Titre de la note',   // champ titre (facultatif : title:null le masque)
     text: '# …',
     render: md => html,               // aperçu (HTML déjà nettoyé, ex. marked + DOMPurify)
     onSave(text, title){ … },         // appelé en tapant (après une courte pause) et à la fermeture
     onClose(text, title){ … },        // après la fermeture (bouton ‹, Échap, retour du téléphone)
     menu: [{ label: '⚙ Propriétés', fn(){ … } }],          // boutons de plus (facultatif)
   });
   ed.close();

   Écrire / Aperçu ; sur grand écran, l'écriture montre l'aperçu à côté. Barre d'outils : titre, gras, italique,
   liste, case à cocher, citation, code, lien. Entrée prolonge une liste ; une puce vide la termine.
   Dans l'aperçu, les cases à cocher se cochent (le texte suit).
   WebAppsMD.toggleTask(text, n) : coche ou décoche la n-ième case « - [ ] » d'un texte Markdown. */
(function () {
  "use strict";
  var CSS = [
    ".mde{position:fixed;inset:0;z-index:100;display:flex;flex-direction:column;background:var(--bg,#fff);color:var(--fg);height:100dvh}",
    ".mde-hd{display:flex;align-items:center;gap:6px;padding:calc(8px + env(safe-area-inset-top,0px)) 10px 8px;border-bottom:1px solid var(--line);background:var(--card)}",
    ".mde-hd input{flex:1;min-width:0;font-weight:700;font-size:17px;border:0;background:none;padding:8px 6px;color:inherit}",
    ".mde-hd input:focus{outline:none;background:var(--card2);border-radius:10px}",
    ".mde-hd .sp{flex:1}",
    ".mde-b{width:40px;height:40px;flex:none;display:grid;place-items:center;border-radius:50%;background:none;color:var(--fg);font-size:20px;border:0;cursor:pointer}",
    ".mde-b:hover{background:var(--hover)}",
    ".mde-seg{display:flex;background:var(--card2);border-radius:999px;padding:3px;flex:none}",
    ".mde-seg button{border:0;background:none;color:var(--mut);font:inherit;font-size:13.5px;font-weight:650;padding:6px 11px;border-radius:999px;cursor:pointer}",
    ".mde-seg button.on{background:var(--card);color:var(--fg);box-shadow:0 1px 3px #0002}",
    ".mde-st{font-size:12px;color:var(--mut);white-space:nowrap}",
    ".mde-tb{display:flex;gap:2px;overflow-x:auto;padding:4px 8px;border-bottom:1px solid var(--line);background:var(--card);scrollbar-width:none}",
    ".mde-tb::-webkit-scrollbar{display:none}",
    ".mde-tb button{flex:none;min-width:40px;height:38px;border:0;border-radius:10px;background:none;color:var(--fg);font:inherit;font-size:15px;font-weight:700;cursor:pointer;padding:0 8px}",
    ".mde-tb button:hover,.mde-tb button:active{background:var(--hover)}",
    ".mde-tb .sep{width:1px;background:var(--line);margin:6px 4px;flex:none}",
    ".mde-main{flex:1;min-height:0;display:flex}",
    ".mde-ta{flex:1;min-width:0;border:0;resize:none;padding:14px 16px calc(24px + env(safe-area-inset-bottom,0px));font:15px/1.6 var(--f-mono,monospace);background:var(--bg);color:var(--fg);tab-size:2}",
    ".mde-ta:focus{outline:none}",
    ".mde-pv{flex:1;min-width:0;overflow:auto;padding:14px 18px calc(24px + env(safe-area-inset-bottom,0px));background:var(--card)}",
    ".mde-pv .empty-pv{color:var(--mut)}",
    ".mde-pv input[type=checkbox]{width:18px;height:18px;vertical-align:-3px;margin:0 6px 0 0;cursor:pointer}",
    ".mde-pv li:has(>input[type=checkbox]){list-style:none;margin-left:-1.2em}",
    ".mde[data-mode=write] .mde-pv{display:none}",
    ".mde[data-mode=preview] .mde-ta,.mde[data-mode=preview] .mde-tb{display:none}",
    "@media (min-width:900px){.mde[data-mode=write] .mde-pv{display:block;border-left:1px solid var(--line)}.mde-seg [data-m=preview]{display:none}}",
    ".mde-menu{position:absolute;right:10px;top:calc(56px + env(safe-area-inset-top,0px));z-index:2;background:var(--card);border:1px solid var(--line);border-radius:14px;box-shadow:0 10px 30px #0003;padding:6px;display:grid;min-width:220px}",
    ".mde-menu button{border:0;background:none;color:var(--fg);font:inherit;text-align:left;padding:10px 12px;border-radius:10px;cursor:pointer}",
    ".mde-menu button:hover{background:var(--hover)}",
    "html.mde-on{overflow:hidden}"
  ].join("\n");
  function injectCSS() {
    if (document.getElementById("mde-css")) return;
    var s = document.createElement("style"); s.id = "mde-css"; s.textContent = CSS; document.head.appendChild(s);
  }
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  var TASK = /^(\s*(?:[-*+]|\d+[.)])\s+)\[( |x|X)\]/gm;
  function toggleTask(text, n) {
    var i = 0;
    return String(text).replace(TASK, function (all, pre, st) { return i++ === n ? pre + (st === " " ? "[x]" : "[ ]") : all; });
  }

  var LIST = /^(\s*)((?:[-*+]\s+\[[ xX]\]\s+)|(?:[-*+]\s+)|(?:(\d+)([.)])\s+)|(?:>\s?))/;

  function open(o) {
    injectCSS();
    var cur = document.querySelector(".mde"); if (cur && cur._close) cur._close();
    var wide = function () { return matchMedia("(min-width:900px)").matches; };
    var root = document.createElement("div");
    root.className = "mde"; root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true");
    root.dataset.mode = (o.text || "").trim() && !wide() ? "preview" : "write";
    var hasTitle = o.title !== null;
    root.innerHTML =
      '<div class="mde-hd"><button class="mde-b" data-k="close" aria-label="Fermer" title="Fermer (enregistré)">‹</button>' +
      (hasTitle ? '<input class="mde-ti" type="text" autocomplete="off" placeholder="' + esc(o.titlePlaceholder || "Titre") + '" value="' + esc(o.title || "") + '">' : '<span class="sp"></span>') +
      '<span class="mde-st" aria-live="polite"></span>' +
      '<div class="mde-seg"><button data-m="write">Écrire</button><button data-m="preview">Aperçu</button></div>' +
      (o.menu && o.menu.length ? '<button class="mde-b" data-k="menu" aria-label="Plus">⋯</button>' : "") + "</div>" +
      '<div class="mde-tb" role="toolbar" aria-label="Mise en forme">' +
      '<button data-t="h" title="Titre">H</button><button data-t="b" title="Gras"><b>B</b></button><button data-t="i" title="Italique"><i>I</i></button>' +
      '<span class="sep"></span><button data-t="ul" title="Liste">•</button><button data-t="ol" title="Liste numérotée">1.</button><button data-t="task" title="Case à cocher">☐</button>' +
      '<span class="sep"></span><button data-t="q" title="Citation">❝</button><button data-t="code" title="Code">&lt;/&gt;</button><button data-t="link" title="Lien">🔗</button><button data-t="hr" title="Séparateur">―</button>' +
      '<span class="sep"></span><button data-t="undo" title="Annuler">↶</button><button data-t="redo" title="Rétablir">↷</button></div>' +
      '<div class="mde-main"><textarea class="mde-ta" spellcheck="true" placeholder="Écris en Markdown…&#10;# Titre&#10;- liste&#10;- [ ] à faire&#10;**gras**, `code`, [lien](https://…)"></textarea><div class="mde-pv md"></div></div>';
    document.body.appendChild(root);
    document.documentElement.classList.add("mde-on");
    var ta = root.querySelector(".mde-ta"), pv = root.querySelector(".mde-pv"), ti = root.querySelector(".mde-ti"), st = root.querySelector(".mde-st");
    ta.value = o.text || "";
    var title = function () { return ti ? ti.value.trim() : undefined; };

    var saved = ta.value + "\u0000" + (ti ? ti.value : ""), timer = null;
    function save(now) {
      clearTimeout(timer);
      var go = function () {
        var k = ta.value + "\u0000" + (ti ? ti.value : "");
        if (k === saved) return;
        saved = k;
        try { o.onSave && o.onSave(ta.value, title()); st.textContent = "enregistré"; }
        catch (e) { st.textContent = "⚠ non enregistré"; }
      };
      if (now) go(); else { st.textContent = "…"; timer = setTimeout(go, 600); }
    }
    function preview() {
      if (root.dataset.mode === "write" && !wide()) return;
      pv.innerHTML = ta.value.trim() ? o.render(ta.value) : '<p class="empty-pv">Rien à afficher pour l\'instant.</p>';
      pv.querySelectorAll("input[type=checkbox]").forEach(function (c, i) { c.disabled = false; c.dataset.n = i; });
    }
    function setMode(m) {
      root.dataset.mode = m;
      root.querySelectorAll(".mde-seg button").forEach(function (b) { b.classList.toggle("on", b.dataset.m === m); });
      preview();
      if (m === "write") ta.focus();
    }

    /* Insertion avec l'historique natif (annuler du clavier) quand c'est possible. */
    function insert(text, selFrom, selTo) {
      ta.focus();
      var ok = false;
      try { ok = text ? document.execCommand("insertText", false, text) : ta.selectionStart === ta.selectionEnd || document.execCommand("delete"); } catch (e) { ok = false; }
      if (!ok) { var s = ta.selectionStart; ta.setRangeText(text, s, ta.selectionEnd, "end"); }
      if (selFrom != null) ta.setSelectionRange(selFrom, selTo == null ? selFrom : selTo);
      onInput();
    }
    function wrap(a, b, ph) {
      var s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e) || ph;
      insert(a + sel + b, s + a.length, s + a.length + sel.length);
    }
    function lines(fn) {
      var v = ta.value, s = v.lastIndexOf("\n", ta.selectionStart - 1) + 1, e = v.indexOf("\n", ta.selectionEnd); if (e < 0) e = v.length;
      var out = v.slice(s, e).split("\n").map(fn).join("\n");
      ta.setSelectionRange(s, e); insert(out, s, s + out.length);
    }
    function prefix(p, re) {
      lines(function (l, i) {
        var pp = typeof p === "function" ? p(i) : p;
        return re.test(l) ? l.replace(re, "") : pp + l.replace(LIST, "$1");
      });
    }
    var TOOLS = {
      h: function () { lines(function (l) { var m = l.match(/^(#{1,3})\s/); return m ? (m[1].length < 3 ? "#" + l : l.replace(/^#+\s/, "")) : "## " + l; }); },
      b: function () { wrap("**", "**", "gras"); },
      i: function () { wrap("*", "*", "italique"); },
      ul: function () { prefix("- ", /^\s*[-*+]\s+(?!\[)/); },
      ol: function () { prefix(function (i) { return (i + 1) + ". "; }, /^\s*\d+[.)]\s+/); },
      task: function () { prefix("- [ ] ", /^\s*[-*+]\s+\[[ xX]\]\s+/); },
      q: function () { prefix("> ", /^>\s?/); },
      code: function () {
        var s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e);
        if (sel.indexOf("\n") >= 0) insert("```\n" + sel + "\n```", s + 4, s + 4 + sel.length); else wrap("`", "`", "code");
      },
      link: function () {
        var s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e);
        if (/^https?:\/\/\S+$/.test(sel)) insert("[lien](" + sel + ")", s + 1, s + 5);
        else { var t = sel || "texte", h = "[" + t + "](https://)"; insert(h, s + t.length + 3, s + h.length - 1); }
      },
      hr: function () { var s = ta.selectionStart, pre = s && ta.value[s - 1] !== "\n" ? "\n" : ""; insert(pre + "\n---\n\n"); },
      undo: function () { ta.focus(); try { document.execCommand("undo"); } catch (e) { /* rien */ } onInput(); },
      redo: function () { ta.focus(); try { document.execCommand("redo"); } catch (e) { /* rien */ } onInput(); }
    };

    function onInput() { save(false); if (wide() && root.dataset.mode === "write") { clearTimeout(onInput.t); onInput.t = setTimeout(preview, 250); } }
    ta.addEventListener("input", onInput);
    if (ti) ti.addEventListener("input", function () { save(false); });
    if (ti) ti.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); setMode("write"); ta.focus(); } });

    /* Entrée dans une liste : nouvelle puce (case décochée, numéro suivant) ; sur une puce vide, fin de la liste. */
    ta.addEventListener("keydown", function (e) {
      if (e.key === "Tab") { e.preventDefault(); if (e.shiftKey) lines(function (l) { return l.replace(/^ {1,2}/, ""); }); else if (ta.selectionStart !== ta.selectionEnd) lines(function (l) { return "  " + l; }); else insert("  "); return; }
      if (e.key !== "Enter" || e.shiftKey || e.isComposing || ta.selectionStart !== ta.selectionEnd) return;
      var v = ta.value, s = ta.selectionStart, ls = v.lastIndexOf("\n", s - 1) + 1, line = v.slice(ls, s), m = line.match(LIST);
      if (!m) return;
      e.preventDefault();
      if (line.trim() === m[0].trim()) { ta.setSelectionRange(ls, s); insert(""); return; }
      var p = m[3] ? m[1] + (+m[3] + 1) + m[4] + " " : m[0].replace(/\[[xX]\]/, "[ ]");
      insert("\n" + p);
    });

    pv.addEventListener("click", function (e) {
      var c = e.target.closest && e.target.closest("input[type=checkbox]"); if (!c) return;
      ta.value = toggleTask(ta.value, +c.dataset.n); save(true); preview();
    });

    root.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || !root.contains(b)) return;
      var menu = root.querySelector(".mde-menu");
      if (menu && !menu.contains(b)) menu.remove();
      if (b.dataset.t && TOOLS[b.dataset.t]) { e.preventDefault(); TOOLS[b.dataset.t](); return; }
      if (b.dataset.m) { setMode(b.dataset.m); return; }
      if (b.dataset.k === "close") { history.state && history.state.mde ? history.back() : close(); return; }
      if (b.dataset.k === "menu") {
        if (menu) return;
        var m = document.createElement("div"); m.className = "mde-menu";
        o.menu.forEach(function (it, i) { var x = document.createElement("button"); x.textContent = it.label; x.dataset.mi = i; m.appendChild(x); });
        root.appendChild(m); return;
      }
      if (b.dataset.mi != null) { var it = o.menu[+b.dataset.mi]; b.closest(".mde-menu").remove(); save(true); it.fn(api); }
    });
    /* La barre d'outils ne doit pas voler le focus (sinon la sélection est perdue sur téléphone). */
    root.querySelector(".mde-tb").addEventListener("pointerdown", function (e) { if (e.target.closest("button")) e.preventDefault(); });

    function onKey(e) { if (e.key === "Escape" && !e.defaultPrevented) { e.preventDefault(); history.state && history.state.mde ? history.back() : close(); } }
    document.addEventListener("keydown", onKey);
    /* Bouton retour du téléphone : ferme l'éditeur au lieu de quitter la page. */
    try { history.pushState({ mde: 1 }, ""); } catch (e) { /* rien */ }
    function onPop() { close(true); }
    window.addEventListener("popstate", onPop);
    function onHide() { save(true); }
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onHide);

    var closed = false;
    function close(fromPop) {
      if (closed) return; closed = true;
      save(true);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onHide);
      document.removeEventListener("keydown", onKey);
      if (!fromPop && history.state && history.state.mde) { try { history.back(); } catch (e) { /* rien */ } }
      root.remove();
      if (!document.querySelector(".mde,.skx")) document.documentElement.classList.remove("mde-on");
      o.onClose && o.onClose(ta.value, title());
    }
    root._close = function () { close(); };
    var api = { close: function () { close(); }, root: root, textarea: ta };

    setMode(root.dataset.mode);
    if (hasTitle && !ti.value && !ta.value) setTimeout(function () { ti.focus(); }, 30);
    else if (root.dataset.mode === "write") setTimeout(function () { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }, 30);
    return api;
  }

  window.WebAppsMD = { open: open, toggleTask: toggleTask };
})();
