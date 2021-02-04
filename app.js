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

      let mode = 'flash';
      let rgb = [0, 0, 0];
      process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
          process.exit();
        } else if (key.name === 'space') {
          console.log('space');

          if(mode === 'flash') {
            let buffer = Buffer.from([0x56].concat(rgb, [0x00, 0xf0, 0xaa]));
            char.write(buffer, true);
  
            setTimeout(function() {
              buffer = Buffer.from([0x56].concat([0, 0, 0], [0x00, 0xf0, 0xaa]));
              char.write(buffer, true);
            }, 100);
          } else if(mode === 'on') {
            let buffer = Buffer.from([0x56].concat(rgb, [0x00, 0xf0, 0xaa]));
            char.write(buffer, true);
          } else if(mode === 'off') {
            let buffer = Buffer.from([0x56].concat([0, 0, 0], [0x00, 0xf0, 0xaa]));
            char.write(buffer, true);
          }

        } else {
          console.log(`You pressed the "${str}" key`);
          switch(key.name) {
            //=====modes=====
            case '1':
              mode = 'flash';
              break;
            case '2':
              mode = 'on';
              break;
            case '3':
              mode = 'off';
              break;

            //=====red=====
            case 'q':
              //255,0,0
              rgb = [0xff, 0, 0];
              break;
            case 'w':
              //189,0,0
              rgb = [0xbd, 0, 0];
              break;  
            case 'e':
              //126,0,0
              rgb = [0x7e, 0, 0];
              break;             
            case 'r':
              //63,0,0
              rgb = [0x3f, 0, 0];
              break;

            //=====green=====
            case 'a':
              //0,255,0
              rgb = [0, 0xff, 0];
              break;
            case 's':
              //0,189,0
              rgb = [0, 0xbd, 0];
              break;  
            case 'd':
              //0,126,0
              rgb = [0, 0x7e, 0];
              break;             
            case 'f':
              //0,63,0
              rgb = [0, 0x3f, 0];
              break;

            //=====blue=====
            case 'z':
              //0,0,255
              rgb = [0, 0, 0xff];
              break;
            case 'x':
              //0,0,189
              rgb = [0, 0, 0xbd];
              break;  
            case 'c':
              //0,0,126
              rgb = [0, 0, 0x7e];
              break;             
            case 'v':
              //0,0,63
              rgb = [0, 0, 0x3f];
              break;


            default:
              rgb = [0xff, 0xff, 0xff];
          }


        }
      });

    });
  });
  console.log('Found device with local name: ' + peripheral.advertisement.localName);
});