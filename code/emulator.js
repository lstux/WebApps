/* emulator.js — bibliothèque de ROMs personnelle + lecteur EmulatorJS, pour l'app Jeux.
 *
 *   WebAppsEmu.start(root, { arg, toast, openDlg, closeDlg, esc }) -> { destroy() }
 *
 * - Les ROMs sont choisies sur l'appareil et gardées dans IndexedDB (base « webapps-emu »).
 *   Elles ne sont jamais envoyées nulle part : ni serveur de synchronisation, ni CDN.
 * - Le moteur (EmulatorJS) est chargé depuis son CDN au premier lancement, puis le navigateur
 *   le garde en cache. Adresse changeable dans le menu (par ex. pour un miroir perso).
 * - Le lecteur tourne dans une iframe srcdoc, retirée à la sortie : plus rien ne reste en mémoire.
 */
(function(){
'use strict';

const DEF_CDN = 'https://cdn.emulatorjs.org/stable/data/';
const KEY_CDN = 'games-pref.emu-cdn';

/* nom affiché, alias de core EmulatorJS, extensions reconnues, remarque */
const SYS = {
  nes:   { n: 'NES',              core: 'nes',       ext: ['nes', 'unf', 'unif'] },
  snes:  { n: 'Super Nintendo',   core: 'snes',      ext: ['sfc', 'smc', 'fig', 'swc'] },
  gb:    { n: 'Game Boy',         core: 'gb',        ext: ['gb'] },
  gbc:   { n: 'Game Boy Color',   core: 'gb',        ext: ['gbc'] },
  gba:   { n: 'Game Boy Advance', core: 'gba',       ext: ['gba'] },
  md:    { n: 'Mega Drive',       core: 'segaMD',    ext: ['md', 'gen', 'smd'] },
  sms:   { n: 'Master System',    core: 'segaMS',    ext: ['sms'] },
  gg:    { n: 'Game Gear',        core: 'segaGG',    ext: ['gg'] },
  a2600: { n: 'Atari 2600',       core: 'atari2600', ext: ['a26'] },
  pce:   { n: 'PC Engine',        core: 'pce',       ext: ['pce'] },
  n64:   { n: 'Nintendo 64',      core: 'n64',       ext: ['n64', 'z64', 'v64'], note: 'lourd, surtout sur téléphone' },
};
const EXT = {};
for (const [id, s] of Object.entries(SYS)) for (const e of s.ext) EXT[e] = id;

const guess = name => EXT[(name.split('.').pop() || '').toLowerCase()] || null;
const clean = name => name.replace(/\.[^.]+$/, '').replace(/[_]+/g, ' ').replace(/\s*[\(\[][^)\]]*[\)\]]/g, '').trim() || name;

