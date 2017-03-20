var five = require('johnny-five');
var board = new five.Board();
var temperature;

board.on('ready', () => {
  temperature = new five.Thermometer({
    pin: 'A0',
    toCelsius: function(raw) { // taken from here: https://tkkrlab.nl/wiki/Arduino_KY-013_Temperature_sensor_module
        var temp = Math.log(10000.0*((1024.0/raw-1)));
        temp = 1 / (0.001129148 + (0.000234125 + (0.0000000876741 * temp * temp ))* temp );
        temp = temp - 273.15;
        return temp;
    }
  });

  board.repl.inject({
      temp: temperature
    });
});
