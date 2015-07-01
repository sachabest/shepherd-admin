'use strict';

// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var Multer = require('multer');
var app = express();
var BodyParser = require('body-parser');
var routes = require('./routes/routes');

// Global app configuration section
app.set('view engine', 'ejs');    // Set the template engine

// BodyParser Middleware setup
app.use(BodyParser.urlencoded({
  extended: true
}));
app.use(BodyParser.json());


// App routing
app.get('/', function(req, res) {
	res.render('upload.ejs');
});

app.get('/manual', function(req, res) {
	res.render('main.ejs')
});

app.get('/confirm', function(req, res) {
	res.render('confirm.ejs', {items : {'Complaint': [], 'Diagnosis': [], 'Prescription': [], 'Test': [], 'Treatment': []}})
});

app.post('/uploadData', [new Multer({dest:'./uploads'}), routes.readCSVFile]);

// Start server
var server = app.listen(3000, function () {

  var port = server.address().port;

  console.log('Server listening on port %s', port);

});
