/* Raspberry Pi Pico — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "raspberry-pi-pico",
  "name": "Raspberry Pi Pico",
  "label": "Pico",
  "category": "Cartes",
  "description": "RP2040, 3,3 V, 20×2 broches",
  "color": "#2e6b34",
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
        "GP0",
        "GP1",
        "GND:gnd",
        "GP2",
        "GP3",
        "GP4",
        "GP5",
        "GND:gnd",
        "GP6",
        "GP7",
        "GP8",
        "GP9",
        "GND:gnd",
        "GP10",
        "GP11",
        "GP12",
        "GP13",
        "GND:gnd",
        "GP14",
        "GP15"
      ]
    },
    {
      "x": 7,
      "pins": [
        "VBUS:power",
        "VSYS:power",
        "GND:gnd",
        "3V3_EN:ctrl",
        "3V3:power",
        "ADC_VREF",
        "GP28",
        "AGND:gnd",
        "GP27",
        "GP26",
        "RUN:ctrl",
        "GP22",
        "GND:gnd",
        "GP21",
        "GP20",
        "GP19",
        "GP18",
        "GND:gnd",
        "GP17",
        "GP16"
      ]
    }
  ],
  "notes": {
    "VBUS": "5 V USB",
    "VSYS": "Entrée 1,8-5,5 V",
    "GP26": "ADC0",
    "GP27": "ADC1",
    "GP28": "ADC2",
    "GP4": "I2C0 SDA (défaut)",
    "GP5": "I2C0 SCL (défaut)"
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
