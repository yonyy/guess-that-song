var express = require('express');
var request = require('request');
var env = process.env.NODE_ENV || 'development';
var { client_id, client_secret } = require('../config/config')[env];
var router = express.Router();

router.post('/access_token', function(req, res) {
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            grant_type: 'client_credentials'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            res.json(body);
        } else {
            res.error(error);
        }
    });
});

router.post('/refresh_token', function(req, res) {
    // requesting access token from refresh token
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: req.body.refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            res.json(body);
        } else {
            res.error(error);
        }
    });
});


module.exports = router;
