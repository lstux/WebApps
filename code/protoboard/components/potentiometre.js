/* Potentiomètre — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "potentiometre",
  "name": "Potentiomètre",
  "label": "Pot",
  "category": "Discrets",
  "description": "3 pattes, 1 pas d'écart",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 2.8,
    "y1": 2.2
  },
  "deco": [
    {
      "shape": "can",
      "x": 0.2,
      "y": 0.4,
      "w": 1.6,
      "h": 1.2
    }
  ],
  "rows": [
    {
      "y": 0,
      "pins": [
        "1",
        "W",
        "2"
      ]
    }
  ],
  "notes": {
    "W": "Curseur (point milieu)",
    "1": "Extrémité",
    "2": "Extrémité"
  }
});
