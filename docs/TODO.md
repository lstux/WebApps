# TODO — Arbre de tâches

Une page unique pour gérer une liste de todos hiérarchique et illimitée en profondeur, avec tracking d'achèvement.

## 🎯 Caractéristiques

- **Arbre illimité** : créez des todos, puis des sous-todos dans ces todos, aussi profond que vous le souhaitez.
- **Taux d'achèvement** : chaque parent affiche un pourcentage calculé sur le nombre de feuilles (sous-todos terminés / total).
- **Couleur adaptive** : la barre et le pourcentage changent de couleur, du rouge (0%) au vert (100%).
- **Description facultative** : chaque todo peut avoir un titre et une description multi-ligne.
- **Stockage local** : données sauvegardées automatiquement dans `localStorage` du navigateur.
- **Import/Export** : exportez en JSON ou en texte indenté (`*`, `+`, `-`), et importez en remplaçant ou ajoutant.
- **Mobile-first** : interface optimisée pour les téléphones, avec zones tactiles généreuses et vues adaptées.
- **Pas de dépendances** : une page HTML avec son JavaScript inclus, plus la feuille de style commune `code/common.css` (voir [STYLE.md](STYLE.md)).

## 🚀 Utilisation

### Démarrer

Ouvrez `index.html` dans un navigateur.

### Ajouter un todo

- **Racine** : saisissez dans le champ du bas et appuyez sur Entrée.
- **Sous-todo** : cliquez sur le body d'un todo ou sur **＋ Sous-todo** pour ouvrir un formulaire ; enchaînez avec Entrée, Échap pour fermer.

### Description

- Cliquez sur le bouton **≡** dans le formulaire de saisie pour déplier une zone de description.
- Ou appuyez sur **Maj+Entrée** dans le titre pour ouvrir la description.
- **Ctrl+Entrée** (ou **Cmd+Entrée** sur Mac) valide le formulaire depuis la description.

### Marquer comme fait

- Cliquez sur la case du todo. Les descendants sont cochés/décochés ensemble.
- Un parent se coche automatiquement quand tous ses sous-todos le sont, et vice versa.

### Organiser

- **Replier/Déplier** : cliquez sur le caret **›** à côté du titre.
- **Monter/Descendre** : **↑** et **↓** dans le menu du todo.
- **Supprimer** : **✕** (confirmation si des sous-todos existent).
- **Menu ⋯** : tout replier/déplier, masquer les faits, importer/exporter.

### Import/Export

- **Export JSON** : date du jour + `.json`, pour backuper ou partager.
- **Export texte** : liste indentée lisible et importable ailleurs.
- **Importer** : collez du JSON ou du texte indenté ; remplacez tout ou ajoutez à la suite.

## 📋 Format texte

```
* Premier todo
  + Sous-todo 1
  + Sous-todo 2
    - Niveau 3
      > Description du niveau 3
      > (les lignes plus indentées sans puce deviennent description)
  + [x] Sous-todo marqué comme fait
* Deuxième todo
```

## 🎨 Thème

L'interface s'adapte au thème du système (clair/sombre).

## 💾 Données

Tout est sauvegardé en `localStorage` de votre navigateur. Changer de navigateur, ordinateur ou effacer le stockage du site perdra les données. **Exportez régulièrement en JSON pour sauvegarder.**

## ⚡ Performance

- Pas de serveur : tout fonctionne hors ligne.
- Rapide même avec des milliers de todos.
- Page légère (environ 18 Ko, hors feuille de style commune).

---

Besoin de modifier ? Le code est léger et commenté. Bon rangement ! 🎉
