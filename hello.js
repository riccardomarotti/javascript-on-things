const five = require('johnny-five');
const board = new five.Board();

function* createCount(limit) {
    for(i=1; i<=limit; i++) {
        yield i;
    }
}

board.on('ready', () => {
  const led = new five.Led(13);
  var count = createCount(5);

  led.blink(500, () => {
    const countState = count.next()
    if(countState.done) {
        console.log('I shall stop blinking now');
        led.stop();
    } else {
        console.log(`I have changed state ${countState.value} times`);
    }
  });
});
