var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var s3 = new AWS.S3();
var bucketName = 'elasticbeanstalk-us-west-1-116601934919';
var keyName = 'input/sup.txt';
var bodyText = "woah";
var params = {
  ACL: "authenticated-read",
  Body: bodyText,
  Bucket: bucketName,
  Key: keyName
};


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response) {
  s3.putObject(params, function(err, data) {
    if (err) { 
      console.log(err);
    }
    else {
      console.log("SUCCESS");
    }
  });

  response.sendFile('public/index.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
