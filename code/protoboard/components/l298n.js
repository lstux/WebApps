/* Pont en H L298N — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "l298n",
  "name": "Pont en H L298N",
  "label": "L298N",
  "category": "Moteurs",
  "description": "ENA IN1…IN4 ENB ; alim ; sorties",
  "color": "#8a1c1c",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 5.8,
    "y1": 6.8
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "ENA",
        "IN1",
        "IN2",
        "IN3",
        "IN4",
        "ENB"
      ]
    },
    {
      "y": 3,
      "pins": [
        "+12V:power",
        "GND:gnd",
        "+5V:power"
      ]
    },
    {
      "y": 6,
      "pins": [
        "OUT1",
        "OUT2",
        "OUT3",
        "OUT4"
      ]
    }
  ],
  "notes": {
    "+5V": "Sortie du régulateur 5 V (cavalier posé) ou entrée 5 V logique",
    "OUT1": "Moteur A",
    "OUT3": "Moteur B"
  }
});
