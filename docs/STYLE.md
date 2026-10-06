# Style commun — `code/common.css`

Toutes les pages incluent `code/common.css` pour partager les mêmes couleurs, la même typographie et les mêmes composants, et `code/common.js` pour le thème clair / sombre. Ce qui est propre à un outil reste dans le bloc `<style>` de sa page.

L'esprit : minimaliste et calme, mais vif : un violet électrique qui glisse vers le rose (avec une touche de soleil), des halos de couleur très doux en fond, des formes bien arrondies, et des animations courtes avec un petit rebond (`--spring`). Tout est coupé pour qui demande « moins d'animations ».

## Inclure le fichier

```html
<!-- page dans code/ -->
<link rel="stylesheet" href="common.css">
<link rel="icon" type="image/svg+xml" href="icons/mon_outil.svg">
<script src="common.js"></script>

<!-- page dans un sous-dossier de code/ : même chose avec ../ devant chaque chemin -->
```

Le `<link>` de `common.css` se place **avant** le `<style>` de la page : à spécificité égale, ce que la page écrit l'emporte sur le fichier commun. Le `<script src="common.js">` va dans le `<head>` : le thème mémorisé est appliqué avant le premier affichage, sans flash.

## Build

`python3 build.py` copie `code/` dans `dist/` et génère un `index.html` ; avec `--standalone`, chaque page devient un fichier unique : `common.css` est inséré dans un `<style>`, `common.js` dans un `<script>`, et l'icône (`<link rel="icon">`) comme les `<img>` locaux passent en `data:`. Les `<script src="https://…">`, `<link rel="stylesheet" href="https://…">` (Leaflet, marked, polices Google…) sont téléchargés une fois (cache `.cache/standalone/`, option `--refresh`) et insérés ; les `url()` de ces feuilles passent en `data:`, et les polices Google sont limitées à l'alphabet latin. Le contenu des `<script>` écrits dans les pages n'est jamais retouché. En standalone, le lien d'accueil `data-home` perd son `href` (il n'y a pas d'index à rejoindre). `--pwa` (sans `--standalone`) ajoute manifest, service worker et icônes ; voir le README.

Les couleurs de l'application installée (icônes, `theme-color`, fond de démarrage) sont lues dans `common.css` : `--ac` et `--ac2` pour le dégradé de l'icône, `--ac3` pour son rond jaune, la première et la deuxième valeur de `--bg` pour le clair et le sombre. Changer ces variables suffit à changer l'icône au prochain build. Ces valeurs doivent rester au format `#rrggbb`.

## Règles

- **Pas de couleur en dur** : utiliser les variables (`var(--fg)`, `var(--ac)`…), pour que le thème clair/sombre fonctionne partout.
- **Réutiliser avant d'écrire** : si un composant existe ci-dessous, l'utiliser tel quel. S'il lui faut une autre taille, changer sa variable (`--icon-size`, `--ring-size`, `--cb-box`…) plutôt que réécrire la règle.
- **Propre à l'outil → dans la page.** Si un composant sert dans deux outils, le déplacer dans `common.css`.
- **Pas de nom générique qui risque d'entrer en collision** : le fichier commun ne définit que des classes de composants listées ici. Un nom comme `.bar`, `.sub` ou `.field` appartient à la page qui l'utilise, sauf s'il figure dans ce document.

## Thème

Trois modes : **auto** (suit le système), **clair**, **sombre**. `common.js` pose `data-theme="light"` ou `"dark"` sur `<html>` (aucun attribut = auto), garde le choix dans `localStorage` (clé `webapps.theme`) et le partage entre les pages et les onglets. Chaque page a un bouton de thème :

```html
<button class="iconbtn themebtn" data-theme-toggle></button>
<!-- ou, dans une feuille (dialog.sheet), quand la barre du haut est déjà pleine : -->
<button class="item" data-theme-toggle><span class="ic" data-theme-icon></span> Thème<span class="sw" data-theme-name></span></button>
```

`common.js` dessine l'icône du mode courant dans l'élément (ou dans `[data-theme-icon]`), met à jour `aria-label` et `[data-theme-name]`. L'événement `webapps:theme` est émis à chaque changement ; `WebAppsTheme.get()` et `.set('dark')` sont disponibles pour le code de la page.

