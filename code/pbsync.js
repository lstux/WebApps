/* pbsync.js — écran « Synchronisation » partagé par les pages qui utilisent pbstore.js (PocketBase).

   À placer dans le <head> après common.js et pbstore.js :
     <script src="common.js"></script> <script src="pbstore.js"></script> <script src="pbsync.js"></script>

   const pb = new PBStore({ app: "todo", prefix: "" });
   const sync = PBSync.init(pb, {
     adopt: ["todo-tree-v1"],            // clés déjà présentes en local avant la synchro (la version du serveur gagne)
     note: "…",                          // phrase propre à l'app, ajoutée à l'écran de connexion
     onChange(key, value){ … return "message" },   // valeur remplacée par le serveur : relire, redessiner ; le texte renvoyé s'affiche
     onStatus(texte){ … }                // « non connecté » ou l'email : pour l'entrée de menu
   });
   sync.open();                          // ouvre l'écran (depuis le menu de l'app)
   sync.sync(true);                      // synchronise tout de suite

   Synchronise à l'ouverture, au retour en ligne et au retour sur l'onglet (au plus toutes les 20 s : l'authentification
   du serveur est limitée en débit). Utilise les classes de common.css (.sheet, .btn, .field, .toast). */
(function (global) {
  "use strict";
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  function init(pb, opts) {
    opts = opts || {};
    var dlg = null, toastEl = null, toastTimer = 0, syncing = false, lastSync = 0, msg = "";

    function status() { if (opts.onStatus) opts.onStatus(pb.connected ? pb.email : "non connecté"); }
    function toast(text, err) {
      if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
      toastEl.textContent = text; toastEl.className = "toast" + (err ? " err" : ""); toastEl.hidden = false;
      clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.hidden = true; }, err ? 7000 : 4000);
    }

    pb.onChange = function (key, value) {
      var t = opts.onChange ? opts.onChange(key, value) : null;
      if (t) toast(t);
    };
    pb.onError = function (e) {
      msg = "Erreur : " + (e && e.message || e);
      if (e && (e.status === 401 || e.status === 403)) { toast("Synchronisation : reconnecte-toi (menu → Synchronisation).", true); status(); }
      console.warn("pbstore :", e);
    };

    function sync(manual) {
      if (!pb.connected || syncing) return Promise.resolve(null);
      if (!manual && Date.now() - lastSync < 20000) return Promise.resolve(null);
      syncing = true; lastSync = Date.now();
      return pb.sync().then(function (r) {
        msg = "Synchronisé à " + new Date().toLocaleTimeString("fr-FR", { timeStyle: "short" }) + " · " + r.pushed + " envoyé(s), " + r.pulled + " reçu(s)";
        return r;
      }).catch(function (e) { pb.onError(e); return null; })
        .then(function (r) { syncing = false; return r; });
    }

    function render() {
      var h = '<div class="grab"></div><h2>Synchronisation</h2>';
      if (pb.connected) {
        h += '<p>Connecté : <b>' + esc(pb.email) + '</b> · ' + esc(pb.url) + '</p><p id="pbsMsg">' + esc(msg || "Pas encore synchronisé sur cette page.") + '</p>' +
          '<div class="btns"><button class="btn" data-pbs="logout">Se déconnecter</button><button class="btn primary" data-pbs="now">Synchroniser maintenant</button></div>' +
          "<p>Les données de cette page sont copiées sur le serveur et retrouvées sur tes autres appareils. La dernière modification gagne, clé par clé : les horloges des appareils doivent être à peu près justes. Les valeurs sont lisibles par l'administrateur du serveur.</p>";
      } else {
        h += "<p>Facultatif : retrouve les données de cette page sur tes autres appareils. Sans connexion, tout reste dans ce navigateur.</p>" +
          '<div style="margin:0 8px"><label class="lbl" for="pbsUrl">Serveur</label><input class="field" type="text" id="pbsUrl" value="' + esc(pb.url) + '" autocomplete="off" autocapitalize="off" spellcheck="false">' +
          '<label class="lbl" for="pbsMail" style="margin-top:8px;display:block">Email</label><input class="field" type="email" id="pbsMail" autocomplete="username" autocapitalize="off" spellcheck="false">' +
          '<label class="lbl" for="pbsPw" style="margin-top:8px;display:block">Mot de passe</label><input class="field" type="password" id="pbsPw" autocomplete="current-password"></div>' +
          '<div class="btns"><button class="btn primary" data-pbs="login">Se connecter</button></div>' +
          "<p>Les comptes sont créés par l'administrateur. Le mot de passe n'est pas gardé, seulement un jeton. " + esc(opts.note || "") + "</p>";
      }
      dlg.firstChild.innerHTML = h;
    }

    function open() {
      if (!dlg) {
        dlg = document.createElement("dialog"); dlg.className = "sheet";
        dlg.innerHTML = '<div class="inner"></div>';
        document.body.appendChild(dlg);
        dlg.addEventListener("click", function (e) {
          if (e.target === dlg) { dlg.close(); return; }
          var b = e.target.closest ? e.target.closest("[data-pbs]") : null;
          if (b) act(b.getAttribute("data-pbs"), b);
        });
      }
      render();
      if (!dlg.open) dlg.showModal();
    }

    function act(a, b) {
      if (a === "logout") { pb.logout(); msg = ""; status(); render(); }
      if (a === "now") { b.disabled = true; sync(true).then(function (r) { if (dlg.open) render(); if (r) toast("Synchronisé."); }); }
      if (a === "login") {
        var url = dlg.querySelector("#pbsUrl").value.trim(), mail = dlg.querySelector("#pbsMail").value.trim(), pw = dlg.querySelector("#pbsPw").value;
        if (!mail || !pw) { toast("Email et mot de passe, s'il te plaît.", true); return; }
        b.disabled = true; b.textContent = "Connexion…";
        pb.login(url, mail, pw).then(function () {
          pb.adopt(opts.adopt || []); status();
          return sync(true);
        }).then(function () { if (dlg.open) render(); toast("Connecté."); })
          .catch(function (e) {
            toast(e.status === 429 ? "Trop d'essais, attends quelques secondes." : e.status === 400 ? "Identifiants refusés." : "Connexion impossible : " + (e.message || e), true);
            b.disabled = false; b.textContent = "Se connecter";
          });
      }
    }

    global.addEventListener("online", function () { sync(false); });
    document.addEventListener("visibilitychange", function () { if (!document.hidden) sync(false); });
    pb.adopt(opts.adopt || []);
    status();
    sync(true);
    return { open: open, sync: sync, toast: toast };
  }

  global.PBSync = { init: init };
})(window);
