/* MOSFET N TO-220 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "mosfet-n-to220",
  "name": "MOSFET N TO-220",
  "label": "MOSFET",
  "category": "Discrets",
  "description": "IRLZ44N / IRLB8721 : G D S, face imprimée devant",
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
        "G",
        "D",
        "S:gnd"
      ]
    }
  ],
  "notes": {
    "G": "Grille : prends un MOSFET « logic level » (IRLZ44N) avec un ESP32 en 3,3 V",
    "D": "Drain, aussi la languette métallique"
  }
});
