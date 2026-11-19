/* Module DS3231 (ZS-042) — horloge temps réel I2C, connecteur 6 broches. */
ProtoBoard.component({
  id: 'ds3231',
  name: 'DS3231 (ZS-042)',
  label: 'DS3231',
  category: 'Modules',
  description: 'Horloge RTC I2C, 6 broches',
  color: '#1f6f8b',
  body: { x0: -1.6, y0: -0.7, x1: 6.6, y1: 14.2 },
  deco: [ { shape: 'chip', x: 1.4, y: 2.0, w: 2.2, h: 1.6 }, { shape: 'coin', x: 0.0, y: 7.0, w: 5.0, h: 5.0 } ],
  rows: [ { y: 0, pins: ['32K', 'SQW', 'SCL', 'SDA', 'VCC', 'GND'] } ],
  notes: {
    'SQW': 'Sortie carrée / interruption d\'alarme',
    'VCC': '3,3 à 5 V',
    '32K': 'Sortie 32 kHz'
  }
});
