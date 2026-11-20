/* OLED SSD1306 0,96" SPI — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "oled-ssd1306-spi",
  "name": "OLED SSD1306 0,96\" SPI",
  "label": "OLED SPI",
  "category": "Écrans",
  "description": "SPI, 7 broches",
  "color": "#1d3557",
  "body": {
    "x0": -3,
    "y0": -0.8,
    "x1": 9,
    "y1": 9.8
  },
  "deco": [
    {
      "shape": "screen",
      "x": -1.5,
      "y": 1.2,
      "w": 8,
      "h": 7
    }
  ],
  "rows": [
    {
      "y": 0,
      "pins": [
        "GND",
        "VCC",
        "SCK",
        "MOSI",
        "RES",
        "DC",
        "CS"
      ]
    }
  ],
  "notes": {
    "SCK": "Étiqueté D0 sur beaucoup de modules",
    "MOSI": "Étiqueté D1 ou SDA",
    "RES": "Reset (à relier à un GPIO ou au 3V3)",
    "DC": "Données/commande",
    "CS": "Sélection du module"
  }
});
