# WebApps

Petits outils autonomes : une seule page HTML/CSS/JavaScript, pas de serveur.

## Outils

### 🔖 Liseuse Markdown

Une liseuse pour fichiers Markdown avec:
- Favoris (documents, dépôts GitHub, groupes repliables, glisser-déposer)
- Navigation d'arborescence repliable
- Recherche dans le contenu
- Listes de tâches avec progression
- Taille de texte et thème (auto, clair, sombre) ajustables
- Support de liens relatifs et d'images

📄 **[Documentation](docs/LISEUSE.md)** · 📦 **[02_markdown_reader.html](code/02_markdown_reader.html)**

### ✅ TODO

Un gestionnaire de tâches hiérarchique avec:
- Arbre de todos à profondeur illimitée
- Pourcentage d'achèvement coloré, calculé sur les feuilles
- Glisser-déposer pour réordonner ou changer de parent (souris et tactile)
- Import/export JSON et texte indenté
- Sauvegarde locale, interface mobile-first

📄 **[Documentation](docs/TODO.md)** · 📦 **[01_todo.html](code/01_todo.html)**

### 🔁 Convertisseur

Un convertisseur d'unités et de devises avec:
- Longueur, masse, volume, surface, température, vitesse, temps, données, énergie, pression
- Devises avec taux en ligne, repli sur le dernier taux connu hors ligne
- Toutes les conversions affichées d'un coup

📄 **[Documentation](docs/CONVERTISSEUR.md)** · 📦 **[03_units_converter.html](code/03_units_converter.html)**

### 🗺️ Cartes Leaflet

Un gestionnaire de cartes Leaflet avec:
- Points, trajets (poignées pour les déformer) et tracé à main levée
- Fonds de carte au choix (OpenStreetMap, CARTO, relief, satellite…)
- Export du code HTML à insérer dans une page (fragment ou page complète), du JSON et du GeoJSON
- Import JSON / GeoJSON, annuler / rétablir, sauvegarde locale

📄 **[Documentation](docs/CARTES.md)** · 📦 **[04_leaflet_manager.html](code/04_leaflet_manager.html)**

## Prochains outils

La liste des outils envisagés est dans [docs/suggested_apps_nextsteps.md](docs/suggested_apps_nextsteps.md).

## Installation

Chaque outil est une page `.html` unique. Deux façons de l'utiliser :

- **Directement** : télécharge le dossier `code/` en entier (les pages utilisent `code/common.css`, `code/common.js` et le dossier `code/icons/`, qui doivent rester à leur place) et ouvre la page voulue dans ton navigateur.
- **Après un build** (voir ci-dessous) : `dist/` contient soit l'ensemble des outils avec une page d'accueil, soit des pages autonomes à copier une par une.

### Build

```
python3 build.py                 # dist/ : copie de code/ + index.html qui liste les outils
python3 build.py --standalone    # dist/ : chaque page avec TOUT intégré, bibliothèques et polices des CDN comprises (un fichier = un outil, hors ligne)
python3 build.py --standalone --refresh   # idem, en retéléchargeant les bibliothèques au lieu d'utiliser le cache
python3 build.py --pwa           # comme le premier, plus une application installable (voir ci-dessous)
python3 build.py --pwa --deploy  # construit, puis envoie dist/ sur le serveur (voir « Déploiement »)
```

Python 3.8+, sans dépendance. `dist/` est vidé puis recréé à chaque exécution et n'est pas versionné. Dans les modes normal et `--pwa`, les bibliothèques chargées depuis un CDN (Leaflet, marked…) restent des liens (le service worker les garde en cache) ; `--standalone` les intègre. L'index est une grille de cartes : il lit le `<title>`, la `<meta name="description">` et l'icône (`<link rel="icon">`) de chaque page, et reprend les couleurs du dégradé de l'icône pour sa carte.

### Pages autonomes (`--standalone`)

Chaque outil devient **un seul fichier `.html`**, utilisable hors ligne et copiable n'importe où (clé USB, mail, dossier synchronisé…). Le build y insère :

- `common.css` et `common.js`, les icônes (en `data:`) ;
- les bibliothèques des CDN : Leaflet (script, feuille de style et ses images), marked, DOMPurify, highlight.js, générateur de QR code ;
- les polices Google de la Liseuse, **limitées à l'alphabet latin** (le français y est complet ; les autres alphabets retombent sur la police du système).

**Le premier build a besoin d'Internet** : les fichiers sont téléchargés puis gardés dans `.cache/standalone/` (non versionné). Les builds suivants se font sans réseau ; `--refresh` retélécharge tout (par exemple pour passer à une nouvelle version d'une bibliothèque : change l'adresse dans la page, relance). Si un téléchargement échoue, le build s'arrête avec un message clair plutôt que de produire une page à moitié en ligne.

Ce qui reste en ligne, par nature : les taux de change du Convertisseur, les tuiles de carte et la recherche de lieu de Cartes, et le chargement d'une adresse ou d'un dépôt GitHub dans la Liseuse. Il n'y a pas d'index (donc pas de lien d'accueil) dans ce mode. Compte environ 40 Ko pour le TODO et le Convertisseur, et quelques centaines de Ko pour les outils qui embarquent une bibliothèque.

**Ordre des outils** : un préfixe numérique sur le nom d'une page de `code/` (`10_todo.html`, `20_markdown_reader.html`…) fixe sa place dans l'index et dans les raccourcis du manifest ; les pages sans préfixe viennent ensuite, par ordre alphabétique. Le préfixe ne sert qu'à classer : `build.py` le retire de tous les noms publiés (`dist/todo.html`, adresses, index, manifest, cache hors ligne). Deux pages qui donneraient le même nom (`10_todo.html` et `20_todo.html`) font échouer le build.

### Application installable (PWA)

`python3 build.py --pwa` ajoute à `dist/` de quoi installer l'ensemble des outils comme une seule application « WebApps » (écran d'accueil du téléphone, fenêtre dédiée sur ordinateur) :

