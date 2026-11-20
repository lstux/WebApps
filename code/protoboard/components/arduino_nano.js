/* Arduino Nano — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "arduino-nano",
  "name": "Arduino Nano",
  "label": "Nano",
  "category": "Cartes",
  "description": "ATmega328P, 5 V, 15×2 broches",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -1.3,
    "x1": 6.8,
    "y1": 14.8
  },
  "columns": [
    {
      "x": 0,
      "pins": [
        "D1/TX:uart",
        "D0/RX:uart",
        "RST:ctrl",
        "GND",
        "D2",
        "D3",
        "D4",
        "D5",
        "D6",
        "D7",
        "D8",
        "D9",
        "D10",
        "D11",
        "D12"
      ]
    },
    {
      "x": 6,
      "pins": [
        "VIN:power",
        "GND",
        "RST:ctrl",
        "5V:power",
        "A7",
        "A6",
        "A5",
        "A4",
        "A3",
        "A2",
        "A1",
        "A0",
        "AREF",
        "3V3:power",
        "D13"
      ]
    }
  ],
  "notes": {
    "D13": "LED intégrée ; SCK SPI",
    "A4": "SDA I2C",
    "A5": "SCL I2C",
    "D11": "MOSI",
    "D12": "MISO",
    "D10": "SS",
    "A6": "Entrée analogique seulement",
    "A7": "Entrée analogique seulement"
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
