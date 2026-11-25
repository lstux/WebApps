# 🎮 Jeux

Petits jeux dans une seule page (`code/08_games.html`), sans dépendance : ils marchent hors ligne, au doigt comme au clavier et à la souris.

## Accueil

Une carte par jeu, avec les records. « en cours » signale une partie à reprendre. ‹ en haut revient à l'accueil ; chaque jeu a son adresse (`#mines`, `#snake`, `#sudoku`, `#solitaire`).

## 💣 Démineur

- Niveaux : Facile (9 × 9, 10 mines), Moyen (16 × 16, 40), Difficile (30 × 16, 99 ; 16 × 30 sur un écran large en paysage).
- Le premier coup n'est jamais une mine (ni ses voisines).
- **Toucher** : creuser. **Appui long** ou **clic droit** : drapeau. Le bouton ⛏ / 🚩 inverse les deux (pratique au doigt).
- Toucher un chiffre entouré d'autant de drapeaux ouvre ses cases voisines.
- Record : meilleur temps par niveau.

## 🐍 Snake

- Plateau de 18 × 18. **Murs** (toucher le bord fait perdre) ou **Traversée** (on ressort de l'autre côté) : un record pour chaque mode.
- Commandes : flèches ou ZQSD, Espace pour la pause ; au doigt, glisser sur le plateau ou les flèches sous le plateau (masquées avec une souris).
- Le serpent accélère à chaque pomme. Pause automatique quand l'onglet est caché.

## 🔢 Sudoku

- Grilles générées sur l'appareil, à solution unique : Facile (40 chiffres donnés), Moyen (32), Difficile (26).
- Choisir une case puis un chiffre (le pavé indique combien il en reste). ✎ **Notes** : petits chiffres candidats, retirés automatiquement quand un chiffre est posé dans la ligne, la colonne ou le carré.
- Une erreur s'affiche en rouge et compte dans le total. ↶ Annuler, ⌫ Effacer, 💡 Indice (remplit la case choisie, ou une case au hasard).
- Clavier : 1-9, flèches, Retour arrière ou Suppr, N pour les notes.
- Record : meilleur temps par niveau, seulement sans indice.

## 🃏 Solitaire (Klondike)

- Pioche **par 1** ou **par 3**, un record pour chaque.
- **Toucher** une carte : elle part au meilleur endroit (fondation d'abord, sinon une colonne). On peut aussi la **glisser**, avec les cartes posées dessus.
- Toucher la pioche : tirer ; pioche vide : retourner le talon.
- ↶ Annuler (sans limite pratique), 💡 Indice (fait clignoter une carte jouable), ⚡ **Terminer** quand toutes les cartes sont visibles et la pioche vide.

## Données

| Clé (localStorage) | Contenu | Synchronisée |
|---|---|---|
| `games.best` | records et nombre de parties, par jeu et niveau | oui (menu ⋯ → Synchronisation) |
| `games-save.<jeu>` | partie en cours | non : reste sur l'appareil |
| `games-pref.*` | dernier niveau, mode Snake, pioche du Solitaire | non |

Menu ⋯ → « Effacer les records » remet les records à zéro (sur tous les appareils synchronisés).

## Plus tard

- **Émulateurs** (NES, Game Boy, Mega Drive…) avec **tes propres ROMs** : choisies sur l'appareil, gardées dans le navigateur, EmulatorJS chargé depuis son CDN. Les ROMs ne sont jamais envoyées nulle part.
- D'autres jeux : 2048, mots mêlés…
