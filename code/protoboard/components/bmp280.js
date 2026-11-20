/* BMP280 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "bmp280",
  "name": "BMP280",
  "label": "BMP280",
  "category": "Capteurs",
  "description": "Pression/température I2C ou SPI, 6 broches",
  "color": "#5b2a86",
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
        "VCC:power",
        "GND",
        "SCL",
        "SDA",
        "CSB",
        "SDO"
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
    "CSB": "Haut = I2C, bas = SPI",
    "SDO": "I2C : adresse (GND 0x76, VCC 0x77) ; SPI : MISO"
  }
});
