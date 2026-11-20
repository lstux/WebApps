/* TFT ILI9341 2,8" — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "tft-ili9341",
  "name": "TFT ILI9341 2,8\"",
  "label": "TFT 2,8",
  "category": "Écrans",
  "description": "SPI 240×320 + tactile, 14 broches",
  "color": "#8a1c1c",
  "body": {
    "x0": -3,
    "y0": -0.8,
    "x1": 16.4,
    "y1": 26
  },
  "deco": [
    {
      "shape": "screen",
      "x": -1.5,
      "y": 1.4,
      "w": 17,
      "h": 22
    }
  ],
  "rows": [
    {
      "y": 0,
      "pins": [
        "VCC:power",
        "GND",
        "CS",
        "RESET",
        "DC",
        "SDI",
        "SCK",
        "LED",
        "SDO",
        "T_CLK",
        "T_CS",
        "T_DIN",
        "T_DO",
        "T_IRQ"
      ]
    }
  ],
  "notes": {
    "SDI": "= MOSI",
    "SDO": "= MISO",
    "LED": "Rétro-éclairage",
    "T_CS": "Tactile résistif (XPT2046) : même bus SPI, CS à part"
  }
});
