# Cartes Leaflet — Gestionnaire de cartes

Une page unique pour composer une carte [Leaflet](https://leafletjs.com) à la souris, puis récupérer le code à coller dans une page HTML pour obtenir exactement la même carte.

📦 `code/leaflet_manager.html` (utilise la feuille de style commune `code/common.css`, voir [STYLE.md](STYLE.md))

## 🎯 Caractéristiques

- **Points** : pose, déplacement, titre, description (bulle), couleur, symbole (emoji, lettre ou chiffre), coordonnées modifiables.
- **Trajets** : tracé point par point, puis poignées pour déformer (glisser un sommet, glisser un point pâle pour en ajouter un, double-clic ou clic droit pour supprimer). Couleur, épaisseur, opacité, pointillés, fermeture en polygone avec remplissage. Longueur et surface affichées.
- **Main levée** : on dessine en glissant ; le trait est simplifié automatiquement. Terminer près du point de départ ferme la forme. « Simplifier » réduit aussi un trajet existant.
- **Fonds de carte** : OpenStreetMap, OpenStreetMap France, CARTO (clair, Voyager, sombre), OpenTopoMap, CyclOSM, Esri satellite. Le changement est immédiat.
- **Export en fenêtre** : fragment HTML à insérer, page complète, JSON, GeoJSON. Copier, télécharger, ou ouvrir un aperçu.
- **Import** : JSON de cette page ou GeoJSON quelconque (Point, LineString, Polygon et leurs variantes multiples), en remplaçant ou en ajoutant.
- **Annuler / rétablir** (100 niveaux), sauvegarde automatique dans le navigateur (`localStorage`).
- **Recherche d'un lieu** (Nominatim) et **ma position**.
- Interface mobile-first : sur téléphone, les outils sont au-dessus de la carte, les propriétés en dessous.

## 🚀 Utilisation

1. Choisis un outil (ou utilise le raccourci) :

   | Outil | Raccourci | Geste |
   |-------|-----------|-------|
   | Sélection | `V` | clic sur un élément pour l'éditer |
   | Point | `P` | clic sur la carte |
   | Trajet | `T` | clics successifs ; double-clic ou `Entrée` pour finir, `Retour arrière` pour retirer le dernier point, `Échap` pour annuler |
   | Main levée | `M` | glisser |

   `Suppr` efface l'élément sélectionné, `Ctrl+Z` / `Ctrl+Maj+Z` annulent et rétablissent.
2. Règle titre, couleur, etc. dans le panneau. Un nouvel élément reprend le dernier style choisi pour son type.
3. Règle la carte (fond, boutons de zoom, échelle, hauteur, cadrage) dans la carte « Carte ».
4. **Exporter** : copie le code.

## 📤 Code exporté

- **Fragment HTML** : charge Leaflet depuis unpkg (à retirer si ta page le fait déjà), un `<div>` à la hauteur choisie, et un script autonome (entouré d'une fonction, sans variable globale). L'identifiant du conteneur est modifiable pour mettre plusieurs cartes dans une page.
- **Page complète** : même code dans un document HTML dont la carte occupe toute la fenêtre.
- Les points utilisent la même icône que l'éditeur : la fonction `pin()` est recopiée telle quelle dans le code, sans image externe.
- **Cadrage** : « Vue actuelle » reprend le centre et le zoom affichés ; « Tout afficher » appelle `fitBounds` sur l'ensemble des éléments (utile si la carte s'affiche dans un conteneur de taille variable).
- Les textes sont échappés : un titre contenant `<` ou `&` s'affiche tel quel.
- « Zoom à la molette » ne concerne que la carte exportée ; dans l'éditeur la molette reste active.

## 💾 Format JSON

```json
{
  "app": "leaflet-manager",
  "version": 1,
  "map": { "center": [46.6, 2.5], "zoom": 6, "tile": "osm", "zoomControl": true, "scale": true, "scrollWheel": true, "height": 420, "framing": "view" },
  "items": [
    { "type": "marker", "title": "Paris", "desc": "", "pos": [48.8566, 2.3522], "color": "#e53935", "symbol": "🍴" },
    { "type": "path", "title": "Boucle", "desc": "", "pts": [[48.85, 2.35], [48.86, 2.36], [48.85, 2.37]], "closed": false,
      "color": "#1e88e5", "weight": 4, "opacity": 0.9, "dash": false, "fill": 0.2 }
  ]
}
```

Coordonnées en `[latitude, longitude]`. Les valeurs hors limites sont corrigées ou ignorées à l'import.

Le GeoJSON utilise `[longitude, latitude]` (standard) et le style est écrit en propriétés « simplestyle » (`marker-color`, `stroke`, `stroke-width`, `stroke-opacity`, `fill-opacity`), plus `symbol` et `dash`.

## ⚠️ À savoir

- Connexion Internet requise : Leaflet et les tuiles viennent de serveurs distants.
- Les serveurs de tuiles ont leurs propres conditions d'usage : l'OSM Foundation demande un usage raisonnable de `tile.openstreetmap.org`, et CARTO impose une attribution (déjà incluse dans le code exporté). Pour un site à fort trafic, prévoir un fournisseur dédié.
- La recherche de lieu interroge Nominatim uniquement à l'envoi du formulaire (pas de saisie semi-automatique), conformément à sa politique d'usage.
- Les liens Leaflet du code exporté n'ont pas d'attribut `integrity` ; tu peux l'ajouter depuis la [page de démarrage de Leaflet](https://leafletjs.com/examples/quick-start/).
- Dans l'aperçu intégré à Claude le réseau est bloqué : ouvre la page `.html` depuis ton ordinateur.

## 🔭 Pistes d'évolution

Classées grossièrement par rapport utilité / effort.

### Échange de données
- **GPX** (import et export) : le format des traces de randonnée et de GPS ; KML ensuite.
- **Partage par lien** : la carte compressée dans le fragment d'URL (`#…`), pour envoyer une carte sans fichier.
- **Plusieurs cartes** enregistrées dans le navigateur (liste, renommer, dupliquer, supprimer), à la façon d'un vrai « manager ».
- **Export image** (PNG) de la vue courante.

### Éléments
- **Calques / groupes** : regrouper des éléments, les masquer, leur donner une couleur commune, avec un sélecteur de calques dans la carte exportée.
- **Formes de base** : cercle (rayon en mètres), rectangle ; polygones avec couleur de remplissage distincte du contour.
- **Icônes personnalisées** : image par URL ou emoji plus grand ; **regroupement** automatique des points quand ils sont nombreux (`Leaflet.markercluster`).
- **Bulles enrichies** : liens, images, mise en forme légère (Markdown restreint).
- **Étiquettes** permanentes (`bindTooltip`) à la place des bulles au clic.

### Trajets
- **Itinéraire routier** entre deux points ou plus (OSRM ou équivalent), à pied, à vélo ou en voiture.
- **Profil d'altitude** et dénivelé via un service d'élévation, avec distance cumulée.
- **Accrochage** aux sommets et aux lignes existantes ; couper / fusionner des trajets ; flèches de sens.

### Fonds de carte
- **URL de tuiles personnalisée** (avec clé d'API : MapTiler, Thunderforest, IGN Géoportail…).
- **Couches superposées** (overlays : pistes cyclables, sentiers, cadastre) et services WMS.

### Édition
- **Sélection multiple**, déplacement et copie d'un groupe d'éléments.
- **Poignées plus grandes** sur écran tactile et édition au clavier (accessibilité).
- Barre de **recherche dans les éléments** quand la carte en compte beaucoup.

### Carte exportée
- **Contrôles optionnels** : plein écran, légende, mini-carte, bouton de géolocalisation, échelle impériale.
- **Attribut `integrity` (SRI)** sur les liens Leaflet, et variante **hors ligne** avec Leaflet embarqué dans la page.
- **Chargement paresseux** : n'initialiser la carte que lorsqu'elle devient visible.

### Qualité
- Tests automatisés de la génération de code et des imports/exports (le test de bout en bout actuel est resté local).
- Import GeoJSON : conserver les trous des polygones et les `MultiPolygon` (aujourd'hui, seul l'anneau extérieur de chaque polygone est repris).
