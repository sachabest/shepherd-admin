'use strict';

// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var Multer = require('multer');
var app = express();
var BodyParser = require('body-parser');
var routes = require('./routes/routes');

var port = process.env.PORT || 8080;

// Global app configuration section
app.set('view engine', 'ejs');    // Set the template engine

// BodyParser Middleware setup
app.use(BodyParser.urlencoded({
  extended: true
}));
app.use(BodyParser.json());

app.use('/static', express.static('public'));

// App routing
app.get('/', function(req, res) {
	res.render('upload.ejs');
});

app.get('/manual', function(req, res) {
	res.render('main.ejs');
});

app.get('/confirmScreen', routes.getConfirmScreen);

app.get('/confirm', function(req, res) {
	res.render('existing_item.ejs', {items: null});
});

app.post('/uploadData', [new Multer({dest:'./uploads'}), routes.readCSVFile]);

app.post('/manualUpload', routes.saveManualEntries);

// Start server
var server = app.listen(port, function () {

  var port2 = server.address().port;

  console.log('Server listening on port %s', port2);

});