- `manifest.webmanifest` : nom, couleurs, icônes, raccourcis vers chaque outil (appui long sur l'icône) ;
- `icons/` : icônes PNG générées par `build.py` à partir des couleurs d'accent de `common.css` (aucune image à maintenir) ;
- `sw.js` : service worker. Les pages sont pré-chargées et fonctionnent **hors ligne** ; elles sont lues sur le réseau d'abord, donc une mise à jour est visible dès qu'on est connecté. Les bibliothèques des CDN (Leaflet, marked, polices…) sont gardées en cache après leur première utilisation. Les tuiles de carte, les taux de change et la recherche de lieu ne sont jamais mis en cache.

Chaque page de `dist/` reçoit en plus le lien vers le manifest, `theme-color`, l'icône Apple et l'enregistrement du service worker ; les fichiers de `code/` ne sont pas modifiés. Tous les chemins sont relatifs : `dist/` peut être publié n'importe où, par exemple sous `https://www.lslinux.org/webapps/`.

Option incompatible avec `--standalone` (un fichier isolé ne peut pas porter son manifest ni son service worker).

### Déploiement

`--deploy` s'ajoute aux autres options : après le build, `dist/` est envoyé sur le serveur avec `rsync` par SSH. Il faut `rsync` et `ssh` sur ton poste, et `rsync` sur le serveur.

1. Copie `deploy.conf.example` en `deploy.conf` (ignoré par git) et remplis-le :

   | Clé | Rôle |
   |-----|------|
   | `host` | nom du serveur, ou alias défini dans `~/.ssh/config` (alors `user`, `keyfile` et `port` sont inutiles) |
   | `user` | compte SSH (facultatif) |
   | `keyfile` | clé privée à utiliser (facultatif ; sinon ssh-agent ou `~/.ssh/config`) |
   | `port` | port SSH (facultatif) |
   | `path` | chemin **réel** du dossier publié sur le serveur, par exemple celui qui sert `https://…/webapps/` |
   | `delete` | `no` (défaut) : ne supprime rien ; `yes` : supprime sur le serveur ce qui n'est plus dans `dist/` |

2. Lance `python3 build.py --pwa --deploy`.

Précautions : la configuration est vérifiée **avant** le build ; `host`, `user` et `path` n'acceptent que des caractères sûrs ; un `path` trop général (`/`, `~`, `.`, `..`) est refusé, et avec `delete = yes` il faut au moins deux niveaux (`/var/www/site`). Aucun mot de passe n'est stocké : l'authentification passe par ta clé SSH, et la vérification de la clé du serveur n'est jamais désactivée. Les fichiers envoyés sont rendus lisibles par le serveur web (`D755`, `F644`). Si l'envoi échoue, le script s'arrête avec le code de rsync ; relance-le après correction (rsync ne renvoie que ce qui a changé).

À prévoir sur le serveur :
- **HTTPS** : obligatoire pour un service worker (`localhost` fait exception pour tester) ;
- le fichier `.webmanifest` doit être servi en `application/manifest+json` (nginx récent : déjà le cas ; Apache : `AddType application/manifest+json .webmanifest`) ;
- ne pas mettre `sw.js` derrière un long cache HTTP, sinon les mises à jour tardent (`Cache-Control: no-cache` pour ce fichier).

À savoir :
- sur iPhone et iPad, l'application installée a un **stockage séparé de Safari** : ce qui a été créé dans l'un (TODO, cartes…) n'apparaît pas dans l'autre. Utiliser l'export / import JSON pour passer de l'un à l'autre ;
- les tuiles de carte, la recherche de lieu et les taux de change demandent une connexion : hors ligne, l'outil s'ouvre et ses données locales restent disponibles ;
- un nouveau build change l'identifiant du cache (empreinte du contenu) : l'ancien est supprimé à l'activation du nouveau service worker.

### Publication sur GitHub Pages

Le workflow `.github/workflows/ci-pages.yml` construit et publie le site à chaque push sur `main` (et à la demande, depuis l'onglet Actions) :

1. `python3 build.py --pwa` : même build que ci-dessus, en mode non autonome, avec l'application installable ;
2. vérification que `dist/` contient l'index, le manifest, le service worker, `common.css` et toutes les pages de `code/` ;
3. publication de `dist/` avec les actions officielles de GitHub Pages.

Sur une pull request, seuls le build et la vérification tournent : rien n'est publié.

À faire une fois dans le dépôt : **Settings → Pages → Source : GitHub Actions**. Le site est ensuite servi sur `https://lstux.github.io/WebApps/`. Tous les chemins étant relatifs, le sous-dossier `/WebApps/` ne pose pas de problème, y compris pour le service worker.

## Exigences

- Un navigateur moderne (Chrome, Firefox, Safari, Edge)
- Pour charger des adresses : ouvre le fichier localement (pas depuis http://)
- Connexion Internet pour les CDN des bibliothèques (sauf dans les pages `--standalone`, qui les embarquent) et, dans le Convertisseur, pour actualiser les taux de change

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
│   ├── common.js                  # Thème clair / sombre / auto, partagé
│   ├── icons/                     # Une icône SVG par outil (favicon, en-tête, index) + webapps.svg
│   └── NN_outil.html              # Une page par outil ; le préfixe NN_ fixe l'ordre (voir « Build »)
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
