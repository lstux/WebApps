/* Interrupteur à glissière — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "interrupteur-3-pattes",
  "name": "Interrupteur à glissière",
  "label": "SW",
  "category": "Discrets",
  "description": "SPDT, 3 pattes : A COM B",
  "color": "#4a4a4a",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 2.8,
    "y1": 1.8
  },
  "deco": [
    {
      "shape": "rect",
      "x": 0.3,
      "y": 0.2,
      "w": 1.4,
      "h": 0.9,
      "fill": "#c3c8cf"
    }
  ],
  "rows": [
    {
      "y": 0,
      "pins": [
        "A",
        "COM",
        "B"
      ]
    }
  ],
  "notes": {
    "COM": "Point commun, relié à A ou B selon la position"
  }
});
