/* Matrice WS2812B 8×8 (« WS2812B-64 », 65 × 65 mm) — vue de face (LED dessus).
   Plots relevés au dos : entrée V+ IN V- dans un coin, sortie V+ OUT V- dans le coin opposé ; vu de face,
   l'entrée est en haut à droite et la sortie en bas à gauche. Plots à souder (fils), pas des trous traversants. */
(function(){
  const deco = [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++)
    deco.push({ shape: 'rect', x: 0.55 + c * 3.2 - 1, y: 0.45 + r * 3.2 - 1, w: 2, h: 2, fill: '#f2f2ee40' });
  ProtoBoard.component({
    id: 'matrice-ws2812b-8x8',
    name: 'Matrice LED WS2812B 8×8',
    label: 'WS2812B 8×8',
    category: 'Écrans',
    tags: ['led', 'neopixel', 'rgb', 'matrice', 'ws2812', 'adressable'],
    description: '64 LED RGB adressables, 65 × 65 mm, 1 fil de données',
    color: '#141414',
    body: { x0: -0.8, y0: -0.9, x1: 24.8, y1: 24.7 },
    deco,
    columns: [
      { x: 24, y: 0, labels: 'left', pins: ['V+:power', 'DIN', 'V-:gnd'] },
      { x: 1, y: 21, labels: 'right', pins: ['V+ :power', 'DOUT', 'V- :gnd'] }
    ],
    buses: [ ['V+', 'V+ '], ['V-', 'V- '] ],
    notes: {
      'V+': '5 V ; jusqu\'à ~3,8 A tout allumé en blanc (60 mA par LED) : limiter la luminosité ou alimenter à part',
      'DIN': 'Données : résistance série 220-470 Ω ; en 3,3 V ça passe souvent, sinon adaptateur de niveau',
      'V-': 'Masse commune avec le microcontrôleur ; condensateur 470-1000 µF entre V+ et V-',
      'DOUT': 'Sortie vers la matrice ou le ruban suivant'
    }
  });
})();
