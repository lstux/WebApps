# 📒 Notebook

📦 [code/07_notebook.html](../code/07_notebook.html)

Un carnet de projets : pour chaque projet, ce qu'il faut garder sous la main. Liens, dépôts GitHub, notes, listes, achats, circuits ProtoBoard. Une page, sans serveur ; synchronisation facultative.

## Projets

- **+ Projet** : nom, emoji, couleur. ✎ dans un projet : renommer, changer l'emoji ou la couleur, **épingler** en tête, **archiver** (rangé dans « 🗄 Archives » en bas de l'accueil), supprimer.
- L'adresse suit le projet ouvert (`#p/<id>`) : le bouton retour du téléphone ramène à l'accueil.

## Éléments

**+ Ajouter** dans un projet, puis ✎ sur un élément pour le modifier, le **déplacer** vers un autre projet ou le supprimer. La poignée ⋮⋮ réordonne au doigt.

| Type | Contenu |
|------|---------|
| 🔗 Lien | adresse (`https://` ajouté si besoin), titre (le nom du site par défaut), note |
| 🐙 Dépôt GitHub | `github.com/propriétaire/dépôt` : description, langage, étoiles, date du dernier push, PR et issues ouvertes. ↻ rafraîchit (API publique de GitHub, sans compte : environ 60 requêtes par heure, dépôts publics seulement ; les infos sont gardées avec l'élément) |
| 📝 Note | titre et texte Markdown (même rendu que la Liseuse : marked + DOMPurify). Les notes longues sont repliées |
| ☑️ Liste à cocher | lignes à cocher, avancement ; ajout direct sous la liste |
| 🛒 Liste d'achat | article, quantité, prix unitaire (€), lien vers la boutique ; « Reste à acheter » (non cochés) et total |
| 🧩 Circuit ProtoBoard | **référencé**, pas copié : le Notebook lit la bibliothèque de ProtoBoard (`protoboard.circuit.<id>`, même navigateur), affiche son résumé et « Ouvrir dans ProtoBoard » l'ouvre directement (`protoboard_designer.html#open=<id>`, même chemin que Charger : ↶ y rend le plan précédent) |

## Étiquettes et recherche

- Chaque élément a des étiquettes (séparées par des virgules). Les pastilles `#étiquette` filtrent un projet, ou tous les projets depuis l'accueil.
- La recherche de l'accueil parcourt tous les projets non archivés : noms de projets, titres, adresses, notes, texte Markdown, lignes des listes, étiquettes. › ouvre le projet de l'élément.

## Données

- Stockage local (`localStorage`) : une clé par projet, `notebook.p.<id>` = `{id, name, emoji, color, pinned, archived, pos, items: […]}`.
- Menu ⋯ → **Exporter** (`notebook.json` : `{app: "notebook", version: 1, projects: […]}`) / **Importer** (les projets de même identifiant sont remplacés, les autres ajoutés).
- **Synchronisation** (menu ⋯, facultative) : PocketBase, connexion partagée avec les autres WebApps (voir [SYNCHRO.md](SYNCHRO.md)). Chaque projet est synchronisé séparément (le plus récent l'emporte, projet par projet). Les circuits référencés sont synchronisés par ProtoBoard.
