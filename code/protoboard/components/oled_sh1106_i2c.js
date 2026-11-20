/* OLED SH1106 1,3" I2C — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "oled-sh1106-i2c",
  "name": "OLED SH1106 1,3\" I2C",
  "label": "OLED 1,3",
  "category": "Écrans",
  "description": "I2C, 4 broches",
  "color": "#1d3557",
  "body": {
    "x0": -4,
    "y0": -0.8,
    "x1": 7.4,
    "y1": 11
  },
  "deco": [
    {
      "shape": "screen",
      "x": -3,
      "y": 1.2,
      "w": 9,
      "h": 8
    }
  ],
  "rows": [
    {
      "y": 0,
      "pins": [
        "GND",
        "VCC",
        "SCL",
        "SDA"
      ]
    }
  ],
  "notes": {
    "SCL": "I2C : SCL",
    "SDA": "I2C : SDA",
    "GND": "Ordre GND VCC SCL SDA sur la plupart des modules (parfois VCC GND) : vérifie la sérigraphie"
  }
});
