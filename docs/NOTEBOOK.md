# 📒 Notebook

📦 [code/07_notebook.html](../code/07_notebook.html)

Un carnet de projets : pour chaque projet, ce qu'il faut garder sous la main. Liens, dépôts GitHub, notes, listes, achats, circuits ProtoBoard, listes TODO, cartes, documents à lire. Une page, sans serveur ; synchronisation facultative.

## Projets

- **+ Projet** : nom, emoji, couleur. ✎ dans un projet : renommer, changer l'emoji ou la couleur, **épingler** en tête, **archiver** (rangé dans « 🗄 Archives » en bas de l'accueil), supprimer.
- L'adresse suit le projet ouvert (`#p/<id>`) : le bouton retour du téléphone ramène à l'accueil.

## Éléments

**+ Ajouter** dans un projet, puis ✎ sur un élément pour le modifier, le **déplacer** vers un autre projet ou le supprimer. La poignée ⋮⋮ réordonne au doigt.

Chaque élément tient sur une ligne : titre et résumé (avancement, prochaine tâche, reste à acheter, étoiles et PR…). Le titre ouvre la cible (le site, le dépôt, ou l'app liée, marquée ↗) ; toucher le reste de la ligne déplie le détail (lignes à cocher, note, étiquettes, aperçu de carte). Le bouton « + Ajouter » se cache pendant une saisie.

| Type | Contenu |
|------|---------|
| 🔗 Lien | adresse (`https://` ajouté si besoin), titre (le nom du site par défaut), note |
| 🐙 Dépôt GitHub | `github.com/propriétaire/dépôt` : description, langage, étoiles, date du dernier push, PR et issues ouvertes. ↻ rafraîchit (API publique de GitHub, sans compte : environ 60 requêtes par heure, dépôts publics seulement ; les infos sont gardées avec l'élément) |
| 📝 Note | titre et texte Markdown (même rendu que la Liseuse : marked + DOMPurify). Les notes longues sont repliées |
| ☑️ Liste à cocher | lignes à cocher, avancement ; ajout direct sous la liste |
| 🛒 Liste d'achat | article, quantité, prix unitaire (€), lien vers la boutique ; « Reste à acheter » (non cochés) et total |
| 🧩 Circuit ProtoBoard | **référencé**, pas copié : le Notebook lit la bibliothèque de ProtoBoard (`protoboard.circuit.<id>`, même navigateur), affiche son résumé et « Ouvrir dans ProtoBoard » l'ouvre directement (`protoboard_designer.html#open=<id>`, même chemin que Charger : ↶ y rend le plan précédent) |
| ✅ Liste TODO | **référencée** : une liste de l'app TODO (`todo-tree-v1` pour « Ma liste », `todo-list.<id>` pour les autres). Avancement, nombre restant, les 3 prochaines tâches ; « Ouvrir dans TODO » ouvre cette liste (`todo.html#list=<id>`) |
| 🗺️ Carte | **référencée** : une carte de « Mes cartes » de l'app Cartes (`leaflet.map.<id>`). Aperçu des formes et des points (sans fond de carte), nombre d'éléments, longueur des tracés ; « Ouvrir dans Cartes » l'ouvre (`leaflet_manager.html#open=<id>`, ↶ y rend la carte précédente) |
| 📖 Document | adresse d'un fichier Markdown (GitHub compris), titre (le nom du fichier par défaut), note ; « Lire dans la Liseuse » l'ouvre (`markdown_reader.html#url=<adresse encodée>`) |

Les éléments référencés sont lus dans le stockage du navigateur : ils doivent avoir été créés (ou synchronisés) dans la même origine. Le Notebook se met à jour quand tu reviens sur son onglet.

## Étiquettes et recherche

- Chaque élément a des étiquettes (séparées par des virgules). Les pastilles `#étiquette` filtrent un projet, ou tous les projets depuis l'accueil.
- La recherche de l'accueil parcourt tous les projets non archivés : noms de projets, titres, adresses, notes, texte Markdown, lignes des listes, étiquettes. › ouvre le projet de l'élément.

## Données

- Stockage local (`localStorage`) : une clé par projet, `notebook.p.<id>` = `{id, name, emoji, color, pinned, archived, pos, items: […]}`.
- **Exporter** : ✎ du projet → « Exporter ce projet… », ou menu ⋯ → « Exporter tout… ».
  - **JSON** (`notebook-<projet>.json` : `{app: "notebook", version: 1, projects: […], refs}`), réimportable.
  - **HTML** (`.html`) : le même contenu que le Markdown, mis en page dans une seule page autonome (styles intégrés, clair ou sombre selon le système, imprimable, sans script).
  - **Markdown** (`.md`), à lire ou à partager : liens et références en tête, puis listes (`- [x]`), achats (tableau et totaux) et notes, chacun sous son titre.
  - Option **« Embarquer les listes TODO, cartes et circuits liés »**, cochée par défaut. En JSON, ils sont copiés dans `refs` (`todo`, `map`, `pbd` par identifiant) et recréés à l'import. En Markdown, l'arbre de la liste TODO et les points de la carte (liens OpenStreetMap) sont ajoutés.
  - Option **« Inclure le contenu des documents »**, décochée par défaut, pour Markdown et HTML : chaque 📖 Document est téléchargé au moment de l'export (un lien GitHub `blob/…` est lu sur raw.githubusercontent.com). Son contenu est recopié sous son titre, avec ses titres décalés et ses liens et images relatifs rendus absolus. Un document qu'on n'arrive pas à télécharger garde son lien, et un message le signale. Le JSON ne garde que le lien.
- **Importer** (menu ⋯) : un export d'un projet ou de tous. Si un projet existe déjà, on choisit :
  - **Remplacer** : même identifiant, et les éléments liés embarqués écrasent ceux du navigateur.
  - **Importer en copie** : nouveau projet « … (copie) ». Un élément lié déjà présent mais différent est copié lui aussi.
  - Les éléments liés sont écrits par le module de synchro de leur app : avec une connexion, ils partent tout de suite sur le serveur.
- **Synchronisation** (menu ⋯, facultative) : PocketBase, connexion partagée avec les autres WebApps (voir [SYNCHRO.md](SYNCHRO.md)). Chaque projet est synchronisé séparément (le plus récent l'emporte, projet par projet). Les circuits, listes TODO et cartes référencés sont synchronisés par leur propre app.
