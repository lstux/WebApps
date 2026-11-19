/* Module BME280 (GY-BME280, 6 broches) — température, humidité, pression.
   Version 4 broches (VIN GND SCL SDA) : retire CSB et SDO de la liste. */
ProtoBoard.component({
  id: 'bme280',
  name: 'BME280',
  label: 'BME280',
  category: 'Capteurs',
  description: 'I2C/SPI, 6 broches',
  color: '#5b2a86',
  body: { x0: -0.7, y0: -0.7, x1: 5.7, y1: 3.6 },
  deco: [ { shape: 'chip', x: 2.0, y: 1.6, w: 1.0, h: 1.0 } ],
  rows: [ { y: 0, pins: ['VCC', 'GND', 'SCL', 'SDA', 'CSB', 'SDO'] } ],
  notes: {
    'VCC': 'Selon le module : 3,3 V seulement, ou 3,3–5 V s\'il a un régulateur',
    'SDO': 'Adresse I2C : GND → 0x76, 3V3 → 0x77',
    'CSB': 'Laisser à 3V3 (ou libre) pour rester en I2C'
  }
});
