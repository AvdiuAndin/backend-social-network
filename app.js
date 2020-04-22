require('module-alias/register');
var express = require('express');

// handle unrejected promise error
require("express-async-errors");

var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();

// script that build tables
const databaseWorker = require('@databaseWorker');
databaseWorker.runDatabaseTasks();

// view engine setup
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var usersRouter = require('./api/User/Router/UserRouter');
app.use('/', usersRouter);

// catch 404
app.use(function(req, res, next) {
  return res.status(404).json({
    error: true,
    message: "Endpoint not found"
  });
});

// error handler
app.use(function(err, req, res, next) {
  return res.json({
    error: true,
    message: req.app.get('env') === 'development' ? err : "Something wrong happend! We will try to fix this problem"
  }).status(500);
});

module.exports = app;
