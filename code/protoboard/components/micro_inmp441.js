/* Micro I2S INMP441 (module rond Ø 14 mm, 2×3 pastilles) — vu côté pastilles et sérigraphie (trou du micro au centre).
   Brochage relevé sur la photo de la pièce : SD VDD GND d'un côté, SCK WS L/R de l'autre. Monté pastilles dessous : ⇋. */
ProtoBoard.component({
  id: 'micro-inmp441',
  name: 'Micro I2S INMP441',
  label: 'INMP441',
  category: 'Capteurs',
  tags: ['micro', 'microphone', 'son', 'audio', 'i2s'],
  description: 'Micro numérique I2S, rond Ø 14 mm, 2×3 broches',
  color: '#151515',
  round: true,
  body: { x0: -1.1, y0: -1.6, x1: 4.1, y1: 3.6 },
  deco: [ { shape: 'chip', x: 1.25, y: -1.1, w: 0.5, h: 0.5 } ],
  columns: [
    { x: 0, labels: 'left', pins: ['SD', 'VDD:power', 'GND'] },
    { x: 3, labels: 'right', pins: ['SCK', 'WS', 'L/R'] }
  ],
  notes: {
    'VDD': '1,8 à 3,3 V (pas de 5 V)',
    'SD': 'Données I2S (sortie du micro) → entrée I2S DIN de l\'ESP32',
    'SCK': 'Horloge de bit I2S (BCLK)',
    'WS': 'Horloge de mot I2S (LRCLK)',
    'L/R': 'Canal : GND → gauche, VDD → droite (ne pas laisser en l\'air)'
  }
});
