var five = require('johnny-five');
var board = new five.Board();

board.on('ready', () => {
  var nightlight = new five.Led(3);
  var photoresistor = new five.Light({
    pin: 'A0',
    freq: 500
  });

  var dimmest = 1023;
  var brightest = 0;

  photoresistor.on('change', () => {
    var relativeValue;
    if(photoresistor.value > dimmest) {
        dimmest = photoresistor.value;
    }
    if(photoresistor.value < brightest) {
        brightest = photoresistor.value;
    }

    relativeValue = five.Fn.scale(photoresistor.value, brightest, dimmest, 0, 511);
    if(relativeValue <= 255) {
        nightlight.brightness(relativeValue ^ 255);
    } else {
        nightlight.off();
    }
  });
});
