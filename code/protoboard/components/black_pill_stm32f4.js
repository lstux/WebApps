/* Black Pill (STM32F401/F411, WeAct) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "black-pill-stm32f4",
  "name": "Black Pill (STM32F401/F411, WeAct)",
  "label": "Black Pill",
  "category": "Cartes",
  "description": "STM32F4, 3,3 V, 20×2 broches",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -1.3,
    "x1": 7.8,
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
      "x": 7,
      "pins": [
        "VBAT:power",
        "C13",
        "C14",
        "C15",
        "NRST:ctrl",
        "A0",
        "A1",
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "B0",
        "B1",
        "B2/BOOT1:strap",
        "B10",
        "3V3:power",
        "GND:gnd",
        "5V:power"
      ]
    }
  ],
  "notes": {
    "C13": "LED intégrée",
    "B2/BOOT1": "BOOT1 : à laisser libre",
    "A0": "Bouton KEY (selon version)"
  },
  "deco": [
    {
      "shape": "usb",
      "x": 1.9,
      "y": -2.4,
      "w": 3.2,
      "h": 1.8
    }
  ]
});
