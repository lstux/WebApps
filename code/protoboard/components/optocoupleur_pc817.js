/* Optocoupleur PC817 — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "optocoupleur-pc817",
  "name": "Optocoupleur PC817",
  "label": "PC817",
  "category": "Puissance",
  "description": "DIP-4 : A K / E C, 3 pas entre rangées",
  "color": "#1c1c1c",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 3.8,
    "y1": 2.8
  },
  "deco": [
    {
      "shape": "chip",
      "x": 0.2,
      "y": -0.4,
      "w": 2.6,
      "h": 2.8
    }
  ],
  "columns": [
    {
      "x": 0,
      "pins": [
        "A",
        "K"
      ]
    },
    {
      "x": 3,
      "pins": [
        "C",
        "E"
      ]
    }
  ],
  "notes": {
    "A": "Anode de la LED d'entrée (côté pin 1, repère)",
    "K": "Cathode de la LED",
    "E": "Émetteur du phototransistor",
    "C": "Collecteur"
  }
});
