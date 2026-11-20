/* GPS NEO-6M — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "gps-neo6m",
  "name": "GPS NEO-6M",
  "label": "GPS",
  "category": "Modules",
  "description": "VCC RX TX GND",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 3.8,
    "y1": 0.8
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "VCC:power",
        "RX",
        "TX",
        "GND"
      ]
    }
  ],
  "deco": [
    {
      "shape": "rect",
      "x": 0.1,
      "y": 0.6,
      "w": 1.8,
      "h": 1.8,
      "fill": "#d4b84c"
    }
  ],
  "notes": {
    "RX": "Entrée du module : relie-la au TX du MCU",
    "TX": "Sortie du module : relie-la au RX du MCU"
  }
});
