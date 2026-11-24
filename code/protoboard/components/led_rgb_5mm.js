/* LED RGB 5 mm — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "led-rgb-5mm",
  "name": "LED RGB 5 mm",
  "label": "LED RGB",
  "category": "Composants",
  "description": "4 pattes, cathode commune",
  "color": "#2b2b2b",
  "body": {
    "x0": -0.7,
    "y0": -0.8,
    "x1": 3.7,
    "y1": 0.8
  },
  "deco": [
    {
      "shape": "rect",
      "x": -0.3,
      "y": -0.45,
      "w": 3.6,
      "h": 0.9,
      "fill": "#d9d9d9"
    }
  ],
  "rows": [
    {
      "y": 0,
      "pins": [
        "R",
        "K:gnd",
        "G",
        "B"
      ]
    }
  ],
  "notes": {
    "K": "Cathode commune (la plus longue patte), version anode commune : relie-la au +"
  },
  "pinStyle": "round"
});
