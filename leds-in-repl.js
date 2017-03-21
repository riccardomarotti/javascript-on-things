var five = require('johnny-five');

var board = new five.Board();

board.on('ready', () => {
  var led1 = new five.Led(2);
  var led2 = new five.Led(3);

  board.repl.inject({
    led1: led1,
    led2: led2
  });
});
