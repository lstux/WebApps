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

## 👾 Émulateurs

Carte « Émulateurs » de l'accueil (`#emu`). Code dans `code/emulator.js`.

- **Ajouter** : bouton « ＋ Ajouter des ROMs » ou glisser-déposer, plusieurs fichiers à la fois. Le système est deviné par l'extension ; pour un `.zip` ou une extension inconnue, l'app demande.
- **Systèmes** : NES, Super Nintendo, Game Boy, Game Boy Color, Game Boy Advance, Mega Drive, Master System, Game Gear, PC Engine, Atari 2600, Nintendo 64 (lourd sur téléphone). Pas de PlayStation (BIOS et poids).
- **Jouer** : toucher une ROM ouvre le lecteur plein écran ; un premier toucher dans EmulatorJS lance le jeu (nécessaire pour le son). Menu d'EmulatorJS : commandes tactiles, sauvegardes d'état, manette, plein écran.
- **Options** (⋯ sur une ROM) : renommer, changer de système, supprimer.
- **Confidentialité** : les ROMs sont dans IndexedDB (`webapps-emu`), sur cet appareil seulement. Elles ne passent ni par PocketBase ni par le CDN : EmulatorJS les lit via une adresse `blob:` locale. Les sauvegardes d'état faites dans l'émulateur restent aussi sur l'appareil.
- **Moteur** : EmulatorJS est téléchargé depuis `https://cdn.emulatorjs.org/stable/data/` au premier lancement d'un système, puis mis en cache par le navigateur. Il faut donc une connexion la première fois. Lien « Adresse du moteur » pour pointer vers un miroir perso (dossier `data/` d'EmulatorJS, par ex. celui du dépôt WebGames).
- **Threads** : activés seulement si la page est servie en HTTPS isolé (`crossOriginIsolated`) ; sinon les cores sans threads suffisent pour les consoles 8/16 bits.

## Données

| Clé (localStorage) | Contenu | Synchronisée |
|---|---|---|
| `games.best` | records et nombre de parties, par jeu et niveau | oui (menu ⋯ → Synchronisation) |
| `games-save.<jeu>` | partie en cours | non : reste sur l'appareil |
| `games-pref.*` | dernier niveau, mode Snake, pioche du Solitaire, adresse du moteur | non |
| IndexedDB `webapps-emu` | tes ROMs (fichiers) | non : jamais envoyées |

Menu ⋯ → « Effacer les records » remet les records à zéro (sur tous les appareils synchronisés).

## Plus tard

- Émulateurs : PlayStation (BIOS à fournir), réglages de touches, export/import de la bibliothèque.
- D'autres jeux : 2048, mots mêlés…
