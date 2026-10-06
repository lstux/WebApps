/* common.js — thème clair / sombre / automatique, partagé par toutes les pages.

   À placer dans le <head>, juste après common.css : le thème mémorisé est appliqué
   avant le premier affichage, sans flash.
     <script src="common.js"> (balise script avec cet attribut src, sans contenu)

   Tout élément portant l'attribut data-theme-toggle fait défiler auto → clair → sombre :
     <button class="iconbtn themebtn" data-theme-toggle></button>      (l'icône est dessinée ici)
     <button class="item" data-theme-toggle>
       <span class="ic" data-theme-icon></span> Thème <span class="sw" data-theme-name></span>
     </button>
   Le choix est gardé dans localStorage (clé « webapps.theme ») et partagé entre les pages et les onglets.
   Les pages peuvent écouter l'événement « webapps:theme » (detail : « auto », « light » ou « dark »). */
(function () {
  "use strict";
  var KEY = "webapps.theme";
  var MODES = ["auto", "light", "dark"];
  var NAMES = { auto: "automatique", light: "clair", dark: "sombre" };
  var root = document.documentElement;

  var ICONS = {
    auto: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
    light: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
    dark: '<path d="M20 14.3A8.3 8.3 0 0 1 9.7 4 8.3 8.3 0 1 0 20 14.3z"/>'
  };
  function svg(mode) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[mode] + "</svg>";
  }

  function read() {
    try {
      var v = localStorage.getItem(KEY);
      return MODES.indexOf(v) >= 0 ? v : "auto";
    } catch (e) { return "auto"; }
  }
  var mode = read();

  function apply() {
    if (mode === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", mode);
  }

  function paint() {
    var label = "Thème : " + NAMES[mode] + " (changer)";
    var toggles = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < toggles.length; i++) {
      var t = toggles[i];
      t.setAttribute("aria-label", label);
      t.title = label;
      t.setAttribute("data-mode", mode);
      var icons = t.querySelectorAll("[data-theme-icon]");
      if (icons.length) for (var j = 0; j < icons.length; j++) icons[j].innerHTML = svg(mode);
      else if (!t.children.length) t.innerHTML = svg(mode);
      var names = t.querySelectorAll("[data-theme-name]");
      for (var k = 0; k < names.length; k++) names[k].textContent = NAMES[mode];
    }
  }

  function set(next, save) {
    if (MODES.indexOf(next) < 0) return;
    mode = next;
    if (save) { try { localStorage.setItem(KEY, mode); } catch (e) { /* stockage indisponible : le choix vaut pour cette page */ } }
    apply();
    paint();
    try { document.dispatchEvent(new CustomEvent("webapps:theme", { detail: mode })); } catch (e) { /* anciens navigateurs */ }
  }

  apply();   // immédiat : le script est dans le <head>

  function init() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-theme-toggle]") : null;
      if (!t) return;
      e.preventDefault();
      set(MODES[(MODES.indexOf(mode) + 1) % MODES.length], true);
    });
    paint();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // Autre onglet ou autre page : même choix.
  window.addEventListener("storage", function (e) { if (e.key === KEY) set(read(), false); });

  window.WebAppsTheme = {
    get: function () { return mode; },
    set: function (m) { set(m, true); }
  };
})();