/* ---------------------------------------------------------------- IndexedDB */
let dbp = null;
function db(){
  return dbp || (dbp = new Promise((ok, ko) => {
    const r = indexedDB.open('webapps-emu', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('roms', { keyPath: 'id' });
    r.onsuccess = () => ok(r.result);
    r.onerror = () => { dbp = null; ko(r.error); };
  }));
}
async function tx(mode, fn){
  const d = await db();
  return new Promise((ok, ko) => {
    const t = d.transaction('roms', mode), st = t.objectStore('roms'); let out;
    Promise.resolve(fn(st)).then(v => { out = v; }, ko);
    t.oncomplete = () => ok(out); t.onerror = () => ko(t.error); t.onabort = () => ko(t.error);
  });
}
const req = r => new Promise((ok, ko) => { r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); });
const Roms = {
  all: () => tx('readonly', st => req(st.getAll())).then(a => (a || []).map(({ blob, ...m }) => m)),
  get: id => tx('readonly', st => req(st.get(id))),
  put: rec => tx('readwrite', st => req(st.put(rec))),
  del: id => tx('readwrite', st => req(st.delete(id))),
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ---------------------------------------------------------------- styles */
function css(){
  if (document.getElementById('emuCss')) return;
  const s = document.createElement('style'); s.id = 'emuCss';
  s.textContent = `
.emu-add{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:14px;border:2px dashed var(--line);border-radius:var(--r-l);background:var(--card);margin-bottom:14px}
.emu-add.drag{border-color:var(--ac);background:var(--ac-soft)}
.emu-add p{margin:0;flex:1;min-width:180px;color:var(--mut);font-size:13.5px;line-height:1.4}
.emu-sys{margin:18px 4px 8px;font-size:13px;font-weight:750;color:var(--mut);text-transform:uppercase;letter-spacing:.04em}
.emu-list{display:flex;flex-direction:column;gap:8px}
.emu-rom{display:flex;align-items:center;gap:6px;border:1px solid var(--line);border-radius:var(--r-m);background:var(--card);overflow:hidden}
.emu-rom .go{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:12px 14px;border:0;background:none;color:var(--fg);font:inherit;text-align:left;cursor:pointer}
.emu-rom .go b{font-size:15.5px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.emu-rom .go small{color:var(--mut);font-size:12.5px}
.emu-rom .more{border:0;background:none;color:var(--mut);font-size:20px;width:44px;align-self:stretch;cursor:pointer}
.emu-empty{padding:26px 10px;text-align:center;color:var(--mut)}
.emu-play{position:fixed;inset:0;z-index:50;background:#000;display:flex;flex-direction:column}
.emu-play .bar{display:flex;align-items:center;gap:10px;padding:max(6px,env(safe-area-inset-top,0px)) 10px 6px;background:#111;color:#fff}
.emu-play .bar b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:15px}
.emu-play .bar button{border:0;border-radius:999px;background:#ffffff22;color:#fff;font:inherit;font-size:14px;padding:7px 13px;cursor:pointer}
.emu-play iframe{flex:1;width:100%;border:0;background:#000}
.emu-msg{position:absolute;inset:48px 0 0;display:grid;place-items:center;color:#fff;text-align:center;padding:24px;pointer-events:none}
.emu-msg.err{color:#ff9b9b}
`;
  document.head.appendChild(s);
}

/* ---------------------------------------------------------------- page de lecture */
function playerDoc(o){
  // Chaîne JSON insérée dans un <script> : on neutralise « </ » et « <! ».
  const cfg = JSON.stringify(o).replace(/</g, '\\u003c');
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{height:100%;margin:0;background:#000;overflow:hidden}#game{width:100%;height:100%}</style></head>
<body><div id="game"></div><script>
var C=${cfg};
window.EJS_player='#game';window.EJS_core=C.core;window.EJS_gameUrl=C.rom;window.EJS_gameName=C.name;
window.EJS_pathtodata=C.cdn;window.EJS_threads=!!window.crossOriginIsolated;window.EJS_language='fr';
var s=document.createElement('script');s.src=C.cdn+'loader.js';
s.onerror=function(){parent.postMessage({emu:'error'},'*')};
document.body.appendChild(s);
<\/script></body></html>`;
}

/* ---------------------------------------------------------------- vue */
function start(root, opt){
  const { toast, openDlg, closeDlg, esc } = opt;
  css();
  let alive = true, playing = null, url = null;
  const cdn = () => {
    let v = ''; try { v = localStorage.getItem(KEY_CDN) || ''; } catch(e){}
    v = (v || DEF_CDN).trim(); return v.endsWith('/') ? v : v + '/';
  };
  const fmtSize = n => n >= 1048576 ? (n / 1048576).toFixed(1).replace('.0', '') + ' Mo' : Math.max(1, Math.round(n / 1024)) + ' Ko';

  async function render(){
    let list;
    try { list = await Roms.all(); }
    catch(e){ root.innerHTML = `<div class="emu-empty">Le stockage du navigateur n'est pas disponible ici (navigation privée ?).<br>${esc(String(e && e.message || e))}</div>`; return; }
    if (!alive) return;
    const by = {};
    for (const r of list) (by[r.sys] = by[r.sys] || []).push(r);
    const order = Object.keys(SYS).filter(k => by[k]);
    root.innerHTML = `<div class="emu-add" id="emuDrop">
        <button class="btn primary" id="emuAdd">＋ Ajouter des ROMs</button>
        <p>Choisis des fichiers sur ton appareil. Ils restent dans ce navigateur et ne sont envoyés nulle part.</p>
        <input type="file" id="emuFile" multiple hidden>
      </div>
      ${order.length ? order.map(k => `<div class="emu-sys">${SYS[k].n}</div><div class="emu-list">${by[k].sort((a, b) => a.title.localeCompare(b.title)).map(r =>
        `<div class="emu-rom"><button class="go" data-play="${r.id}"><b>${esc(r.title)}</b><small>${fmtSize(r.size)}${r.last ? ' · joué le ' + new Date(r.last).toLocaleDateString('fr-FR') : ''}</small></button><button class="more" data-more="${r.id}" aria-label="Options">⋯</button></div>`).join('')}</div>`).join('')
        : '<div class="emu-empty">Aucune ROM pour l\'instant.<br>Ajoute tes propres fichiers .nes, .sfc, .gb, .gbc, .gba, .md, .sms, .gg, .pce, .a26, .n64… (ou une archive .zip).</div>'}
      <p class="hint">NES, Super Nintendo, Game Boy / Color / Advance, Mega Drive, Master System, Game Gear, PC Engine, Atari 2600, Nintendo 64. Le moteur <a href="https://emulatorjs.org" target="_blank" rel="noopener">EmulatorJS</a> se télécharge au premier lancement (connexion nécessaire), puis reste en cache. <a href="#" id="emuCdn">Adresse du moteur</a></p>`;
    const file = root.querySelector('#emuFile'), drop = root.querySelector('#emuDrop');
    root.querySelector('#emuAdd').onclick = () => file.click();
    file.onchange = () => { addFiles([...file.files]); file.value = ''; };
    ['dragenter', 'dragover'].forEach(e => drop.addEventListener(e, ev => { ev.preventDefault(); drop.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach(e => drop.addEventListener(e, ev => { ev.preventDefault(); drop.classList.remove('drag'); }));
    drop.addEventListener('drop', ev => addFiles([...ev.dataTransfer.files]));
    root.querySelector('#emuCdn').onclick = ev => { ev.preventDefault(); cdnDialog(); };
    root.onclick = ev => {
      const p = ev.target.closest('[data-play]'), m = ev.target.closest('[data-more]');
      if (p) location.hash = 'emu/' + p.dataset.play;
      else if (m) menu(m.dataset.more, list.find(r => r.id === m.dataset.more));
    };
  }

  function askSystem(name){
    return new Promise(ok => {
      openDlg(`<h2>Quel système ?</h2><p>Impossible de le deviner pour « ${esc(name)} ».</p>
        ${Object.entries(SYS).map(([k, s]) => `<button class="item" data-a="${k}">${s.n}</button>`).join('')}
        <div class="btns"><button class="btn" data-a="">Ignorer ce fichier</button></div>`, a => { closeDlg(); ok(a || null); });
    });
  }

  async function addFiles(files){
    let n = 0;
    for (const f of files){
      let sys = guess(f.name);
      if (!sys) sys = await askSystem(f.name);
      if (!sys) continue;
      try { await Roms.put({ id: uid(), title: clean(f.name), file: f.name, sys, size: f.size, added: Date.now(), blob: f }); n++; }
      catch(e){ toast('Impossible de garder « ' + f.name + ' » : ' + (e && e.name === 'QuotaExceededError' ? 'plus de place.' : 'erreur de stockage.')); }
    }
    if (n) toast(n === 1 ? 'ROM ajoutée.' : n + ' ROMs ajoutées.');
    if (alive) render();
  }

  function menu(id, r){
    if (!r) return;
    openDlg(`<h2>${esc(r.title)}</h2>
      <button class="item" data-a="ren"><span class="ic">✏️</span> Renommer</button>
      <button class="item" data-a="sys"><span class="ic">🎮</span> Changer de système<span class="sw">${SYS[r.sys].n}</span></button>
      <button class="item" data-a="del"><span class="ic">🗑</span> Supprimer de cet appareil</button>`, a => {
      if (a === 'ren') openDlg(`<h2>Renommer</h2><input id="emuName" class="in" value="${esc(r.title)}" style="width:100%;box-sizing:border-box">
        <div class="btns"><button class="btn" data-a="no">Annuler</button><button class="btn primary" data-a="ok">Enregistrer</button></div>`, async b => {
        const v = (document.getElementById('emuName').value || '').trim(); closeDlg();
        if (b === 'ok' && v){ const full = await Roms.get(id); full.title = v; await Roms.put(full); render(); }
      });
      else if (a === 'sys') openDlg(`<h2>Système</h2>${Object.entries(SYS).map(([k, s]) => `<button class="item" data-a="${k}">${s.n}${k === r.sys ? '<span class="sw">actuel</span>' : ''}</button>`).join('')}`, async b => {
        closeDlg(); if (!SYS[b]) return;
        const full = await Roms.get(id); full.sys = b; await Roms.put(full); render();
      });
      else if (a === 'del') openDlg(`<h2>Supprimer ?</h2><p>« ${esc(r.title)} » sera retirée de cet appareil (ton fichier d'origine n'est pas touché). Les sauvegardes de jeu faites dans l'émulateur restent.</p>
        <div class="btns"><button class="btn" data-a="no">Annuler</button><button class="btn primary" data-a="yes">Supprimer</button></div>`, async b => {
        closeDlg(); if (b === 'yes'){ await Roms.del(id); render(); }
      });
    });
  }

  function cdnDialog(){
    openDlg(`<h2>Adresse du moteur</h2><p>Dossier <code>data/</code> d'EmulatorJS (avec <code>loader.js</code>). Laisse vide pour l'adresse officielle.</p>
      <input id="emuCdnIn" class="in" placeholder="${esc(DEF_CDN)}" value="${esc(localStorage.getItem(KEY_CDN) || '')}" style="width:100%;box-sizing:border-box">
      <div class="btns"><button class="btn" data-a="no">Annuler</button><button class="btn primary" data-a="ok">Enregistrer</button></div>`, a => {
      const v = (document.getElementById('emuCdnIn').value || '').trim(); closeDlg();
      if (a !== 'ok') return;
      if (v && !/^https?:\/\//i.test(v)) return toast('L\'adresse doit commencer par http(s)://.');
      try { v ? localStorage.setItem(KEY_CDN, v) : localStorage.removeItem(KEY_CDN); } catch(e){}
      toast('Adresse enregistrée.');
    });
  }

  /* ---- lecteur ---- */
  const onMsg = ev => {
    if (playing && ev.data && ev.data.emu === 'error'){
      const m = playing.querySelector('.emu-msg'); if (m){ m.className = 'emu-msg err'; m.innerHTML = 'Impossible de charger le moteur EmulatorJS.<br>Vérifie ta connexion ou l\'adresse du moteur (accueil des émulateurs).'; }
    }
  };
  addEventListener('message', onMsg);

  async function play(id){
    let r;
    try { r = await Roms.get(id); } catch(e){ r = null; }
    if (!alive) return;
    if (!r){ toast('ROM introuvable.'); location.hash = 'emu'; return; }
    r.last = Date.now(); Roms.put(r).catch(() => {});
    url = URL.createObjectURL(r.blob);
    const sys = SYS[r.sys];
    const el = document.createElement('div'); el.className = 'emu-play';
    el.innerHTML = `<div class="bar"><button data-x aria-label="Retour">← Retour</button><b>${esc(r.title)}</b></div>
      <iframe allow="autoplay; gamepad; fullscreen" allowfullscreen></iframe>
      <div class="emu-msg">Chargement du moteur…${sys.note ? '<br><small>' + esc(sys.note) + '</small>' : ''}</div>`;
    const fr = el.querySelector('iframe');
    fr.srcdoc = playerDoc({ core: sys.core, rom: url, name: r.title, cdn: cdn() });
    fr.onload = () => setTimeout(() => { const m = el.querySelector('.emu-msg'); if (m && m.className === 'emu-msg') m.remove(); }, 1500);
    el.querySelector('[data-x]').onclick = () => { location.hash = 'emu'; };
    document.body.appendChild(el); playing = el;
  }
  function stop(){
    if (playing){ const f = playing.querySelector('iframe'); if (f) f.src = 'about:blank'; playing.remove(); playing = null; }
    if (url){ URL.revokeObjectURL(url); url = null; }
  }

  render();
  if (opt.arg) play(opt.arg);
  return { destroy(){ alive = false; stop(); removeEventListener('message', onMsg); } };
}

window.WebAppsEmu = { start, SYSTEMS: SYS, guess, clean };
})();
