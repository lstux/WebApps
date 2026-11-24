/* Écran OLED 0,91" 128×32 SSD1306 I2C — 4 broches sur le petit côté droit, vu de face.
   Ordre relevé sur la sérigraphie de la pièce : GND VCC SCL SDA (de haut en bas). */
ProtoBoard.component({
  id: 'oled-ssd1306-128x32-i2c',
  name: 'OLED SSD1306 0,91" 128×32 I2C',
  label: 'OLED 0,91"',
  category: 'Écrans',
  tags: ['oled', '128x32', '0.91'],
  description: '128×32, I2C, 4 broches sur le côté, 38 × 12 mm',
  color: '#1d3557',
  body: { x0: -14.1, y0: -0.85, x1: 0.8, y1: 3.85 },
  deco: [ { shape: 'screen', x: -13.4, y: -0.45, w: 11.8, h: 3.9 } ],
  columns: [ { x: 0, pins: ['GND', 'VCC', 'SCL', 'SDA'] } ],
  notes: {
    'VCC': '3,3 à 5 V selon le module',
    'SDA': 'Adresse I2C habituelle : 0x3C'
  }
});
