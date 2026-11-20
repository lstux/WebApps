/* ESP32 DevKitC 38 broches — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "esp32-devkit-38",
  "name": "ESP32 DevKitC 38 broches",
  "label": "ESP32 38",
  "category": "Cartes",
  "description": "ESP32-WROOM, antenne en haut, USB en bas",
  "color": "#1b2a3a",
  "body": {
    "x0": -0.8,
    "y0": -2.9,
    "x1": 9.8,
    "y1": 19.4
  },
  "columns": [
    {
      "x": 0,
      "pins": [
        "3V3:power",
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
        "GND:gnd",
        "IO13",
        "IO9:avoid",
        "IO10:avoid",
        "IO11:avoid",
        "5V:power"
      ]
    },
    {
      "x": 9,
      "pins": [
        "GND:gnd",
        "IO23",
        "IO22",
        "TX0/IO1:uart",
        "RX0/IO3:uart",
        "IO21",
        "GND:gnd",
        "IO19",
        "IO18",
        "IO5:strap",
        "IO17",
        "IO16",
        "IO4",
        "IO0:strap",
        "IO2:strap",
        "IO15:strap",
        "IO8:avoid",
        "IO7:avoid",
        "IO6:avoid"
      ]
    }
  ],
  "notes": {
    "IO6": "Flash SPI : à ne pas utiliser (IO6 à IO11)",
    "IO34": "Entrée seulement",
    "IO35": "Entrée seulement",
    "IO36": "Entrée seulement",
    "IO39": "Entrée seulement",
    "IO12": "Strapping : doit être bas au boot",
    "IO0": "Strapping : bas = mode flash"
  },
  "deco": [
    {
      "shape": "usb",
      "x": 2.9,
      "y": 18.8,
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
