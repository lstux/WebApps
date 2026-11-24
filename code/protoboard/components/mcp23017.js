/* MCP23017 (DIP-28) — composant ProtoBoardDesigner (brochage de mémoire : à vérifier sur ta pièce). */
ProtoBoard.component({
  "id": "mcp23017",
  "name": "MCP23017 (DIP-28)",
  "label": "MCP23017",
  "category": "Interfaces",
  "description": "Extension 16 E/S I2C, 7,62 mm entre rangées",
  "color": "#1c1c1c",
  "body": {
    "x0": -0.8,
    "y0": -0.8,
    "x1": 3.8,
    "y1": 13.8
  },
  "columns": [
    {
      "x": 0,
      "pins": [
        "GPB0",
        "GPB1",
        "GPB2",
        "GPB3",
        "GPB4",
        "GPB5",
        "GPB6",
        "GPB7",
        "VDD:power",
        "VSS:gnd",
        "NC",
        "SCL",
        "SDA",
        "NC"
      ]
    },
    {
      "x": 3,
      "pins": [
        "GPA7",
        "GPA6",
        "GPA5",
        "GPA4",
        "GPA3",
        "GPA2",
        "GPA1",
        "GPA0",
        "INTA",
        "INTB",
        "RESET",
        "A2",
        "A1",
        "A0"
      ]
    }
  ],
  "deco": [
    {
      "shape": "chip",
      "x": 0.4,
      "y": -0.4,
      "w": 2.2,
      "h": 13.8
    }
  ],
  "notes": {
    "RESET": "Relie-la à VDD (active à l'état bas)",
    "A0": "Adresse 0x20 + A2A1A0"
  }
});
