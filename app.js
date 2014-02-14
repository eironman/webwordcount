// MODULES
var express = require('express');
var server = require('./models/server');
var router = require('./models/router');
var dispatcher = require('./models/dispatcher');
var path = require('path');

var app = express();

// SETTINGS
// Production
app.set('port', process.env.PORT || 3000);			// Listen to port
app.set('views', path.join(__dirname, 'views'));	// Views directory
app.set('view engine', 'jade');						// Views format

// MIDDLEWARE
//Production
app.use(express.favicon());
app.use(express.logger('dev'));						// Logs requests in console
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public'))); // Helps serving static content
//app.use(express.methodOverride());  // To simulate DELETE and PUT (http://stackoverflow.com/questions/8378338/what-does-connect-js-methodoverride-do)
//app.use(express.json());

// Development
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// SERVER
server.init(app);

// ROUTER
router.route(app, dispatcher);
