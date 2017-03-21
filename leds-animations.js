// var five = require('johnny-five');
// var board = new five.Board();

// board.on('ready', () => {
//   var pulsingLED = new five.Led(3);

//   var options = {
//     easing    : 'inOutSine',
//     metronomic: true,
//     loop      : true,
//     keyFrames : [0, 255],
//     duration  : 1000
//   };


//   var animation = new five.Animation(pulsingLED);
//   animation.enqueue(options);

//   board.repl.inject({
//     led: pulsingLED
//   });
// });


var five = require('johnny-five');
var board = new five.Board();

board.on('ready', () => {
  var pulsingLED = new five.Led(3);
  pulsingLED.pulse(1000);
});
