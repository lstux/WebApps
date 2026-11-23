/* Breadboard 170 (mini) — composant ProtoBoardDesigner (généré par une boucle : trous, liaisons internes, rails). */
(function(){
  /* Breadboard : COLS colonnes numérotées 1..COLS de gauche à droite ; rangées j..f en haut, e..a en bas,
     séparées par la rainure centrale (3 pas : un circuit DIP s'y pose à cheval). Chaque demi-colonne de
     5 trous est reliée ; chaque rail (+ / −) est relié sur toute sa longueur (rails continus).
     Rails : groupes de 5 trous séparés d'un pas. */
  var COLS = 17, RAILS = false, ID = 'breadboard-170', NAME = 'Breadboard 170 (mini)', LABEL = 'BB170', DESC = '17 colonnes, sans rails';
  var top = RAILS ? 3 : 0;                    // rangée j
  var rows = 'jihgfedcba', pins = [], buses = [], deco = [], marks = [];
  var y = function(r){ return r < 5 ? top + r : top + r + 2; };   // j..f puis e..a après la rainure
  for (var x = 0; x < COLS; x++){
    var up = [], dn = [];
    for (var r = 0; r < 10; r++){
      var n = rows[r].toUpperCase() + (x + 1);
      pins.push({x: x, y: y(r), name: n, type: 'gpio'});
      (r < 5 ? up : dn).push(n);
    }
    buses.push(up, dn);
  }
  var bottom = y(9) + 2;
  if (RAILS){
    var span = Math.floor((COLS + 1) / 6) * 6 - 1, off = Math.floor((COLS - span) / 2);
    [['H+', 0, 'power'], ['H-', 1, 'gnd'], ['B-', bottom, 'gnd'], ['B+', bottom + 1, 'power']].forEach(function(rl){
      var bus = [], k = 0;
      for (var x = off; x < off + span; x++){
        if ((x - off) % 6 === 5) continue;
        var n = rl[0] + (++k); pins.push({x: x, y: rl[1], name: n, type: rl[2]}); bus.push(n);
      }
      buses.push(bus);
      marks.push({x: off - 1.6, y: rl[1], t: rl[2] === 'power' ? '+' : '−'}, {x: off + span + .6, y: rl[1], t: rl[2] === 'power' ? '+' : '−'});
      deco.push({shape: 'rect', x: off - .5, y: rl[1] + (rl[1] === 0 || rl[1] === bottom ? -.62 : .5), w: span, h: .12, fill: rl[2] === 'power' ? '#e5484d' : '#3b82f6'});
    });
  }
  deco.push({shape: 'rect', x: -.6, y: y(4) + 1.25, w: COLS + .2, h: .5, fill: '#d9d3c4'});   // rainure centrale
  for (var c = 1; c <= COLS; c++) if (c === 1 || c % 5 === 0) { marks.push({x: c - 1, y: top - .9, t: String(c)}); marks.push({x: c - 1, y: y(9) + .9, t: String(c)}); }
  for (var r = 0; r < 10; r++) { marks.push({x: -1, y: y(r), t: rows[r]}); marks.push({x: COLS, y: y(r), t: rows[r]}); }
  var y1 = RAILS ? bottom + 1.8 : y(9) + 1.8;
  ProtoBoard.component({
    id: ID, name: NAME, label: LABEL, category: 'Breadboards', description: DESC,
    color: '#f1ece1', pinStyle: 'hole', under: true,
    body: {x0: -1.7, y0: RAILS ? -1 : -1.8, x1: COLS + .7, y1: y1},
    deco: deco, marks: marks, pins: pins, buses: buses
  });
})();
