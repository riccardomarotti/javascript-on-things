var five = require('johnny-five');
var request = require('request');

const API_KEY = '';
const LAT     = '44.620970';
const LONG    = '10.721651';
const API_URL = 'https://api.darksky.net/forecast';

var board = new five.Board();
board.on('ready', () => {
    var rgb = new five.Led.RGB([3, 5, 6]);

    var requestURL = `${API_URL}/${API_KEY}/${LAT},${LONG}`;
    request(requestURL, function (error, response, body) {
        if (error) {
            console.error(error);
        }
        if (!error && response.statusCode == 200) {
            var forecast = JSON.parse(body);
            var daily = forecast.daily.data;
            var willBeDamp = daily[1].precipProbability > 0.2;
            var tempDelta = daily[1].temperatureMax - daily[0].temperatureMax;
            if (tempDelta > 4) {
                rgb.color('#ff0000'); // warmer
            } else if (tempDelta < -4) {
                rgb.color('#ffffff'); // colder
            } else {
                rgb.color('#00ff00'); // about the same
            }
            if (willBeDamp) {
                rgb.strobe(1000);
            }
        }
    });
});
