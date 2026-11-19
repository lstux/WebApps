/* ESP32-S3 Super Mini — vue de dessus, USB en haut.
   Brochage à vérifier sur ta carte : certains clones diffèrent (bouton ⇋ pour retourner). */
ProtoBoard.component({
  id: 'esp32-s3-super-mini',
  name: 'ESP32-S3 Super Mini',
  label: 'S3 Super Mini',
  category: 'Cartes',
  description: '2×9 broches, écart 6 pas',
  color: '#162a40',
  body: { x0: -0.6, y0: -1.3, x1: 6.6, y1: 8.6 },
  deco: [ { shape: 'usb', x: 1.25, y: -2.0, w: 3.5, h: 1.5 } ],
  columns: [
    { x: 0, pins: ['5V:power', 'GND:gnd', '3V3:power', 'IO13', 'IO12', 'IO11', 'IO10', 'IO9', 'IO8'] },
    { x: 6, pins: ['IO43/TX:uart', 'IO44/RX:uart', 'IO1', 'IO2', 'IO3:strap', 'IO4', 'IO5', 'IO6', 'IO7'] }
  ],
  notes: {
    'IO3': 'Strapping (JTAG) — prudence au démarrage',
    'IO43/TX': 'UART0 TX (console)',
    'IO44/RX': 'UART0 RX'
  }
});
