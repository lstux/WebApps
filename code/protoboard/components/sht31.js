/* SHT31 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "sht31",
  "name": "SHT31",
  "label": "SHT31",
  "category": "Capteurs",
  "description": "Température/humidité I2C, 0x44 ou 0x45",
  "color": "#2e6b34",
  "body": {
    "x0": -0.7,
    "y0": -0.7,
    "x1": 5.7,
    "y1": 2.6
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "VIN:power",
        "GND",
        "SCL",
        "SDA",
        "ADR",
        "ALRT"
      ]
    }
  ],
  "deco": [
    {
      "shape": "chip",
      "x": 0.2,
      "y": 0.5,
      "w": 2.2,
      "h": 1.4
    }
  ],
  "notes": {
    "ADR": "GND = 0x44, VCC = 0x45",
    "ALRT": "Sortie d'alerte (facultatif)"
  }
});
