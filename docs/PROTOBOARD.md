# ProtoBoardDesigner — plan de câblage sur plaque à pastilles

L'équivalent de la feuille à petits carreaux : une plaque au pas de 2,54 mm sur laquelle on pose des cartes, des modules et des barrettes Dupont, puis on trace les fils de broche en broche pour chercher la meilleure implantation. Page unique, sans serveur, mobile-first.

📦 [code/06_protoboard_designer.html](../code/06_protoboard_designer.html) · 🧩 [code/protoboard/components/](../code/protoboard/components/)

## Caractéristiques

- **Plaque** : taille réglable en trous (24 × 30 par défaut, environ 7 × 9 cm), ou simple papier quadrillé.
- **Pièces** : cartes et modules (un fichier par composant), barrettes Dupont mâles ou femelles (1 ou 2 rangées, nombre de broches au choix), module générique (nom, broches, rangées, écart, noms des broches).
- **Placement** : glisser-déposer aligné sur les trous ; ⟳ pivoter, ⇋ retourner (module monté à l'envers), ⧉ dupliquer. Les fils accrochés aux broches suivent la pièce.
- **Sélection multiple** : « ⬚ Sélection multiple » (ou « ⬚ Plusieurs » sur une pièce sélectionnée), puis toucher les pièces et les fils pour les ajouter ou les retirer, ou tracer un rectangle sur une zone vide (pièces entièrement dedans, fils dont tous les points sont dedans). Sur ordinateur : Maj+clic et Maj+glisser. Glisser un élément du groupe déplace tout : les fils sélectionnés et ceux qui relient deux pièces du groupe suivent en entier, les autres fils accrochés suivent par leur bout. Boutons : verrouiller/déverrouiller, dupliquer (copie à droite), supprimer (les pièces verrouillées restent), Tout, Terminer. Un groupe qui contient une pièce verrouillée ne se déplace pas.
- **Breadboards** (Ajouter → Breadboards) : 830 (63 colonnes), 400 (30 colonnes) et 170 (mini, sans rails). Chaque demi-colonne de 5 trous est reliée, chaque rail + / − aussi sur toute sa longueur (rails continus) ; la rainure centrale fait 3 pas (un DIP s'y pose à cheval). Une broche ou un fil planté dans un trou est relié à toute sa colonne : les connexions, alertes et réseaux en tiennent compte, sans lister les trous eux-mêmes. Les breadboards se dessinent sous les autres pièces ; masquer la plaque à pastilles (menu → Plaque) pour un montage tout breadboard. Pour déplacer une breadboard avec ce qui est planté dessus : sélection multiple. Le circuit imprimé les signale (non gravables).
- **Verrouillage** : 🔓 / 🔒 sur une pièce sélectionnée (ou L) la fige : plus de déplacement, de rotation, de retournement ni de suppression ; elle reste sélectionnable (broches, réseau, ✎ Modifier). Un cadenas s'affiche à son coin. Menu ☰ → Tout verrouiller / Tout déverrouiller. Les fils restent modifiables.
- **Fils** : un point par coude, angles droits automatiques (désactivables), huit couleurs. Le fil se termine sur une broche ou sur un point d'un autre fil. Sur un fil sélectionné, un point se déplace au doigt, un toucher sur le fil y ajoute un point, et un point touché se retire avec « Retirer le point » (un fil garde au moins 2 points).
- **Entre les pastilles** : le bouton « ½ Entre pastilles » accroche aussi les points au demi-pas (repères bleus), pour faire passer un fil entre deux pastilles ou le longer sans qu'il en cache un autre. Une broche proche attire toujours le point.
- **Fil nu / fil isolé** : un fil est fin par défaut (fil nu soudé de pastille en pastille) ; « Fil isolé » le dessine plus épais avec une gaine, pour un fil qui passe par-dessus des soudures (fil de wrapping, fil gainé).
- **Vue de dessous** (⇄) : la plaque est retournée comme une feuille, miroir gauche-droite. Les modules deviennent des empreintes pâles, il ne reste que les pastilles à souder et les fils. Le plan n'est pas modifié et reste éditable dans les deux vues.
- **Image PNG** : menu → Image PNG exporte la vue affichée (dessus ou dessous) sur fond blanc, avec repères de colonnes (A, B…) et de lignes (1, 2…) pour souder.
- **Broches** : couleur selon le rôle (alimentation, masse, GPIO, strapping, UART, à éviter, contrôle), note propre au composant (LED intégrée, PSRAM, adresse I2C…), réseau relié surligné.
- **Contrôles** : alerte si l'alimentation touche la masse, si 5V et 3V3 sont reliés, ou si une broche « à éviter » est utilisée. Liste complète des connexions, copiable.
- **Bibliothèque de circuits** (menu ☰) : Enregistrer range le circuit dans le navigateur (`localStorage`) sous un nom, demandé la première fois ; ensuite Enregistrer (ou Ctrl+S) le met à jour sur place, « Enregistrer sous… » en fait une copie. Charger rouvre un circuit de la liste ou le supprime. Le nom s'affiche sous le titre, suivi d'un • quand le plan a changé depuis son enregistrement. Rien n'est enregistré tout seul dans la bibliothèque ; le plan en cours, lui, est gardé automatiquement. Les composants « Mes composants » utilisés sont enregistrés avec le circuit et rétablis au chargement.
- **Circuit imprimé** (menu ☰ → Circuit imprimé) : simple face, composants dessus et cuivre dessous. Les fils nus deviennent des pistes, les fils isolés des straps (fils soudés côté composants, un trou à chaque bout). Aperçu côté cuivre (vu de dessous) ou de dessus. Réglages de piste, pastille, perçage et isolement minimal. Vérification : piste qui passe sur une pastille d'un autre réseau ou trop près, pistes de réseaux différents qui se croisent ou se frôlent, pastilles trop proches, éléments hors plaque. Export ZIP : `*-B_Cu.gbl` (Gerber du cuivre, en vue de dessus comme tout Gerber), `*-Edge_Cuts.gm1` (contour, demi-pas autour des trous), `*.drl` (perçages Excellon en mm) et `*-LISEZMOI.txt` (réglages, liste des straps). À ouvrir dans un logiciel de FAO (FlatCAM, pcb2gcode…) pour la gravure à l'anglaise et le perçage à la CNC. Ou directement **G-code CNC…** (GRBL) : trois fichiers à passer dans l'ordre sans bouger la plaque (`-1-gravure.nc` à la fraise en V, `-2-percage.nc`, `-3-decoupe.nc` avec pattes de maintien), plaque retournée côté cuivre, origine au coin bas-gauche, Z0 sur le cuivre. Réglages : angle et pointe de la fraise en V, profondeur (largeur gravée affichée), nombre de passes et recouvrement, avances, broche M3 pilotée ou à la main, épaisseur de plaque, fraise et pattes du contour. Aperçu des trajets et durée estimée. Les passes de gravure sont les courbes de niveau de la distance au cuivre (calculée sur une image à 20 px/mm), avec une marge de sécurité de 0,06 mm.
- **Lien direct** : `protoboard_designer.html#open=<id>` ouvre un circuit de la bibliothèque (utilisé par le Notebook), comme Charger : ↶ rend le plan précédent.
- **Annuler / rétablir**, sauvegarde automatique dans le navigateur, export / import JSON, thème clair / sombre / auto.
- **Clavier** (ordinateur) : W fil, H demi-pas, D dessous / dessus, R pivoter, F retourner, L verrouiller, Suppr effacer, Échap annuler, Entrée terminer un fil, Ctrl+Z / Ctrl+Maj+Z.

Deux fils ne sont reliés que s'ils partagent un **point** (une soudure) : se croiser ne suffit pas. Sur un circuit imprimé, en revanche, une piste touche tout ce qu'elle croise : c'est ce que signale la vérification du circuit imprimé. Deux broches au même trou (une barrette posée sur un module, par exemple) sont reliées.

## Composants

Chaque composant est un fichier `.js` dans `code/protoboard/components/`, chargé par une balise de la page :

```html
<script src="protoboard/components/esp32_c3_super_mini.js"></script>
```

Le format `.js` (plutôt que JSON) permet d'ouvrir la page directement depuis le disque (`file://`), où `fetch()` est interdit. `build.py --standalone` intègre ces fichiers dans la page ; `--pwa` les met dans le cache hors ligne.

### Ajouter un composant au dépôt

1. Créer `code/protoboard/components/mon_module.js` (partir d'un fichier existant).
2. Ajouter sa ligne `<script src="protoboard/components/mon_module.js"></script>` dans `code/06_protoboard_designer.html`, avec les autres.

### Composants fournis

Ajouter → par catégorie. Les brochages viennent de la documentation courante des modules et **sont à vérifier sur ta pièce** (ordre des broches, tensions, écart entre rangées) : les clones diffèrent, ⇋ retourne une pièce.

- **Pièces à 2 pattes** (Ajouter → « Pièces à 2 pattes ») : résistance, diode, condensateur céramique ou chimique, LED. L'écart entre les pattes est réglable (✎ Modifier → Écart), les broches se renomment comme les autres (diode : `A`/`K`, chimique : `+`/`-`).
- **Discrets** : LED RGB, potentiomètre, transistors NPN/PNP, MOSFET, PC817, buzzer, bouton, interrupteur, KY-040, joystick. **Alimentation** : LM7805, AMS1117, TP4056, MT3608, LM2596.
- **Capteurs** : BMP180/280, BME280, AHT20, SHT31, DHT, DS18B20, MPU6050, HC-SR04, PIR, ADS1115, DS3231, INA219.
- **Écrans** : OLED SSD1306 (I2C, SPI), SH1106 1,3" (I2C, SPI), TFT ST7735 et ILI9341.
- **Modules** : microSD, LoRa SX127x, NRF24L01, GPS NEO-6M, PCF8574, MCP23017, adaptateur de niveau, relais, ponts en H (L298N, TB6612, DRV8833).
- **Breadboards** : 830, 400 et 170 trous (liaisons internes et rails continus).
- **Cartes** : ESP32 (C3/S3 Super Mini, S3 DevKit, DevKit 30 et 38 broches), Wemos D1 mini, Arduino Nano, Pro Micro, Pico, Blue Pill, Black Pill.

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
| `pinStyle` | `round` (défaut), `male`, `female`, `hole` (trou de breadboard : pas de nom affiché par trou, ni de pastille dessous) |
| `buses` | `[['A1', 'B1', …], …]` : groupes de broches reliées à l'intérieur du composant (colonnes et rails d'une breadboard) |
| `under` | `true` : dessiné sous les autres pièces (support : breadboard) |
| `marks` | `[{ x, y, t }]` : repères écrits sur le composant (lettres de rangées, numéros de colonnes) |

Une broche s'écrit `'NOM'` ou `'NOM:type'`, avec `type` parmi `power`, `gnd`, `gpio`, `strap`, `uart`, `avoid`, `ctrl`. Sans type, `GND`/`VSS` donnent `gnd`, `VCC`/`VIN`/`VDD`/`5V`/`3V3` donnent `power`, le reste `gpio`. Le nom de la broche s'écrit vers l'intérieur du composant ; `labels: 'left'|'right'|'up'|'down'` sur une colonne ou une rangée (ou `label` sur une broche de `pins`) force un côté.

Les brochages fournis sont vus de dessus, USB en haut : vérifie-les sur ta carte (certains clones diffèrent ; ⇋ retourne une carte montée à l'envers). Le DevKit S3 est dessiné avec 9 pas (22,86 mm) entre ses rangées : change `x` de la seconde colonne et `body.x1` si le tien est plus large.

## Synchronisation (facultative)

Menu ☰ → **Synchronisation** : serveur (`https://store.lslinux.org` par défaut), email et mot de passe d'un compte PocketBase créé par l'administrateur. Une fois connecté, le plan en cours, chaque circuit enregistré et « Mes composants » sont copiés sur le serveur et retrouvés sur tes autres appareils. La synchro tourne à l'ouverture, au retour en ligne, quand l'onglet redevient visible et à la demande (« Synchroniser maintenant »). La dernière modification gagne, clé par clé ; si le plan en cours change à distance, l'app le remplace et propose ↶ pour revenir. Le mot de passe n'est pas gardé, seulement un jeton, partagé avec TODO et la Liseuse (une seule connexion pour les trois). Sans connexion, rien ne change. Détails : [SYNCHRO.md](SYNCHRO.md) ; le module est [code/pbstore.js](../code/pbstore.js).

## Données

Clés `localStorage` : `protoboard.doc.v1` (plan), `protoboard.view.v1` (zoom et position), `protoboard.components.v1` (« Mes composants »), `protoboard.circuit.<id>` (un circuit de la bibliothèque par clé ; l'ancienne clé `protoboard.circuits.v1` est migrée au chargement) et `protoboard.current.v1` (circuit ouvert). La vue et le circuit ouvert restent propres à l'appareil. Sans synchronisation activée, rien n'est envoyé sur le réseau.

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
