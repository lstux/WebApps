/* Transistor PNP TO-92 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "transistor-pnp-to92",
  "name": "Transistor PNP TO-92",
  "label": "PNP",
  "category": "Discrets",
  "description": "2N2907 / BC557, vue de face",
  "color": "#1c1c1c",
  "body": {
    "x0": -0.7,
    "y0": -0.8,
    "x1": 2.7,
    "y1": 0.8
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "E",
        "B",
        "C"
      ]
    }
  ],
  "notes": {
    "E": "Brochage 2N2907 : E B C. Le BC557 est C B E : retourne avec ⇋ ou renomme."
  }
});
