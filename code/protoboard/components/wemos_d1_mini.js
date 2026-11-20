/* Wemos D1 mini (ESP8266) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "wemos-d1-mini",
  "name": "Wemos D1 mini (ESP8266)",
  "label": "D1 mini",
  "category": "Cartes",
  "description": "ESP8266, 3,3 V, 8×2 broches",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 9.8,
    "y1": 8.4
  },
  "columns": [
    {
      "x": 0,
      "pins": [
        "RST:ctrl",
        "A0",
        "D0/IO16",
        "D5/IO14",
        "D6/IO12",
        "D7/IO13",
        "D8/IO15:strap",
        "3V3:power"
      ]
    },
    {
      "x": 9,
      "pins": [
        "TX:uart",
        "RX:uart",
        "D1/IO5",
        "D2/IO4",
        "D3/IO0:strap",
        "D4/IO2:strap",
        "GND:gnd",
        "5V:power"
      ]
    }
  ],
  "notes": {
    "D1/IO5": "SCL I2C (défaut)",
    "D2/IO4": "SDA I2C (défaut)",
    "D4/IO2": "LED intégrée",
    "A0": "Entrée analogique 0-3,2 V",
    "D3/IO0": "Strapping : bas = flash",
    "D8/IO15": "Strapping : doit être bas au boot"
  },
  "deco": [
    {
      "shape": "usb",
      "x": 2.9,
      "y": 7.8,
      "w": 3.2,
      "h": 1.8
    }
  ]
});
