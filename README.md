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

## Installation

Chaque outil est un fichier `.html` unique. Télécharge-le et ouvre-le dans ton navigateur.

## Exigences

- Un navigateur moderne (Chrome, Firefox, Safari, Edge)
- Pour charger des adresses : ouvre le fichier localement (pas depuis http://)
- Connexion Internet (pour les CDN des bibliothèques)

## Développement

La structure du repo:

```
.
├── docs/              # Documentation
│   └── LISEUSE.md
├── src/               # Pages HTML
│   └── liseuse-markdown.html
├── LICENSE
└── README.md
```

Chaque page est un fichier `.html` autonome :
- CSS inline
- JavaScript inline
- Pas de build step

## License

MIT (voir [LICENSE](LICENSE))
