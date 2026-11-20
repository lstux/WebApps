/* LoRa SX127x (breakout) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "lora-sx127x",
  "name": "LoRa SX127x (breakout)",
  "label": "LoRa",
  "category": "Modules",
  "description": "8 broches : 3V3 GND MISO MOSI SCK NSS RST DIO0",
  "color": "#8a1c1c",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 7.8,
    "y1": 0.8
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "3V3:power",
        "GND",
        "MISO",
        "MOSI",
        "SCK",
        "NSS",
        "RST",
        "DIO0"
      ]
    }
  ],
  "deco": [
    {
      "shape": "can",
      "x": 0.4,
      "y": 0.8,
      "w": 5,
      "h": 3.4
    }
  ],
  "notes": {
    "3V3": "3,3 V seulement",
    "DIO0": "Interruption RX/TX done"
  }
});
