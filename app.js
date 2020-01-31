var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./api/User/Route/UserRoute');
var bookshelf = require('./config/database/Bookshelf');

var app = express();


// script that build tables
schemaBuilder = require('./config/database/migrate/schemaBuilder');
schemaBuilder.createTables();


// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  return res.json({
    error: true,
    message: "Endpoint not found"
  }).status(404);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
