/* Encodeur rotatif KY-040 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "encodeur-ky040",
  "name": "Encodeur rotatif KY-040",
  "label": "KY-040",
  "category": "Discrets",
  "description": "CLK DT SW + GND, 5 broches",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 5.8,
    "y1": 7.2
  },
  "deco": [
    {
      "shape": "can",
      "x": 0.8,
      "y": 1.8,
      "w": 3.4,
      "h": 3.4
    }
  ],
  "rows": [
    {
      "y": 0,
      "pins": [
        "GND:gnd",
        "+:power",
        "SW",
        "DT",
        "CLK"
      ]
    }
  ],
  "notes": {
    "+": "3,3 V ou 5 V (les résistances de rappel du module sont vers +)",
    "CLK": "Sortie A",
    "DT": "Sortie B",
    "SW": "Bouton intégré"
  }
});
