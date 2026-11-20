/* Buzzer — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "buzzer",
  "name": "Buzzer",
  "label": "Buzzer",
  "category": "Discrets",
  "description": "actif ou passif, 3 pas entre pattes",
  "color": "#1c1c1c",
  "body": {
    "x0": -1.8,
    "y0": -1.8,
    "x1": 4.8,
    "y1": 1.8
  },
  "deco": [
    {
      "shape": "coin",
      "x": -1.2,
      "y": -1.2,
      "w": 5.4,
      "h": 2.4
    }
  ],
  "pins": [
    {
      "name": "+",
      "type": "power",
      "x": 0,
      "y": 0
    },
    {
      "name": "-",
      "type": "gnd",
      "x": 3,
      "y": 0
    }
  ],
  "notes": {
    "+": "Buzzer actif : + au GPIO (ou via transistor) ; passif : signal PWM"
  }
});
