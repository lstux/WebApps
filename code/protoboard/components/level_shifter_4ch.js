/* Adaptateur de niveau 4 voies — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "level-shifter-4ch",
  "name": "Adaptateur de niveau 4 voies",
  "label": "Level shifter",
  "category": "Interfaces",
  "description": "BSS138, 3,3 V ↔ 5 V",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 5.8,
    "y1": 5.8
  },
  "columns": [
    {
      "x": 0,
      "pins": [
        "LV:power",
        "LV1",
        "LV2",
        "GND:gnd",
        "LV3",
        "LV4"
      ]
    },
    {
      "x": 5,
      "pins": [
        "HV:power",
        "HV1",
        "HV2",
        "GND:gnd",
        "HV3",
        "HV4"
      ]
    }
  ],
  "notes": {
    "LV": "Alimentation côté bas (3,3 V)",
    "HV": "Alimentation côté haut (5 V)"
  }
});
