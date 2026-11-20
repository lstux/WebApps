/* Détecteur PIR HC-SR501 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "pir-hc-sr501",
  "name": "Détecteur PIR HC-SR501",
  "label": "PIR",
  "category": "Capteurs",
  "description": "VCC OUT GND",
  "color": "#2e6b34",
  "body": {
    "x0": -0.7,
    "y0": -0.7,
    "x1": 2.7,
    "y1": 3
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "VCC:power",
        "OUT",
        "GND"
      ]
    }
  ],
  "deco": [
    {
      "shape": "coin",
      "x": 0.1,
      "y": 0.5,
      "w": 1.8,
      "h": 1.8
    }
  ],
  "notes": {
    "VCC": "5 V (4,5 à 20 V)",
    "OUT": "3,3 V en sortie : compatible ESP32"
  }
});
