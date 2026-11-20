/* TFT ST7735 1,8" — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "tft-st7735",
  "name": "TFT ST7735 1,8\"",
  "label": "TFT 1,8",
  "category": "Écrans",
  "description": "SPI 128×160, 8 broches",
  "color": "#8a1c1c",
  "body": {
    "x0": -3,
    "y0": -0.8,
    "x1": 10.4,
    "y1": 12.5
  },
  "deco": [
    {
      "shape": "screen",
      "x": -2,
      "y": 1.4,
      "w": 11,
      "h": 9.6
    }
  ],
  "rows": [
    {
      "y": 0,
      "pins": [
        "LED",
        "SCK",
        "SDA",
        "A0",
        "RESET",
        "CS",
        "GND",
        "VCC:power"
      ]
    }
  ],
  "notes": {
    "LED": "Rétro-éclairage (via résistance ou 3V3)",
    "SDA": "= MOSI",
    "A0": "= DC (données/commande)"
  }
});
