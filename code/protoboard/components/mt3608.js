/* Élévateur MT3608 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "mt3608",
  "name": "Élévateur MT3608",
  "label": "MT3608",
  "category": "Alimentation",
  "description": "IN± et OUT±, tension réglable par vis",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 4.8,
    "y1": 1.8
  },
  "columns": [
    {
      "x": 0,
      "pins": [
        "IN+:power",
        "IN-:gnd"
      ]
    },
    {
      "x": 4,
      "pins": [
        "OUT+:power",
        "OUT-:gnd"
      ]
    }
  ],
  "notes": {
    "OUT+": "Règle la tension avant de brancher la charge"
  }
});
