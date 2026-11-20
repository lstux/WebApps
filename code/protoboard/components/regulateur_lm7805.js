/* Régulateur LM7805 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "regulateur-lm7805",
  "name": "Régulateur LM7805",
  "label": "7805",
  "category": "Alimentation",
  "description": "5 V, TO-220 : IN GND OUT",
  "color": "#1c1c1c",
  "body": {
    "x0": -0.8,
    "y0": -2.2,
    "x1": 2.8,
    "y1": 0.8
  },
  "deco": [
    {
      "shape": "rect",
      "x": -0.4,
      "y": -2,
      "w": 2.8,
      "h": 1.2,
      "fill": "#9aa0a8"
    }
  ],
  "rows": [
    {
      "y": 0,
      "pins": [
        "IN:power",
        "GND:gnd",
        "OUT:power"
      ]
    }
  ],
  "notes": {
    "IN": "7 à 25 V",
    "OUT": "5 V, 1 A max (chauffe : dissipateur)"
  }
});
