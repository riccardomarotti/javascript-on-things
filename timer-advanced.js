var five = require('johnny-five');
var board = new five.Board();


const DEFAULT_TIMER = 10000;
const UPPER_LIMIT = 99 * 60000;
const LOWER_LIMIT = 1000;
var timeRemaining;
var timer;
var timeString, lastTimeString;
var timestamp, lastTimestamp;


board.on('ready', () => {
  var downButton = new five.Button(2);
  var upButton = new five.Button(3);
  var goButton = new five.Button(4);
  var lcd = new five.LCD([7, 8, 9, 10, 11, 12]);
  var alertChime = new five.Piezo(6);



  function init () {
    timeRemaining = DEFAULT_TIMER;
    lastTimeString = '00:00';
    timeString = '';
    showRemaining();
  }


  function showRemaining () {
    var minutes, seconds, minPad, secPad;
    minutes = Math.floor(timeRemaining / 60000);
    seconds = Math.floor((timeRemaining % 60000) / 1000);
    minPad = (minutes < 10) ? '0' : '';
    secPad = (seconds < 10) ? '0' : '';
    timeString = `${minPad}${minutes}:${secPad}${seconds}`;
    if (timeString != lastTimeString) {
      lcd.cursor(0, 0).print(timeString);
    }
  }


  function adjustTime (delta) {
    timeRemaining += delta;
    if (timeRemaining < LOWER_LIMIT) {
      timeRemaining = LOWER_LIMIT;
    } else if (timeRemaining > UPPER_LIMIT) {
      timeRemaining = UPPER_LIMIT;
    }
    showRemaining();
  }

  function start () {
    lcd.clear();
    timestamp = Date.now();
    timer = setInterval(tick, 250);
    tick();
  }

  function tick () {
    lastTimestamp = timestamp;
    timestamp = Date.now();
    timeRemaining -= (timestamp - lastTimestamp);
    if (timeRemaining <= 0) {
      timer = clearInterval(timer);
      chime();
      init();
    }

    showRemaining();
  }

  function pause () {
    timer = clearInterval(timer);
    lcd.cursor(0, 9).print('PAUSED');
  }

  function chime () {
    alertChime.play({
      tempo: 120,
      song: [
        ['e5', 1],
        ['g#5', 1],
        ['f#5', 1],
        ['b4', 2],
        ['e5', 1],
        ['f#5', 1],
        ['g#5', 1],
        ['e5', 2],
        ['g#5', 1],
        ['e5', 1],
        ['f#5', 1],
        ['b4', 2],
        ['b4', 1],
        ['f#5', 1],
        ['g#5', 1],
        ['e5', 2]
      ]
    });
    lcd.cursor(0, 9).print('DONE!');
  }




  downButton.on('press', () => { // remove a second
    adjustTime(-1000);
  });

  upButton.on('press', () => { // add a second
    adjustTime(1000);
  });

  goButton.on('press', () => {
    if (!timer) {
      start();
    } else {
      pause();
    }
  });


  init();




});
