# Liseuse Markdown

Une page unique HTML/CSS/JavaScript qui affiche des fichiers Markdown comme on lit un livre.

## Caractéristiques

- **Lecture centrée** : colonne étroite de 65 caractères, typographie soignée
- **Navigation** : arborescence repliable des documents à gauche, plan de la section à droite (sur grand écran)
- **Recherche** : cherche par nom de fichier et dans le contenu
- **Tâches** : affiche les listes de tâches avec cases rondes, pourcentage de progression, barre colorée (style du TODO)
- **Adaptif** : fonctionne sur mobile et bureau, volet en tiroir sur petit écran
- **Thème** : clair, sombre, ou automatique selon le système
- **Taille de texte** : ajustable de 15px à 22px
- **Lecture de progression** : fine barre sous le bandeau

## Ouvrir un contenu

- **Fichiers** : un ou plusieurs fichiers `.md` depuis l'ordinateur
- **Dossier** : tous les `.md` du dossier et sous-dossiers (l'arborescence s'affiche à gauche)
- **Adresse** : l'URL d'un fichier `.md`, ou celle d'un dépôt GitHub pour parcourir tous ses documents
- **Glisser-déposer** : dépose un fichier ou dossier n'importe où sur la page
- **Coller** : `Ctrl`+`V` pour afficher du Markdown depuis le presse-papiers

Rien n'est envoyé nulle part : tout est lu localement dans le navigateur.

## Raccourcis clavier

| Touche | Action |
| --- | --- |
| `/` | Aller à la recherche |
| `[` ou `]` | Document précédent ou suivant |
| `Échap` | Effacer la recherche |

## Bibliothèques utilisées

- `marked` (12.0.2) – rendu Markdown
- `dompurify` (3.1.6) – nettoyage du HTML
- `highlight.js` (11.9.0) – coloration syntaxique du code

Chargées depuis cdnjs (requiert une connexion Internet).

## Structure des tâches

Les listes de tâches au format Markdown (`- [ ]` ou `- [x]`) sont transformées en:
- Cases rondes animées (verte si fait, grise si à faire, trait si en cours)
- Texte barré et grisé si la tâche est faite
- Une tâche contenant des sous-tâches affiche son pourcentage et se coche auto­ma­tiquement
- Barre de progression (rouge → vert selon le pourcentage)
- Pastille avec le nombre de tâches faites/totales

Les tâches restent statiques : les cases ne se cochent pas dans la liseuse.

## Couleurs et thème

- **Clair** : fond gris-bleu clair, zone de lecture blanche, accent bleu-violet
- **Sombre** : fond presque noir, texte gris clair, accent plus lumineux

Les couleurs viennent du style commun `src/common.css` (voir [STYLE.md](STYLE.md)), partagé avec les autres outils. La barre de lecture utilise un dégradé accent → second accent.

## Notes

- Les liens relatifs entre fichiers fonctionnent en mode dossier
- Les images relatives sont affichées si le fichier image est dans le dossier
- Le chargement par adresse ne marche pas dans l'aperçu Claude (qui bloque le réseau)
- Pour charger des adresses, enregistre la page `.html` et ouvre-la depuis ton ordinateur
- Certains serveurs ne permettent pas les requêtes d'une autre origine (CORS)

## Fichier unique

La page est un fichier `.html` autonome, qui dépend seulement de `common.css` (placé à côté d'elle) et des CDN. Tu peux:
- L'ouvrir directement dans le navigateur
- La servir avec un serveur web simple
- L'intégrer dans une autre page (bien que ce soit moins recommandé)
