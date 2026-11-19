/* ESP32-C3 Super Mini — vue de dessus, USB en haut.
   Brochage à vérifier sur ta carte : certains clones diffèrent (bouton ⇋ pour retourner). */
ProtoBoard.component({
  id: 'esp32-c3-super-mini',
  name: 'ESP32-C3 Super Mini',
  label: 'C3 Super Mini',
  category: 'Cartes',
  description: '2×8 broches, écart 6 pas',
  color: '#1b2a3a',
  body: { x0: -0.6, y0: -1.3, x1: 6.6, y1: 7.6 },
  deco: [ { shape: 'usb', x: 1.25, y: -2.0, w: 3.5, h: 1.5 } ],
  columns: [
    { x: 0, pins: ['5V:power', 'GND:gnd', '3V3:power', 'IO4', 'IO3', 'IO2:strap', 'IO1', 'IO0'] },
    { x: 6, pins: ['IO5', 'IO6', 'IO7', 'IO8:strap', 'IO9:strap', 'IO10', 'IO20/RX:uart', 'IO21/TX:uart'] }
  ],
  notes: {
    'IO8': 'LED bleue intégrée ; strapping — ne pas tirer à la masse au démarrage',
    'IO9': 'Bouton BOOT ; strapping',
    'IO2': 'Strapping — laisser libre ou tiré au 3V3 au démarrage',
    'IO0': 'ADC1_CH0', 'IO1': 'ADC1_CH1', 'IO3': 'ADC1_CH3', 'IO4': 'ADC1_CH4',
    'IO20/RX': 'UART0 RX', 'IO21/TX': 'UART0 TX'
  }
});