## Icônes

Chaque outil a une icône SVG, `code/icons/<nom_du_fichier_html>.svg` : tuile arrondie 64 × 64, dégradé propre à l'outil, motif blanc simple. Elle sert de favicon (`<link rel="icon">`), d'icône dans la barre du haut (`.appicon`) et de visuel sur la carte de l'index. Le **premier dégradé** du SVG (`<linearGradient id="g">`, deux `stop-color` en `#rrggbb`) doit rester en tête du fichier : `build.py` en reprend les couleurs pour teinter la carte de l'index. `icons/webapps.svg` est l'icône de l'ensemble (index et favicon de l'index).

```html
<a class="appicon" href="./" data-home aria-label="Accueil WebApps" title="Accueil WebApps"><img src="icons/mon_outil.svg" alt="" width="36" height="36"></a>
```

Le lien ramène à l'index. Sans `<link rel="icon">`, la carte de l'index affiche à la place la première lettre du titre sur un dégradé.

## Variables

| Variable | Rôle |
|----------|------|
| `--bg` | fond de page |
| `--card` | surfaces surélevées : cartes, feuilles, zone de lecture |
| `--card2` | surfaces secondaires : champs, boutons, citations, code |
| `--fg`, `--mut`, `--mut2` | texte, texte secondaire, éléments discrets |
| `--line` | séparateurs, bordures |
| `--ac`, `--ac2`, `--ac3`, `--on-ac`, `--ac-soft` | accent (violet), second accent (rose, pour les dégradés), troisième accent (soleil, touches ponctuelles), texte sur accent, accent très clair |
| `--grad` | le dégradé d'accent (`--ac` vers `--ac2`) |
| `--ok`, `--on-ok`, `--warn`, `--err` | états |
| `--hover`, `--glass`, `--shadow` | survol, fond translucide des barres, ombre |
| `--r-s`, `--r-m`, `--r-l` | rayons : 12, 14 et 20 px |
| `--spring` | courbe d'animation à petit rebond (retours tactiles, apparitions) |
| `--f-ui`, `--f-mono` | polices : arrondie du système (`ui-rounded`, Nunito si installée, sinon police système) et monospace système |

Une page peut ajouter ses propres variables (la Liseuse définit `--f-read` pour sa police de lecture et `--syn-*` pour la coloration du code).

## Composants

| Composant | Classe(s) | Réglages |
|-----------|-----------|----------|
| Barre du haut collante | `.topbar` > `.topbar-in`, avec `.appicon`, `.brand` (titre en dégradé) et `.subtitle` | |
| Icône de l'outil (lien d'accueil) | `.appicon` > `img` | taille : `width` / `height` |
| Bouton de thème | `.iconbtn.themebtn[data-theme-toggle]` | voir « Thème » |
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
| Utilitaires | `.sr` (lecteur d'écran seulement), `.muted`, `.err`, `.hint`, `.bob` (petit flottement, pour un état vide) | |

## Ajouter un nouvel outil

1. Créer `code/mon_outil.html` avec le `<link>` vers `common.css`, le `<script src="common.js">`, un `<link rel="icon">`, un `<title>` et une `<meta name="description">` (ils alimentent la page d'index générée par `build.py`).
2. Dessiner `code/icons/mon_outil.svg` en partant d'une icône existante (même tuile et même halo, autre dégradé et autre motif).
3. Partir de `.topbar` pour l'en-tête (avec `.appicon` et le bouton de thème), `.card` pour les blocs, `.btn` et les champs pour les formulaires.
4. Mettre dans un `<style>` uniquement ce qui est spécifique à l'outil.
5. Tester en clair et en sombre, sur un écran étroit (environ 390 px) et sur un écran large, puis lancer `python3 build.py`, `--standalone` et `--pwa`. Pour qu'une bibliothèque externe soit embarquée en standalone, la charger avec une balise ordinaire `<script src="https://…">` ou `<link rel="stylesheet" href="https://…">` dans la page (pas depuis du JavaScript).
