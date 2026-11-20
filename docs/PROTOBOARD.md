# ProtoBoardDesigner — plan de câblage sur plaque à pastilles

L'équivalent de la feuille à petits carreaux : une plaque au pas de 2,54 mm sur laquelle on pose des cartes, des modules et des barrettes Dupont, puis on trace les fils de broche en broche pour chercher la meilleure implantation. Page unique, sans serveur, mobile-first.

📦 [code/06_protoboard_designer.html](../code/06_protoboard_designer.html) · 🧩 [code/protoboard/components/](../code/protoboard/components/)

## Caractéristiques

- **Plaque** : taille réglable en trous (24 × 30 par défaut, environ 7 × 9 cm), ou simple papier quadrillé.
- **Pièces** : cartes et modules (un fichier par composant), barrettes Dupont mâles ou femelles (1 ou 2 rangées, nombre de broches au choix), module générique (nom, broches, rangées, écart, noms des broches).
- **Placement** : glisser-déposer aligné sur les trous ; ⟳ pivoter, ⇋ retourner (module monté à l'envers), ⧉ dupliquer. Les fils accrochés aux broches suivent la pièce.
- **Fils** : un point par coude, angles droits automatiques (désactivables), huit couleurs. Le fil se termine sur une broche ou sur un point d'un autre fil. Un point du fil sélectionné se déplace au doigt.
- **Entre les pastilles** : le bouton « ½ Entre pastilles » accroche aussi les points au demi-pas (repères bleus), pour faire passer un fil entre deux pastilles ou le longer sans qu'il en cache un autre. Une broche proche attire toujours le point.
- **Fil nu / fil isolé** : un fil est fin par défaut (fil nu soudé de pastille en pastille) ; « Fil isolé » le dessine plus épais avec une gaine, pour un fil qui passe par-dessus des soudures (fil de wrapping, fil gainé).
- **Vue de dessous** (⇄) : la plaque est retournée comme une feuille, miroir gauche-droite. Les modules deviennent des empreintes pâles, il ne reste que les pastilles à souder et les fils. Le plan n'est pas modifié et reste éditable dans les deux vues.
- **Image PNG** : menu → Image PNG exporte la vue affichée (dessus ou dessous) sur fond blanc, avec repères de colonnes (A, B…) et de lignes (1, 2…) pour souder.
- **Broches** : couleur selon le rôle (alimentation, masse, GPIO, strapping, UART, à éviter, contrôle), note propre au composant (LED intégrée, PSRAM, adresse I2C…), réseau relié surligné.
- **Contrôles** : alerte si l'alimentation touche la masse, si 5V et 3V3 sont reliés, ou si une broche « à éviter » est utilisée. Liste complète des connexions, copiable.
- **Bibliothèque de circuits** : 💾 Enregistrer range le circuit dans le navigateur (`localStorage`) sous un nom, demandé la première fois ; ensuite Enregistrer (ou Ctrl+S) le met à jour sur place, « Enregistrer sous… » en fait une copie. 📂 Charger rouvre un circuit de la liste ou le supprime. Le nom s'affiche sous le titre, suivi d'un • quand le plan a changé depuis son enregistrement. Rien n'est enregistré tout seul dans la bibliothèque ; le plan en cours, lui, est gardé automatiquement. Les composants « Mes composants » utilisés sont enregistrés avec le circuit et rétablis au chargement.
- **Annuler / rétablir**, sauvegarde automatique dans le navigateur, export / import JSON, thème clair / sombre / auto.
- **Clavier** (ordinateur) : W fil, H demi-pas, D dessous / dessus, R pivoter, F retourner, Suppr effacer, Échap annuler, Entrée terminer un fil, Ctrl+Z / Ctrl+Maj+Z.

Deux fils ne sont reliés que s'ils partagent un **point** (une soudure) : se croiser ne suffit pas. Deux broches au même trou (une barrette posée sur un module, par exemple) sont reliées.

## Composants

Chaque composant est un fichier `.js` dans `code/protoboard/components/`, chargé par une balise de la page :

```html
<script src="protoboard/components/esp32_c3_super_mini.js"></script>
```

Le format `.js` (plutôt que JSON) permet d'ouvrir la page directement depuis le disque (`file://`), où `fetch()` est interdit. `build.py --standalone` intègre ces fichiers dans la page ; `--pwa` les met dans le cache hors ligne.

### Ajouter un composant au dépôt

1. Créer `code/protoboard/components/mon_module.js` (partir d'un fichier existant).
2. Ajouter sa ligne `<script src="protoboard/components/mon_module.js"></script>` dans `code/06_protoboard_designer.html`, avec les autres.

### Ajouter un composant sans toucher au dépôt

- **Depuis un module générique** : ✎ Modifier → « Enregistrer comme composant ». Il rejoint « Mes composants » (gardé dans le navigateur) et l'app affiche le fichier `.js` correspondant, à télécharger ou copier pour l'ajouter au dépôt plus tard.
- **Menu → Composants → Importer** : coller le contenu d'un fichier `.js` (ou son JSON), ou choisir le fichier.
- Un plan exporté contient la définition des composants qu'il utilise : importé sur un autre appareil, ceux qui manquent sont ajoutés à « Mes composants ».

### Format

Coordonnées en pas de grille (1 = 2,54 mm), vue de dessus, broche en haut à gauche en `(0, 0)` en général.

```js
ProtoBoard.component({
  id: 'esp32-c3-super-mini',        // identifiant unique (minuscules, chiffres, tirets)
  name: 'ESP32-C3 Super Mini',      // nom complet, dans « Ajouter »
  label: 'C3 Super Mini',           // nom court posé sur la plaque (facultatif : name)
  category: 'Cartes',               // regroupement dans « Ajouter »
  description: '2×8 broches, écart 6 pas',
  color: '#1b2a3a',                 // couleur du circuit imprimé
  body: { x0: -0.6, y0: -1.3, x1: 6.6, y1: 7.6 },   // contour (facultatif : broches + 0,8)
  deco: [ { shape: 'usb', x: 1.25, y: -2, w: 3.5, h: 1.5 } ],
  columns: [                         // colonnes verticales de broches
    { x: 0, pins: ['5V:power', 'GND:gnd', '3V3:power', 'IO4', 'IO3', 'IO2:strap', 'IO1', 'IO0'] },
    { x: 6, pins: ['IO5', 'IO6', 'IO7', 'IO8:strap', 'IO9:strap', 'IO10', 'IO20/RX:uart', 'IO21/TX:uart'] }
  ],
  notes: { 'IO8': 'LED bleue intégrée ; strapping' }
});
```

| Clé | Rôle |
|-----|------|
| `columns` | `[{ x, y?, pins: [...] }]` : broches de haut en bas à partir de `(x, y)` |
| `rows` | `[{ y, x?, pins: [...] }]` : broches de gauche à droite à partir de `(x, y)` |
| `pins` | `[{ x, y, name, type?, label? }]` : broches placées une à une, pour les formes irrégulières |
| `notes` | texte affiché quand on touche la broche, par nom de broche |
| `deco` | formes décoratives : `usb`, `can` (capot métallique), `antenna`, `chip`, `screen`, `coin` (pile bouton), `rect` (avec `fill`) ; `x`, `y`, `w`, `h` en pas |
| `pinStyle` | `round` (défaut), `male`, `female` |

Une broche s'écrit `'NOM'` ou `'NOM:type'`, avec `type` parmi `power`, `gnd`, `gpio`, `strap`, `uart`, `avoid`, `ctrl`. Sans type, `GND`/`VSS` donnent `gnd`, `VCC`/`VIN`/`VDD`/`5V`/`3V3` donnent `power`, le reste `gpio`. Le nom de la broche s'écrit vers l'intérieur du composant ; `labels: 'left'|'right'|'up'|'down'` sur une colonne ou une rangée (ou `label` sur une broche de `pins`) force un côté.

Les brochages fournis sont vus de dessus, USB en haut : vérifie-les sur ta carte (certains clones diffèrent ; ⇋ retourne une carte montée à l'envers). Le DevKit S3 est dessiné avec 9 pas (22,86 mm) entre ses rangées : change `x` de la seconde colonne et `body.x1` si le tien est plus large.

## Données

Clés `localStorage` : `protoboard.doc.v1` (plan), `protoboard.view.v1` (zoom et position), `protoboard.components.v1` (« Mes composants »), `protoboard.circuits.v1` (bibliothèque de circuits) et `protoboard.current.v1` (circuit ouvert). Rien n'est envoyé sur le réseau.

Export (`protoboard-plan.json`) :

```json
{ "app": "ProtoBoardDesigner", "version": 1,
  "board": { "w": 24, "h": 30, "show": true },
  "parts": [ { "id": "…", "type": "esp32-c3-super-mini", "x": 3, "y": 3, "r": 0, "f": false, "label": "C3 Super Mini", "names": [] } ],
  "wires": [ { "id": "…", "c": "#fdd835", "pts": [[9,5],[12,5],[12,6],[13,6]] } ],
  "components": { "esp32-c3-super-mini": { … } } }
```

Les points d'un fil sont en pas de grille, entiers ou en demi-pas (`12.5`) ; `"iso": true` marque un fil isolé (absent pour un fil nu). Les anciens exports restent valides.

`r` : quarts de tour ; `f` : pièce retournée ; `names` : noms de broches remplacés (vide = noms du composant) ; barrettes et module générique ont en plus `n`, `rows` et `gap`.
