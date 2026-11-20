/* DHT22 / DHT11 (module) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "dht22",
  "name": "DHT22 / DHT11 (module)",
  "label": "DHT",
  "category": "Capteurs",
  "description": "Température/humidité, 1 fil, 3 broches",
  "color": "#1d9bd1",
  "body": {
    "x0": -0.7,
    "y0": -0.7,
    "x1": 2.7,
    "y1": 3.4
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "DATA",
        "VCC:power",
        "GND"
      ]
    }
  ],
  "deco": [
    {
      "shape": "rect",
      "x": -0.1,
      "y": 0.5,
      "w": 3.2,
      "h": 2.5,
      "fill": "#e8eef5"
    }
  ],
  "notes": {
    "DATA": "Résistance de rappel de 10 kΩ vers VCC si le module n'en a pas"
  }
});
