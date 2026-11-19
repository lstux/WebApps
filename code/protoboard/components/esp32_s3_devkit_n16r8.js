/* ESP32-S3 DevKitC-1 N16R8 (et clones) — vue de dessus, antenne en haut, USB en bas.
   Écart entre rangées : 9 pas (22,86 mm). Certains clones sont plus larges : mesure le tien
   et change le x de la deuxième colonne (et body.x1) si besoin. */
ProtoBoard.component({
  id: 'esp32-s3-devkit-n16r8',
  name: 'ESP32-S3 DevKit N16R8',
  label: 'S3 DevKit N16R8',
  category: 'Cartes',
  description: '2×22 broches, écart 9 pas',
  color: '#14213d',
  body: { x0: -0.8, y0: -3.4, x1: 9.8, y1: 22.5 },
  deco: [
    { shape: 'can', x: 2.3, y: -3.1, w: 4.4, h: 7.2 },
    { shape: 'antenna', x: 2.3, y: -3.1, w: 4.4, h: 1.4 },
    { shape: 'usb', x: 1.03, y: 21.4, w: 2.8, h: 1.6 },
    { shape: 'usb', x: 5.17, y: 21.4, w: 2.8, h: 1.6 }
  ],
  columns: [
    { x: 0, pins: ['3V3:power', '3V3:power', 'RST:ctrl', 'IO4', 'IO5', 'IO6', 'IO7', 'IO15', 'IO16', 'IO17', 'IO18', 'IO8',
                   'IO3:strap', 'IO46:strap', 'IO9', 'IO10', 'IO11', 'IO12', 'IO13', 'IO14', '5V:power', 'GND:gnd'] },
    { x: 9, pins: ['GND:gnd', 'IO43/TX:uart', 'IO44/RX:uart', 'IO1', 'IO2', 'IO42', 'IO41', 'IO40', 'IO39', 'IO38', 'IO37:avoid', 'IO36:avoid',
                   'IO35:avoid', 'IO0:strap', 'IO45:strap', 'IO48', 'IO47', 'IO21', 'IO20:avoid', 'IO19:avoid', 'GND:gnd', 'GND:gnd'] }
  ],
  notes: {
    'IO0': 'Bouton BOOT ; strapping',
    'IO3': 'Strapping (JTAG)',
    'IO45': 'Strapping (tension VDD_SPI) — laisser libre',
    'IO46': 'Strapping — laisser libre au démarrage',
    'IO35': 'Utilisée par la PSRAM octale (N16R8) — ne pas utiliser',
    'IO36': 'Utilisée par la PSRAM octale (N16R8) — ne pas utiliser',
    'IO37': 'Utilisée par la PSRAM octale (N16R8) — ne pas utiliser',
    'IO19': 'USB natif D−', 'IO20': 'USB natif D+',
    'IO48': 'LED RGB intégrée (selon révision)',
    'IO43/TX': 'UART0 TX (console)', 'IO44/RX': 'UART0 RX',
    'RST': 'Reset (EN)'
  }
});
