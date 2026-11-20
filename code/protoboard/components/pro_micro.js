/* Pro Micro (ATmega32U4) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "pro-micro",
  "name": "Pro Micro (ATmega32U4)",
  "label": "Pro Micro",
  "category": "Cartes",
  "description": "5 V / 3,3 V, USB natif, 12×2 broches",
  "color": "#a02828",
  "body": {
    "x0": -0.8,
    "y0": -1.3,
    "x1": 6.8,
    "y1": 11.8
  },
  "columns": [
    {
      "x": 0,
      "pins": [
        "TX0/D1:uart",
        "RX1/D0:uart",
        "GND",
        "GND",
        "D2/SDA",
        "D3/SCL",
        "D4/A6",
        "D5",
        "D6/A7",
        "D7",
        "D8/A8",
        "D9/A9"
      ]
    },
    {
      "x": 6,
      "pins": [
        "RAW:power",
        "GND",
        "RST:ctrl",
        "VCC:power",
        "A3/D21",
        "A2/D20",
        "A1/D19",
        "A0/D18",
        "D15/SCK",
        "D14/MISO",
        "D16/MOSI",
        "D10/A10"
      ]
    }
  ],
  "notes": {
    "RAW": "Entrée 5-12 V (avant le régulateur)",
    "VCC": "5 V ou 3,3 V selon la version (cavalier)",
    "D2/SDA": "I2C SDA",
    "D3/SCL": "I2C SCL"
  },
  "deco": [
    {
      "shape": "usb",
      "x": 1.4,
      "y": -2.4,
      "w": 3.2,
      "h": 1.8
    }
  ]
});
