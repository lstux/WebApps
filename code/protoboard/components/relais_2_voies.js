/* Relais 2 voies — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "relais-2-voies",
  "name": "Relais 2 voies",
  "label": "Relais x2",
  "category": "Modules",
  "description": "Commande VCC IN1 IN2 GND",
  "color": "#1d3557",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 3.8,
    "y1": 0.8
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "VCC:power",
        "IN1",
        "IN2",
        "GND:gnd"
      ]
    }
  ],
  "deco": [
    {
      "shape": "can",
      "x": 0,
      "y": 0.8,
      "w": 3,
      "h": 2.4
    }
  ],
  "notes": {
    "IN1": "Souvent actif à l'état bas",
    "VCC": "Cavalier JD-VCC : alim séparée pour les bobines si besoin"
  }
});
