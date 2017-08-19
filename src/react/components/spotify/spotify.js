const request = require('request');
const spotify = {};

spotify.getAccessToken = function (callback) {
    request.post({
        uri: 'http://localhost:8000/api/spotify/access_token'
    }, (err, res) => {
        if (err) {
            callback(err);
        }

        callback(null, JSON.parse(res.body));
    });
};

module.exports = spotify;
