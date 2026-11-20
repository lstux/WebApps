/* Blue Pill (STM32F103C8) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "blue-pill-stm32f103",
  "name": "Blue Pill (STM32F103C8)",
  "label": "Blue Pill",
  "category": "Cartes",
  "description": "STM32F103, 3,3 V, 20×2 broches (écart entre rangées à vérifier)",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -1.3,
    "x1": 9.8,
    "y1": 19.8
  },
  "columns": [
    {
      "x": 0,
      "pins": [
        "B12",
        "B13",
        "B14",
        "B15",
        "A8",
        "A9/TX1:uart",
        "A10/RX1:uart",
        "A11/USB-",
        "A12/USB+",
        "A15",
        "B3",
        "B4",
        "B5",
        "B6/SCL1",
        "B7/SDA1",
        "B8",
        "B9",
        "5V:power",
        "GND:gnd",
        "3V3:power"
      ]
    },
    {
      "x": 9,
      "pins": [
        "GND:gnd",
        "GND:gnd",
        "3V3:power",
        "NRST:ctrl",
        "B11",
        "B10",
        "B1",
        "B0",
        "A7/MOSI1",
        "A6/MISO1",
        "A5/SCK1",
        "A4/NSS1",
        "A3",
        "A2",
        "A1",
        "A0",
        "C15",
        "C14",
        "C13",
        "VBAT:power"
      ]
    }
  ],
  "notes": {
    "C13": "LED intégrée (active à l'état bas)",
    "A11/USB-": "USB : garde-les libres si tu utilises l'USB",
    "A12/USB+": "USB : garde-les libres si tu utilises l'USB"
  },
  "deco": [
    {
      "shape": "usb",
      "x": 2.9,
      "y": -2.4,
      "w": 3.2,
      "h": 1.8
    }
  ]
});
