const five = require('johnny-five');
const board = new five.Board();


board.on('ready', () => {
  var sensor = new five.Sensor({
    pin: 'A1',
    freq: 1000
  });

  sensor.on('change', () => {
    console.log(sensor.value);
  });
});
