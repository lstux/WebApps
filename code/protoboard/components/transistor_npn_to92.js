/* Transistor NPN TO-92 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "transistor-npn-to92",
  "name": "Transistor NPN TO-92",
  "label": "NPN",
  "category": "Discrets",
  "description": "2N2222 / BC547, vue de face (méplat)",
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
    "E": "Brochage 2N2222 (PN2222) : E B C. Le BC547 est C B E : retourne avec ⇋ ou renomme."
  }
});
