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

📄 **[Documentation](docs/LISEUSE.md)** · 📦 **[liseuse-markdown.html](src/liseuse-markdown.html)**

### ✅ TODO

Un gestionnaire de tâches hiérarchique avec:
- Arbre de todos à profondeur illimitée
- Pourcentage d'achèvement coloré, calculé sur les feuilles
- Import/export JSON et texte indenté
- Sauvegarde locale, interface mobile-first

📄 **[Documentation](docs/TODO.md)** · 📦 **[todo/index.html](src/todo/index.html)**

### 🔁 Convertisseur

Un convertisseur d'unités et de devises avec:
- Longueur, masse, volume, surface, température, vitesse, temps, données, énergie, pression
- Devises avec taux en ligne, repli sur le dernier taux connu hors ligne
- Toutes les conversions affichées d'un coup

📄 **[Documentation](docs/CONVERTISSEUR.md)** · 📦 **[convertisseur/index.html](src/convertisseur/index.html)**

## Prochains outils

La liste des outils envisagés est dans [docs/suggested_apps_nextsteps.md](docs/suggested_apps_nextsteps.md).

## Installation

Chaque outil est une page `.html` unique. Télécharge le dossier `src/` en entier (les pages utilisent la feuille de style commune `src/common.css`, qui doit rester à sa place) et ouvre la page voulue dans ton navigateur.

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
│   ├── STYLE.md                   # Style commun : variables et composants
│   └── suggested_apps_nextsteps.md
├── src/                           # Pages HTML
│   ├── common.css                 # Style partagé par tous les outils
│   ├── liseuse-markdown.html
│   ├── todo/
│   │   ├── index.html
│   │   └── slovingo.json
│   └── convertisseur/
│       └── index.html
├── LICENSE
└── README.md
```

Chaque page est un fichier `.html` autonome :
- Style commun dans `src/common.css` (voir [docs/STYLE.md](docs/STYLE.md)), CSS spécifique à l'outil inline
- JavaScript inline
- Pas de build step

## License

MIT (voir [LICENSE](LICENSE))
