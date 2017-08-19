var express = require('express');
var graphqlHTTP = require('express-graphql');
var { graphiqlExpress } = require('graphql-server-express');
// Compiles our scss and serves them as css
var sassMiddleware = require('node-sass-middleware');
var db = require('./db/db');
var app = express();
var winston = require('winston');
var spotify = require('./routes/spotify');

void db;

app.use('/dist', express.static(__dirname + '/dist'));
//compile and serve scss files as css
app.use(sassMiddleware({
    /* Options */
    src: __dirname + '/styles',
    dest: __dirname + '/styles/dist',
    debug: true,
    prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));
app.use('/css', express.static(__dirname + '/styles/dist'));

var GuessThatSongGraphQLSchema = require('./graphql/schema');
app.use('/graphql', graphqlHTTP({
    schema: GuessThatSongGraphQLSchema
}));

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
}));

app.use('/api/spotify', spotify);

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/src/index.html');
});

app.set('port', process.env.PORT || 8000);
var server = app.listen(app.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;
    winston.info('Server listening on http://%s:%s', host, port);
});

module.exports = app;
