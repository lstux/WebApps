/* Chargeur + boost 5 V MH-CD42 (IP5306) — picots vus de dessus, composants vers le bas de l'écran
   (retourner ⇋ pour un montage debout, composants vers l'extérieur). Ordre des picots à vérifier. */
ProtoBoard.component({
  "id": "mh-cd42",
  "name": "Chargeur + boost 5 V MH-CD42 (IP5306)",
  "label": "MH-CD42",
  "category": "Alimentation",
  "tags": [
    "ip5306",
    "lithium",
    "batterie",
    "boost",
    "chargeur"
  ],
  "description": "Accu Li-ion 1S, charge et sortie 5 V ; 6 picots au pas de 2,54, se monte à plat ou debout",
  "color": "#1a1a1a",
  "body": {
    "x0": -0.7,
    "y0": -0.5,
    "x1": 5.7,
    "y1": 0.5
  },
  "rows": [
    {
      "y": 0,
      "pins": [
        "VIN:power",
        "GND1:gnd",
        "GND2:gnd",
        "BAT:power",
        "GND3:gnd",
        "OUT5V:power"
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
    "VIN": "Entrée de charge 5 V (charge et sortie 5 V possibles en même temps)",
    "BAT": "Accu Li-ion 1S (+)",
    "OUT5V": "Sortie boost 5 V. Le boost s'éteint seul si la consommation reste sous ~50 mA environ 30 s ; il se rallume quand une charge est branchée ou par un appui sur KEY",
    "GND1": "Les trois GND sont reliées sur le module"
  }
});
