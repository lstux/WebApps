/* Abaisseur LM2596 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "lm2596",
  "name": "Abaisseur LM2596",
  "label": "LM2596",
  "category": "Alimentation",
  "description": "IN± et OUT±, tension réglable par vis",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 6.8,
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
      "x": 6,
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
