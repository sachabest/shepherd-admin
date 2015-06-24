
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var Multer = require('multer');
var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

var routes = require('clouds/routes');

app.post('/uploadData', [new Multer({dest:'./uploads'}), routes.readCSVFile]);

// Passport.js configuration
// passport = require('passport-parse');
// var parse_passport = new ParseStrategy({
// 	appId,
// 	clientKey
// });
// passport.use(parse_passport);

// passport.authenticate('parse', function(err, user, info) {
// 	if (err) {
// 		return res.status(400).json({payload : {error: info}, message : info.message});
//     }
// 	if (!user) { 
// 		return res.status(400).json({payload : {error: info}, message : info.message});
// 	}
// 	req.logIn(user, function(err) {
// 		if (err) {
// 			return res.status(400).json({payload : {error: err}, message : info.message});
// 		}
// 		return res.json({
// 			payload : req.user,
// 			message : "Authentication successfull"
// 		});
// 	});
// })(req,res);

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

// Attach the Express app to Cloud Code.
app.listen();
