/* MPU6050 (GY-521) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "mpu6050",
  "name": "MPU6050 (GY-521)",
  "label": "MPU6050",
  "category": "Capteurs",
  "description": "Accéléromètre/gyroscope I2C, 8 broches",
  "color": "#1d3557",
  "body": {
    "x0": -0.7,
    "y0": -0.7,
    "x1": 7.7,
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
        "XDA",
        "XCL",
        "AD0",
        "INT"
      ]
    }
  ],
  "deco": [
    {
      "shape": "chip",
      "x": 0.4,
      "y": 0.5,
      "w": 2.4,
      "h": 1.4
    }
  ],
  "notes": {
    "AD0": "GND = 0x68, VCC = 0x69",
    "INT": "Interruption",
    "XDA": "Bus I2C auxiliaire",
    "XCL": "Bus I2C auxiliaire"
  }
});
