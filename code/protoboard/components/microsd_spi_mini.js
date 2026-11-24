/* Lecteur microSD SPI « mini » 3,3 V (6 broches, sans régulateur) — vu de face, broches en haut, fente de la carte en bas.
   Ordre relevé au dos de la pièce (3v3 CS MOSI CLK MISO GND), donc de gauche à droite vu de face : GND … 3V3. */
ProtoBoard.component({
  id: 'microsd-spi-mini',
  name: 'Lecteur microSD SPI mini (3,3 V)',
  label: 'microSD',
  category: 'Modules',
  tags: ['sd', 'carte', 'stockage', 'tf'],
  description: '6 broches, 3,3 V seulement, 17 × 19 mm',
  color: '#1d5fa0',
  body: { x0: -0.9, y0: -0.8, x1: 5.9, y1: 6.7 },
  deco: [ { shape: 'can', x: 0.2, y: 3.7, w: 4.6, h: 3.6 } ],
  rows: [ { y: 0, pins: ['GND', 'MISO', 'CLK', 'MOSI', 'CS', '3V3:power'] } ],
  notes: {
    '3V3': '3,3 V uniquement : pas de régulateur ni d\'adaptation de niveau sur ce modèle',
    'CLK': 'Horloge SPI (SCK)',
    'CS': 'Sélection de la carte, une broche par périphérique SPI'
  }
});
