# Style commun — `code/common.css`

Toutes les pages incluent `code/common.css` pour partager les mêmes couleurs, la même typographie et les mêmes composants. Ce qui est propre à un outil reste dans le bloc `<style>` de sa page.

## Inclure le fichier

```html
<!-- page dans code/ -->
<link rel="stylesheet" href="common.css">

<!-- page dans un sous-dossier de code/ -->
<link rel="stylesheet" href="../common.css">
```

Le `<link>` se place **avant** le `<style>` de la page : à spécificité égale, ce que la page écrit l'emporte sur le fichier commun.

## Build

`python3 build.py` copie `code/` dans `dist/` et génère un `index.html` ; avec `--standalone`, chaque page est écrite avec `common.css` inséré dans un `<style>` à la place du `<link>` (les `<script>` ne sont pas touchés). Seules les feuilles de style locales sont insérées : les polices ou bibliothèques chargées depuis un site restent des liens.

## Règles

- **Pas de couleur en dur** : utiliser les variables (`var(--fg)`, `var(--ac)`…), pour que le thème clair/sombre fonctionne partout.
- **Réutiliser avant d'écrire** : si un composant existe ci-dessous, l'utiliser tel quel. S'il lui faut une autre taille, changer sa variable (`--icon-size`, `--ring-size`, `--cb-box`…) plutôt que réécrire la règle.
- **Propre à l'outil → dans la page.** Si un composant sert dans deux outils, le déplacer dans `common.css`.
- **Pas de nom générique qui risque d'entrer en collision** : le fichier commun ne définit que des classes de composants listées ici. Un nom comme `.bar`, `.sub` ou `.field` appartient à la page qui l'utilise, sauf s'il figure dans ce document.

## Thème

Le thème suit le système (clair/sombre). Une page peut le forcer avec `data-theme="light"` ou `data-theme="dark"` sur `<html>` ; la Liseuse s'en sert pour son bouton de thème.

## Variables

| Variable | Rôle |
|----------|------|
| `--bg` | fond de page |
| `--card` | surfaces surélevées : cartes, feuilles, zone de lecture |
| `--card2` | surfaces secondaires : champs, boutons, citations, code |
| `--fg`, `--mut`, `--mut2` | texte, texte secondaire, éléments discrets |
| `--line` | séparateurs, bordures |
| `--ac`, `--ac2`, `--on-ac`, `--ac-soft` | accent, second accent (dégradés), texte sur accent, accent très clair |
| `--ok`, `--on-ok`, `--warn`, `--err` | états |
| `--hover`, `--glass`, `--shadow` | survol, fond translucide des barres, ombre |
| `--r-s`, `--r-m`, `--r-l` | rayons : 10, 12 et 18 px |
| `--f-ui`, `--f-mono` | polices (système) |

Une page peut ajouter ses propres variables (la Liseuse définit `--f-read` pour sa police de lecture et `--syn-*` pour la coloration du code).

## Composants

| Composant | Classe(s) | Réglages |
|-----------|-----------|----------|
| Barre du haut collante | `.topbar` > `.topbar-in`, avec `.brand` (titre en dégradé) et `.subtitle` | |
| Bouton | `.btn`, `.btn.primary` | |
| Bouton rond | `.iconbtn` ou `.btn.icon` | `--icon-size` (42 px) |
| Pastilles de filtre | `.chips` > `.chip`, `.chip.on` | |
| Champs | `input[type=text|search|number]`, `select`, `textarea`, ou `.field` | |
| Carte | `.card` | |
| Pastille de pourcentage | `.pct` avec `style="--c:…"` | |
| Barre d'avancement | `.progress` > `i` avec `style="--c:…"` | |
| Anneau d'avancement | `.ring` avec `--p` (0 à 100) et `--c` | `--ring-size`, `--ring-w`, `--ring-fs` |
| Case ronde | `.cb`, `.cb.on`, `.cb.part` | `--cb-box` (zone tactile, 38 px) |
| Feuille modale | `dialog.sheet` > `.inner` avec `.grab`, `.item`, `h2`, `p`, `.btns` | |
| Notification | `.toast`, `.toast.err` | |
| Utilitaires | `.sr` (lecteur d'écran seulement), `.muted`, `.err`, `.hint` | |

## Ajouter un nouvel outil

1. Créer `code/mon_outil.html` avec le `<link>` vers `common.css`, un `<title>` et une `<meta name="description">` (ils alimentent la page d'index générée par `build.py`).
2. Partir de `.topbar` pour l'en-tête, `.card` pour les blocs, `.btn` et les champs pour les formulaires.
3. Mettre dans un `<style>` uniquement ce qui est spécifique à l'outil.
4. Tester en clair et en sombre, sur un écran étroit (environ 390 px) et sur un écran large.
