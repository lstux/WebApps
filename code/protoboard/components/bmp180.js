/* BMP180 (GY-68) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "bmp180",
  "name": "BMP180 (GY-68)",
  "label": "BMP180",
  "category": "Capteurs",
  "description": "Pression/température I2C, 4 broches",
  "color": "#1d3557",
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
        "VCC:power",
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
    "SDA": "I2C : SDA",
    "VCC": "3,3 V (certains modules acceptent 5 V)"
  }
});
