/* Relais 1 voie — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "relais-1-voie",
  "name": "Relais 1 voie",
  "label": "Relais",
  "category": "Modules",
  "description": "Commande VCC GND IN ; contacts NC COM NO",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 2.8,
    "y1": 4.8
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "VCC:power",
        "GND",
        "IN"
      ]
    },
    {
      "y": 4,
      "pins": [
        "NC",
        "COM",
        "NO"
      ]
    }
  ],
  "deco": [
    {
      "shape": "can",
      "x": -0.2,
      "y": 1,
      "w": 3.4,
      "h": 2.2
    }
  ],
  "notes": {
    "IN": "Souvent actif à l'état bas",
    "COM": "Commun : relie-le à NO (ouvert au repos) ou NC (fermé au repos)"
  }
});
