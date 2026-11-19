/* Écran OLED 0,96" SSD1306 I2C, 4 broches.
   L'ordre GND/VCC est inversé sur certains modèles : vérifie la sérigraphie (✎ pour renommer). */
ProtoBoard.component({
  id: 'oled-ssd1306-i2c',
  name: 'OLED SSD1306 0,96" I2C',
  label: 'OLED 0,96"',
  category: 'Écrans',
  description: '128×64, I2C, 4 broches',
  color: '#1d3557',
  body: { x0: -3.5, y0: -0.8, x1: 6.5, y1: 9.8 },
  deco: [ { shape: 'screen', x: -3.1, y: 1.4, w: 9.2, h: 6.2 } ],
  rows: [ { y: 0, pins: ['GND', 'VCC', 'SCL', 'SDA'] } ],
  notes: {
    'VCC': '3,3 à 5 V selon le module',
    'SDA': 'Adresse I2C habituelle : 0x3C'
  }
});
