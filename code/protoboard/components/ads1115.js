/* Module ADS1115 — convertisseur analogique-numérique 16 bits, 4 voies, I2C. */
ProtoBoard.component({
  id: 'ads1115',
  name: 'ADS1115',
  label: 'ADS1115',
  category: 'Capteurs',
  description: 'CAN 16 bits I2C, 10 broches',
  color: '#1f4fa8',
  body: { x0: -0.7, y0: -0.7, x1: 9.7, y1: 5.8 },
  deco: [ { shape: 'chip', x: 3.8, y: 2.0, w: 1.4, h: 1.4 } ],
  rows: [ { y: 0, pins: ['VDD', 'GND', 'SCL', 'SDA', 'ADDR', 'ALRT', 'A0', 'A1', 'A2', 'A3'] } ],
  notes: {
    'ADDR': 'Adresse I2C : GND → 0x48, VDD → 0x49, SDA → 0x4A, SCL → 0x4B',
    'ALRT': 'Sortie d\'alerte / conversion prête'
  }
});
