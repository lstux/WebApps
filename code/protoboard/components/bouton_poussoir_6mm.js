/* Bouton poussoir 6 mm — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "bouton-poussoir-6mm",
  "name": "Bouton poussoir 6 mm",
  "label": "BP",
  "category": "Commandes",
  "description": "4 pattes, 2×2 pas (pattes forcées)",
  "color": "#1c1c1c",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 2.8,
    "y1": 2.8
  },
  "deco": [
    {
      "shape": "coin",
      "x": 0.2,
      "y": 0.2,
      "w": 1.6,
      "h": 1.6
    }
  ],
  "pins": [
    {
      "name": "1a",
      "x": 0,
      "y": 0
    },
    {
      "name": "2a",
      "x": 2,
      "y": 0
    },
    {
      "name": "1b",
      "x": 0,
      "y": 2
    },
    {
      "name": "2b",
      "x": 2,
      "y": 2
    }
  ],
  "notes": {
    "1a": "1a et 1b sont toujours reliées entre elles",
    "2a": "2a et 2b aussi : le bouton relie le groupe 1 au groupe 2"
  }
});
