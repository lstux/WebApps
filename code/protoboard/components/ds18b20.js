/* DS18B20 (TO-92) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "ds18b20",
  "name": "DS18B20 (TO-92)",
  "label": "DS18B20",
  "category": "Capteurs",
  "description": "Température 1-Wire, vue de face",
  "color": "#1c1c1c",
  "body": {
    "x0": -0.7,
    "y0": -0.7,
    "x1": 2.7,
    "y1": 2.6
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "GND",
        "DQ",
        "VDD:power"
      ]
    }
  ],
  "notes": {
    "DQ": "Rappel de 4,7 kΩ vers VDD indispensable"
  }
});
