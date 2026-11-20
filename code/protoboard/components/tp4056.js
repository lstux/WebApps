/* Chargeur TP4056 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "tp4056",
  "name": "Chargeur TP4056",
  "label": "TP4056",
  "category": "Alimentation",
  "description": "IN+ IN− / OUT+ OUT− / B+ B−",
  "color": "#2e6b34",
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
      "x": 3,
      "pins": [
        "B+:power",
        "B-:gnd"
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
    "B+": "Vers l'accu Li-ion",
    "OUT+": "Sortie protégée (version avec DW01 uniquement)"
  }
});
