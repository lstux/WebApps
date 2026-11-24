/* Pont en H TB6612FNG — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "tb6612",
  "name": "Pont en H TB6612FNG",
  "label": "TB6612",
  "category": "Moteurs",
  "description": "2 moteurs, VM 4,5-13,5 V",
  "color": "#8a1c1c",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 7.8,
    "y1": 6.8
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "PWMA",
        "AIN2",
        "AIN1",
        "STBY",
        "BIN1",
        "BIN2",
        "PWMB",
        "GND:gnd"
      ]
    },
    {
      "y": 6,
      "pins": [
        "VM:power",
        "VCC:power",
        "GND:gnd",
        "AO1",
        "AO2",
        "BO2",
        "BO1",
        "GND:gnd"
      ]
    }
  ],
  "notes": {
    "VCC": "Logique 3,3 V",
    "STBY": "Doit être à l'état haut pour activer"
  }
});
