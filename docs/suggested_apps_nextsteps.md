# Prochains outils

Liste des outils envisagés pour le repo. Chaque outil reste une page HTML autonome (JavaScript inline) qui inclut le style commun `code/common.css` ; le CSS propre à l'outil reste dans la page. Voir [STYLE.md](STYLE.md).

## Fait

| Outil | Fichier | Doc |
|-------|---------|-----|
| Liseuse Markdown | `code/markdown_reader.html` | [LISEUSE.md](LISEUSE.md) |
| TODO (arbre de tâches) | `code/todo.html` | [TODO.md](TODO.md) |
| Convertisseur unités et devises | `code/units_converter.html` | [CONVERTISSEUR.md](CONVERTISSEUR.md) |
| Cartes Leaflet (gestionnaire de cartes) | `code/leaflet_manager.html` | [CARTES.md](CARTES.md) |
| Style commun | `code/common.css` | [STYLE.md](STYLE.md) |

## En cours

| Outil | Idée |
|-------|------|
| Générateur de QR code | Texte, URL, Wi-Fi, etc. vers QR code téléchargeable |
| Notes / bookmarks | Regrouper et consulter des liens et notes par catégorie ou projet |

## À faire (ordre proposé)

### 1. Formateur JSON / YAML
Valide, prettifie, minifie et convertit JSON ↔ YAML. Erreurs localisées (ligne/colonne). Bibliothèque YAML (js-yaml) chargée via CDN, comme le reste du repo.

### 2. Diff de texte
Compare deux textes côte à côte (mise en évidence par ligne et par mot). Extension possible : diff de deux JSON après normalisation, pour compléter le formateur.

### 3. Convertisseur / éditeur de tables multiformats
Ouvre un tableau en CSV, TSV, JSON ou tableau Markdown, l'édite dans une grille et le réexporte dans n'importe lequel de ces formats. Points à soigner : séparateur et guillemets du CSV, types dans le JSON, alignement des colonnes en Markdown.

### 4. Boîte à outils dev
Une page à onglets, avec le testeur de regex intégré :
- testeur de regex : correspondances et groupes surlignés en direct, options (flags), aide-mémoire ;
- Base64, encodage d'URL ;
- décodeur JWT ;
- hash (SHA-1/256/512 via l'API Web Crypto) ;
- UUID ;
- timestamps Unix ↔ dates.

## Idées non retenues (pour mémoire)

Minuteur Pomodoro, convertisseur Markdown ↔ HTML, palette de couleurs et contrastes, générateur de mots de passe, explicateur de cron, dates et fuseaux horaires, compresseur d'images, calculatrices (TVA, prêt, pourcentages), suivi d'habitudes.
