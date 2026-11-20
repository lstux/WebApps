/* OLED SH1106 1,3" SPI — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "oled-sh1106-spi",
  "name": "OLED SH1106 1,3\" SPI",
  "label": "OLED 1,3 SPI",
  "category": "Écrans",
  "description": "SPI, 7 broches",
  "color": "#1d3557",
  "body": {
    "x0": -3,
    "y0": -0.8,
    "x1": 9.4,
    "y1": 11
  },
  "deco": [
    {
      "shape": "screen",
      "x": -2.2,
      "y": 1.2,
      "w": 10,
      "h": 8.5
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
