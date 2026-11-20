/* HC-SR04 (ultrasons) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "hc-sr04",
  "name": "HC-SR04 (ultrasons)",
  "label": "HC-SR04",
  "category": "Capteurs",
  "description": "Distance, VCC Trig Echo GND",
  "color": "#1d3557",
  "body": {
    "x0": -0.7,
    "y0": -0.7,
    "x1": 3.7,
    "y1": 3
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "VCC:power",
        "TRIG",
        "ECHO",
        "GND"
      ]
    }
  ],
  "deco": [
    {
      "shape": "can",
      "x": -0.4,
      "y": 0.6,
      "w": 1.6,
      "h": 1.8
    },
    {
      "shape": "can",
      "x": 2,
      "y": 0.6,
      "w": 1.6,
      "h": 1.8
    }
  ],
  "notes": {
    "VCC": "5 V",
    "ECHO": "Sortie en 5 V : pont diviseur (1k/2k) avant un ESP32"
  }
});
