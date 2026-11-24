/* Pont en H DRV8833 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "drv8833",
  "name": "Pont en H DRV8833",
  "label": "DRV8833",
  "category": "Moteurs",
  "description": "2 moteurs, 2,7-10,8 V",
  "color": "#8a1c1c",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 5.8,
    "y1": 4.8
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "SLP",
        "FLT",
        "AI1",
        "AI2",
        "BI1",
        "BI2"
      ]
    },
    {
      "y": 4,
      "pins": [
        "VM:power",
        "GND:gnd",
        "AO1",
        "AO2",
        "BO1",
        "BO2"
      ]
    }
  ],
  "notes": {
    "SLP": "Doit être à l'état haut pour activer"
  }
});
