/* ESP32-CAM (AI Thinker / HW-297) — vue de dessus, caméra en haut.
   Brochage à vérifier sur ta carte : les clones diffèrent (bouton ⇋ pour retourner). */
ProtoBoard.component({
  "id": "esp32-cam-hw297",
  "name": "ESP32-CAM (AI Thinker / HW-297)",
  "label": "ESP32-CAM",
  "category": "Cartes",
  "tags": [
    "camera",
    "wifi",
    "ov2640",
    "microsd"
  ],
  "description": "2×8 broches, écart 9 pas, caméra en haut (vue de dessus, côté caméra)",
  "color": "#1d2a44",
  "body": {
    "x0": -0.8,
    "y0": -7.9,
    "x1": 9.8,
    "y1": 7.7
  },
  "deco": [
    {
      "shape": "chip",
      "x": 2.5,
      "y": -6.6,
      "w": 4,
      "h": 3.4
    },
    {
      "shape": "rect",
      "x": 1.4,
      "y": -7.4,
      "w": 6.2,
      "h": 6.0,
      "fill": "#c3c8cf"
    },
    {
      "shape": "antenna",
      "x": 0.5,
      "y": 2.2,
      "w": 2.2,
      "h": 4.6
    }
  ],
  "columns": [
    {
      "x": 0,
      "pins": [
        "IO4",
        "IO2:strap",
        "IO14",
        "IO15:strap",
        "IO13",
        "IO12:strap",
        "GND1:gnd",
        "5V:power"
      ]
    },
    {
      "x": 9,
      "pins": [
        "GND2:gnd",
        "U0T/IO1:uart",
        "U0R/IO3:uart",
        "VCC:power",
        "GND3:gnd",
        "IO0:strap",
        "IO16:avoid",
        "3V3:power"
      ]
    }
  ],
  "buses": [
    [
      "GND1",
      "GND2",
      "GND3"
    ]
  ],
  "notes": {
    "GND1": "Les trois GND sont reliées sur la carte",
    "IO4": "LED blanche (flash) ; DATA1 de la SD en 4 bits",
    "IO2": "SD DATA0 (mode 1 bit) ; strapping",
    "IO14": "SD CLK",
    "IO15": "SD CMD ; strapping",
    "IO13": "Libre avec la SD en 1 bit : SDA de l'I2C BigFarm",
    "IO12": "Libre avec la SD en 1 bit : SCL de l'I2C BigFarm. Strapping MTDI : à l'état haut au démarrage, Flash en 1,8 V → fusible 3,3 V obligatoire avant d'y mettre une résistance de tirage",
    "IO0": "Horloge caméra (XCLK) + mode programmation à la masse au démarrage (bouton BOOT)",
    "IO16": "PSRAM : ne pas utiliser",
    "VCC": "3,3 V ou 5 V selon le pont de soudure de la carte : ne pas utiliser",
    "U0T/IO1": "TX de la carte → RX de l'adaptateur USB-série",
    "U0R/IO3": "RX de la carte ← TX de l'adaptateur USB-série",
    "5V": "Alimentation 5 V (sortie du MH-CD42 via l'interrupteur)"
  }
});
