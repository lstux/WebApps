/* Régulateur AMS1117 3,3 V — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "regulateur-ams1117",
  "name": "Régulateur AMS1117 3,3 V",
  "label": "AMS1117",
  "category": "Alimentation",
  "description": "3,3 V, SOT-223 sur breakout : GND OUT IN",
  "color": "#2e6b34",
  "body": {
    "x0": -0.7,
    "y0": -0.8,
    "x1": 2.7,
    "y1": 2.8
  },
  "deco": [
    {
      "shape": "chip",
      "x": 0,
      "y": 0.6,
      "w": 2,
      "h": 1.4
    }
  ],
  "rows": [
    {
      "y": 0,
      "pins": [
        "GND:gnd",
        "OUT:power",
        "IN:power"
      ]
    }
  ],
  "notes": {
    "OUT": "3,3 V (vérifie ta version : 1,8 / 2,5 / 3,3 / 5 V)"
  }
});
