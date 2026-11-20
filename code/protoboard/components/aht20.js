/* AHT20 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "aht20",
  "name": "AHT20",
  "label": "AHT20",
  "category": "Capteurs",
  "description": "Température/humidité I2C, adresse 0x38",
  "color": "#2e6b34",
  "body": {
    "x0": -0.7,
    "y0": -0.7,
    "x1": 3.7,
    "y1": 2.6
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "VIN:power",
        "GND",
        "SCL",
        "SDA"
      ]
    }
  ],
  "deco": [
    {
      "shape": "chip",
      "x": 0.2,
      "y": 0.5,
      "w": 1.6,
      "h": 1.4
    }
  ],
  "notes": {
    "SCL": "I2C : SCL",
    "SDA": "I2C : SDA"
  }
});
