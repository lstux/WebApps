/* ESP32 DevKit 30 broches (DOIT) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "esp32-devkit-30",
  "name": "ESP32 DevKit 30 broches (DOIT)",
  "label": "ESP32 30",
  "category": "Cartes",
  "description": "ESP32-WROOM, antenne en haut, USB en bas",
  "color": "#1b2a3a",
  "body": {
    "x0": -0.8,
    "y0": -2.9,
    "x1": 9.8,
    "y1": 15.4
  },
  "columns": [
    {
      "x": 0,
      "pins": [
        "EN:ctrl",
        "VP/IO36",
        "VN/IO39",
        "IO34",
        "IO35",
        "IO32",
        "IO33",
        "IO25",
        "IO26",
        "IO27",
        "IO14",
        "IO12:strap",
        "IO13",
        "GND:gnd",
        "VIN:power"
      ]
    },
    {
      "x": 9,
      "pins": [
        "IO23",
        "IO22",
        "TX0/IO1:uart",
        "RX0/IO3:uart",
        "IO21",
        "IO19",
        "IO18",
        "IO5:strap",
        "IO17",
        "IO16",
        "IO4",
        "IO0:strap",
        "IO2:strap",
        "IO15:strap",
        "3V3:power"
      ]
    }
  ],
  "notes": {
    "IO34": "Entrée seulement",
    "IO35": "Entrée seulement",
    "IO36": "Entrée seulement (VP)",
    "IO39": "Entrée seulement (VN)",
    "IO12": "Strapping : doit être bas au boot",
    "IO21": "I2C SDA (défaut)",
    "IO22": "I2C SCL (défaut)",
    "IO0": "Strapping : bas = mode flash"
  },
  "deco": [
    {
      "shape": "usb",
      "x": 2.9,
      "y": 14.8,
      "w": 3.2,
      "h": 1.8
    },
    {
      "shape": "antenna",
      "x": 2.5,
      "y": -2.8,
      "w": 4,
      "h": 2
    }
  ]
});
