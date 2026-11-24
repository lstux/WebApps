/* INA219 (courant/tension) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "ina219",
  "name": "INA219 (courant/tension)",
  "label": "INA219",
  "category": "Capteurs",
  "description": "I2C : VCC GND SCL SDA VIN+ VIN−",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 5.8,
    "y1": 0.8
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "VCC:power",
        "GND",
        "SCL",
        "SDA",
        "VIN+",
        "VIN-"
      ]
    }
  ],
  "notes": {
    "VIN+": "Côté source ; le courant passe de VIN+ à VIN− (shunt de 0,1 Ω)"
  }
});
