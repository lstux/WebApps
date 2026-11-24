/* Abaisseur DC-DC Mini560 (sortie 5 V fixe) — vu de face (composants dessus), entrée à gauche, sortie à droite.
   Relevé au dos de la pièce : IN+/IN- d'un côté, OUT+/OUT- de l'autre (flèche IN → OUT), EN près de IN-.
   Chaque pôle a 2 demi-trous reliés. Les pastilles ne tombent pas exactement au pas de 2,54 mm (≈ 10,5 pas entre IN et OUT) :
   prévoir des fils ou des picots un peu pliés. */
ProtoBoard.component({
  id: 'mini560-5v',
  name: 'Abaisseur DC-DC Mini560 5 V',
  label: 'Mini560 5V',
  category: 'Alimentation',
  tags: ['dc-dc', 'buck', 'step-down', 'convertisseur', 'regulateur', '5v'],
  description: 'Entrée 7-20 V → 5 V, 31 × 19 mm',
  color: '#1d5fa0',
  body: { x0: -0.9, y0: -0.75, x1: 10.9, y1: 6.75 },
  deco: [ { shape: 'chip', x: 3.4, y: 0.4, w: 3.2, h: 3.2 } ],
  pins: [
    { name: 'IN+', type: 'power', x: 0, y: 0, label: 'right' }, { name: 'IN+ ', type: 'power', x: 0, y: 1, label: 'right' },
    { name: 'IN-', type: 'gnd', x: 0, y: 5, label: 'right' }, { name: 'IN- ', type: 'gnd', x: 0, y: 6, label: 'right' },
    { name: 'OUT+', type: 'power', x: 10, y: 0, label: 'left' }, { name: 'OUT+ ', type: 'power', x: 10, y: 1, label: 'left' },
    { name: 'OUT-', type: 'gnd', x: 10, y: 5, label: 'left' }, { name: 'OUT- ', type: 'gnd', x: 10, y: 6, label: 'left' },
    { name: 'EN', x: 2, y: 6, label: 'up' }
  ],
  buses: [ ['IN+', 'IN+ '], ['OUT+', 'OUT+ '], ['IN-', 'IN- ', 'OUT-', 'OUT- '] ],
  notes: {
    'IN+': 'Entrée 7 à 20 V environ (3S Li-Ion : OK)',
    'OUT+': '5 V, jusqu\'à ~5 A en pointe (prévoir moins en continu, ça chauffe)',
    'IN-': 'Masse commune entrée/sortie',
    'EN': 'Activation : libre ou haut = marche, à la masse = arrêt'
  }
});
