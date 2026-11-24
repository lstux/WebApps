/* Joystick analogique — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "joystick-analogique",
  "name": "Joystick analogique",
  "label": "Joystick",
  "category": "Commandes",
  "description": "GND 5V VRx VRy SW, module KY-023",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 5.8,
    "y1": 7.2
  },
  "deco": [
    {
      "shape": "can",
      "x": 0.8,
      "y": 1.8,
      "w": 3.4,
      "h": 3.4
    }
  ],
  "rows": [
    {
      "y": 0,
      "pins": [
        "GND:gnd",
        "+5V:power",
        "VRx",
        "VRy",
        "SW"
      ]
    }
  ],
  "notes": {
    "+5V": "Alimente-le en 3,3 V avec un ESP32 : sinon les sorties VRx/VRy dépassent 3,3 V",
    "VRx": "Analogique : utilise une entrée ADC1",
    "VRy": "Analogique : utilise une entrée ADC1"
  }
});
