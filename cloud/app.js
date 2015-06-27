'use strict';

// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var Multer = require('multer');
var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine

var routes = require('./routes/routes');

app.post('/uploadData', [new Multer({dest:'./uploads'}), routes.readCSVFile]);


// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// app.get('/', passport.authenticate('parse'), function(req, res) {
// 	// now guaranteed to be authenticated WOO
// 	res.render('main', { user_obj: req.user });	
// });

app.get('/', function(req, res) {
	res.send('Hello world');
});

// Attach the Express app to Cloud Code.
var server = app.listen(3000, function () {

  var port = server.address().port;

  console.log('Server listening on port %s', port);

});
