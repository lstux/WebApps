# WebApps

Petits outils autonomes : une seule page HTML/CSS/JavaScript, pas de serveur.

## Outils

### 🔖 Liseuse Markdown

Une liseuse pour fichiers Markdown avec:
- Navigation d'arborescence repliable
- Recherche dans le contenu
- Listes de tâches avec progression
- Taille de texte et thème ajustables
- Support de liens relatifs et d'images

📄 **[Documentation](docs/LISEUSE.md)** · 📦 **[markdown_reader.html](code/markdown_reader.html)**

### ✅ TODO

Un gestionnaire de tâches hiérarchique avec:
- Arbre de todos à profondeur illimitée
- Pourcentage d'achèvement coloré, calculé sur les feuilles
- Import/export JSON et texte indenté
- Sauvegarde locale, interface mobile-first

📄 **[Documentation](docs/TODO.md)** · 📦 **[todo.html](code/todo.html)**

### 🔁 Convertisseur

Un convertisseur d'unités et de devises avec:
- Longueur, masse, volume, surface, température, vitesse, temps, données, énergie, pression
- Devises avec taux en ligne, repli sur le dernier taux connu hors ligne
- Toutes les conversions affichées d'un coup

📄 **[Documentation](docs/CONVERTISSEUR.md)** · 📦 **[units_converter.html](code/units_converter.html)**

### 🗺️ Cartes Leaflet

Un gestionnaire de cartes Leaflet avec:
- Points, trajets (poignées pour les déformer) et tracé à main levée
- Fonds de carte au choix (OpenStreetMap, CARTO, relief, satellite…)
- Export du code HTML à insérer dans une page (fragment ou page complète), du JSON et du GeoJSON
- Import JSON / GeoJSON, annuler / rétablir, sauvegarde locale

📄 **[Documentation](docs/CARTES.md)** · 📦 **[leaflet_manager.html](code/leaflet_manager.html)**

## Prochains outils

La liste des outils envisagés est dans [docs/suggested_apps_nextsteps.md](docs/suggested_apps_nextsteps.md).

## Installation

Chaque outil est une page `.html` unique. Deux façons de l'utiliser :

- **Directement** : télécharge le dossier `code/` en entier (les pages utilisent la feuille de style commune `code/common.css`, qui doit rester à sa place) et ouvre la page voulue dans ton navigateur.
- **Après un build** (voir ci-dessous) : `dist/` contient soit l'ensemble des outils avec une page d'accueil, soit des pages autonomes à copier une par une.

### Build

```
python3 build.py                 # dist/ : copie de code/ + index.html qui liste les outils
python3 build.py --standalone    # dist/ : chaque page avec common.css intégré (un fichier = un outil)
python3 build.py --pwa           # comme le premier, plus une application installable (voir ci-dessous)
```

Python 3.8+, sans dépendance. `dist/` est vidé puis recréé à chaque exécution et n'est pas versionné. Les bibliothèques chargées depuis un CDN (Leaflet, marked…) restent en ligne dans tous les modes. L'index lit le `<title>` et la `<meta name="description">` de chaque page.

### Application installable (PWA)

`python3 build.py --pwa` ajoute à `dist/` de quoi installer l'ensemble des outils comme une seule application « WebApps » (écran d'accueil du téléphone, fenêtre dédiée sur ordinateur) :

- `manifest.webmanifest` : nom, couleurs, icônes, raccourcis vers chaque outil (appui long sur l'icône) ;
- `icons/` : icônes PNG générées par `build.py` à partir des couleurs d'accent de `common.css` (aucune image à maintenir) ;
- `sw.js` : service worker. Les pages sont pré-chargées et fonctionnent **hors ligne** ; elles sont lues sur le réseau d'abord, donc une mise à jour est visible dès qu'on est connecté. Les bibliothèques des CDN (Leaflet, marked, polices…) sont gardées en cache après leur première utilisation. Les tuiles de carte, les taux de change et la recherche de lieu ne sont jamais mis en cache.

Chaque page de `dist/` reçoit en plus le lien vers le manifest, `theme-color`, l'icône Apple et l'enregistrement du service worker ; les fichiers de `code/` ne sont pas modifiés. Tous les chemins sont relatifs : `dist/` peut être publié n'importe où, par exemple sous `https://www.lslinux.org/webapps/`.

Option incompatible avec `--standalone` (un fichier isolé ne peut pas porter son manifest ni son service worker).

À prévoir sur le serveur :
- **HTTPS** : obligatoire pour un service worker (`localhost` fait exception pour tester) ;
- le fichier `.webmanifest` doit être servi en `application/manifest+json` (nginx récent : déjà le cas ; Apache : `AddType application/manifest+json .webmanifest`) ;
- ne pas mettre `sw.js` derrière un long cache HTTP, sinon les mises à jour tardent (`Cache-Control: no-cache` pour ce fichier).

À savoir :
- sur iPhone et iPad, l'application installée a un **stockage séparé de Safari** : ce qui a été créé dans l'un (TODO, cartes…) n'apparaît pas dans l'autre. Utiliser l'export / import JSON pour passer de l'un à l'autre ;
- les tuiles de carte, la recherche de lieu et les taux de change demandent une connexion : hors ligne, l'outil s'ouvre et ses données locales restent disponibles ;
- un nouveau build change l'identifiant du cache (empreinte du contenu) : l'ancien est supprimé à l'activation du nouveau service worker.

## Exigences

- Un navigateur moderne (Chrome, Firefox, Safari, Edge)
- Pour charger des adresses : ouvre le fichier localement (pas depuis http://)
- Connexion Internet pour les CDN des bibliothèques et, dans le Convertisseur, pour actualiser les taux de change

## Développement

La structure du repo:

```
.
├── docs/                          # Documentation
│   ├── LISEUSE.md
│   ├── TODO.md
│   ├── CONVERTISSEUR.md
│   ├── CARTES.md
│   ├── STYLE.md                   # Style commun : variables et composants
│   └── suggested_apps_nextsteps.md
├── code/                          # Pages HTML
│   ├── common.css                 # Style partagé par tous les outils
│   ├── leaflet_manager.html
│   ├── markdown_reader.html
│   ├── qrcode_generator.html
│   ├── todo.html
│   └── units_converter.html
├── build.py                       # Construit dist/ (voir « Build » et « PWA »)
├── dist/                          # Sortie du build (non versionnée)
├── LICENSE
└── README.md
```

Chaque page est un fichier `.html` autonome :
- Style commun dans `code/common.css` (voir [docs/STYLE.md](docs/STYLE.md)), CSS spécifique à l'outil inline
- JavaScript inline
- Aucun build n'est nécessaire pour développer : on ouvre `code/<outil>.html` ; `build.py` ne sert qu'à publier

## License

MIT (voir [LICENSE](LICENSE))
