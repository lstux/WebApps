/* NRF24L01 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "nrf24l01",
  "name": "NRF24L01",
  "label": "NRF24",
  "category": "Radio & GPS",
  "description": "2×4 broches, antenne en haut",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 1.8,
    "y1": 3.8
  },
  "columns": [
    {
      "x": 0,
      "pins": [
        "GND",
        "CE",
        "SCK",
        "MISO"
      ]
    },
    {
      "x": 1,
      "pins": [
        "VCC:power",
        "CSN",
        "MOSI",
        "IRQ"
      ]
    }
  ],
  "deco": [
    {
      "shape": "antenna",
      "x": -0.7,
      "y": -3,
      "w": 2.4,
      "h": 1.8
    }
  ],
  "notes": {
    "VCC": "3,3 V (un condensateur de 10 µF entre VCC et GND aide beaucoup)"
  }
});
