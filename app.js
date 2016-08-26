var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var flash = require('req-flash');
var session = require('express-session');
var logger = require('express-logger');
var fs = require('fs');
//var partials = require('express-partials');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(session({
    secret: "flash-requires-session",
    name: "message",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(logger({path: './logger.log'}));
//app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);

app.listen(5000);
console.log('something happening');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
//development or production

console.log("environment: " + app.get('env'));

if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		var user;
		if(req.session) {
			user = true;
		}
		else {
			user = false;
		}
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err,
			user: user,
			year: (new Date().getYear() + 1900).toString()
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	var user;
	if(req.session) {
		user = true;
	}
	else {
		user = false;
	}
	
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {},
		user: user,
		year: (new Date().getYear() + 1900).toString()
	});
});


module.exports = app;
