const noble = require('@abandonware/noble');
const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);


noble.on('stateChange', function (state) {
  console.log('stateChange');
  if (state === 'poweredOn') {
      console.log('start scanning');
      noble.startScanning(['0xffe5'], false);
  } else {
    console.log('stop scanning');
      noble.stopScanning();
  }
});


noble.on('discover', function (peripheral) {
  console.log('discover');
  peripheral.connect(function (err) {
    console.log('Connected!', err);

    peripheral.discoverSomeServicesAndCharacteristics(['0xffe5'], ['0xffe9'], function (err, svc, chars) {
      let char = chars.filter(char => char.uuid === 'ffe9')[0];


      process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
          process.exit();
        } else {
          console.log(`You pressed the "${str}" key`);
          let rgb = [0, 0, 0];
          
          switch(key.name) {
            case 'r':
              rgb = [0xff, 0, 0];
              break;
            case 'g':
              rgb = [0, 0xff, 0];
              break;
            case 'b':
              rgb = [0, 0, 0xff];
            break;
            default:
              rgb = [0xff, 0xff, 0xff];
          }

          let buffer = Buffer.from([0x56].concat(rgb, [0x00, 0xf0, 0xaa]));
          char.write(buffer, true);
        }
      });

    });
  });
  console.log('Found device with local name: ' + peripheral.advertisement.localName);
});