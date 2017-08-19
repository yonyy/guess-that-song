const mongoose = require('mongoose');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const winston = require('winston');
// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
process.env.MONGOLAB_URI ||	// default monglab url  for the addon
process.env.MONGOHQ_URL ||
config.url;

// The http server will listen to an appropriate port, or default to
// port 8000.
//var theport = process.env.PORT || 27017;

mongoose.connect(uristring, function (err, res) {
    if (err) { winston.error('ERROR connecting to: ' + uristring + '. ' + err); }
    else { winston.info('Succeeded connected to: ' + uristring); }
});
