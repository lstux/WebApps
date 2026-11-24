/* PCF8574 (module I2C) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "pcf8574",
  "name": "PCF8574 (module I2C)",
  "label": "PCF8574",
  "category": "Interfaces",
  "description": "Extension 8 E/S I2C",
  "color": "#2e6b34",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 7.8,
    "y1": 3.8
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "GND",
        "VCC:power",
        "SDA",
        "SCL",
        "INT",
        "A0",
        "A1",
        "A2"
      ]
    },
    {
      "y": 3,
      "pins": [
        "P0",
        "P1",
        "P2",
        "P3",
        "P4",
        "P5",
        "P6",
        "P7"
      ]
    }
  ],
  "notes": {
    "A0": "Adresse I2C : 0x20 + A2A1A0",
    "INT": "Sortie d'interruption (drain ouvert)"
  }
});
