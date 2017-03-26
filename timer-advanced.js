Rx = require("rx");

var five = require('johnny-five');
var board = new five.Board();

const DEFAULT_TIMER = 10;

function playChime (alertChime, lcd) {
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

function getStringTime(x) {
    var minutes, seconds, minPad, secPad;
    minutes = Math.floor(x / 60);
    seconds = Math.floor(x % 60);
    minPad = (minutes < 10) ? '0' : '';
    secPad = (seconds < 10) ? '0' : '';
    return `${minPad}${minutes}:${secPad}${seconds}`;
}




const ready$ = Rx.Observable.fromEvent(board, 'ready');
ready$.subscribe(() => {
    var downButton = new five.Button(3);
    var upButton = new five.Button(4);
    var goButton = new five.Button(2);
    var lcd = new five.LCD([7, 8, 9, 10, 11, 12]);
    var alertChime = new five.Piezo(6);

    const tick$ = Rx.Observable.interval(1000);
    const startPause$ = Rx.Observable.fromEvent(goButton, 'press');
    const up$ = Rx.Observable.fromEvent(upButton, 'press');
    const down$ = Rx.Observable.fromEvent(downButton, 'press');

    const decrement = (acc) => ({count: acc.count - 1, counting: acc.counting});
    const increment = (acc) => ({count: acc.count + 1, counting: acc.counting});
    const doNothing = (acc) => ({count: acc.count, counting: acc.counting})
    const switchCounting = (acc) => ({count: acc.count, counting: !acc.counting})
    const updateCounterIfCounting = (acc) => {
        if(acc.counting) {
            return decrement(acc);
        } else {
            return doNothing(acc);
        }
    };

    timer$ = Rx.Observable.merge(
        tick$.map(() => updateCounterIfCounting),
        startPause$.map(() => switchCounting),
        up$.map(() => increment),
        down$.map(() => decrement)
    )
    .startWith({count: DEFAULT_TIMER, counting: false})
    .scan((acc, curr) => curr(acc));

    timer_end$ = timer$.filter((x) => x.count <= 0);
    timer$.takeUntil(timer_end$).subscribe(
        (x) => lcd.cursor(0, 0).print(getStringTime(x.count)),
        (err) => lcd.cursor(0, 0).print(err),
        () => playChime(alertChime, lcd)
    );
});

