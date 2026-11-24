/* Écran OLED 0,96" I2C (en portrait) avec 4 boutons < > # * — vu de face, broches à gauche.
   Ordre relevé sur la sérigraphie : K1 K2 K3 K4 SDA SCL VCC GND, de haut en bas. */
ProtoBoard.component({
  id: 'oled-i2c-4-boutons',
  name: 'OLED 0,96" I2C + 4 boutons',
  label: 'OLED + 4 btn',
  category: 'Écrans',
  tags: ['oled', 'ssd1306', 'boutons', 'clavier', 'menu', 'touches'],
  description: '128×64 en portrait, 4 boutons K1-K4, 8 broches, 29 × 46 mm',
  color: '#141414',
  body: { x0: -1.0, y0: -5.0, x1: 10.4, y1: 13.2 },
  deco: [
    { shape: 'screen', x: 1.6, y: 0.3, w: 7.3, h: 10.1 },
    { shape: 'rect', x: 1.15, y: -3.0, w: 1.3, h: 1.9, fill: '#c9c9c9' },
    { shape: 'rect', x: 3.25, y: -3.0, w: 1.3, h: 1.9, fill: '#c9c9c9' },
    { shape: 'rect', x: 5.55, y: -3.0, w: 1.3, h: 1.9, fill: '#c9c9c9' },
    { shape: 'rect', x: 7.75, y: -3.0, w: 1.3, h: 1.9, fill: '#c9c9c9' }
  ],
  columns: [ { x: 0, pins: ['K1', 'K2', 'K3', 'K4', 'SDA', 'SCL', 'VCC:power', 'GND'] } ],
  notes: {
    'K1': 'Bouton « < » ; ferme vers GND (à vérifier) : INPUT_PULLUP',
    'K2': 'Bouton « > »', 'K3': 'Bouton « # »', 'K4': 'Bouton « * »',
    'VCC': '3,3 à 5 V selon le module',
    'SDA': 'Adresse I2C habituelle de l\'écran : 0x3C'
  }
});
