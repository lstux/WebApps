/* Lecteur microSD (SPI) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "microsd-spi",
  "name": "Lecteur microSD (SPI)",
  "label": "microSD",
  "category": "Modules",
  "description": "6 broches : CS SCK MOSI MISO VCC GND",
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
        "CS",
        "SCK",
        "MOSI",
        "MISO",
        "VCC:power",
        "GND"
      ]
    }
  ],
  "deco": [
    {
      "shape": "can",
      "x": 0.2,
      "y": 0.8,
      "w": 4.6,
      "h": 2.4
    }
  ],
  "notes": {
    "VCC": "Beaucoup de modules veulent 5 V (régulateur + adaptation de niveau) ; les versions 3,3 V seulement : vérifie"
  }
});
