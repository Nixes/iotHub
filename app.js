var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// include mongoose
var mongoose = require('mongoose');
// schema
require('./schema.js');

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var api_sensors = require('./routes/api_sensors');

var app = express();


// connect to mongoose server
mongoose.connect('mongodb://localhost/test');

// check connection was successful
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// serve static js dependencies
app.use('/node_modules',express.static(path.join(__dirname, 'node_modules')));

app.use('/', routes);
app.use('/users', users);
app.use('/api', api);
app.use('/api/sensors', api_sensors);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


// tell the user where the server is running
console.log("Server started, see it over at http://localhost:3000");

module.exports = app;
