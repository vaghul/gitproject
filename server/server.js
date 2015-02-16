var body = require('body-parser')
var express = require('express');
var app = express();
var fs =require('fs'),
routescan = require('express-routescan');

app.use(body.json({limit: '50mb'}));
app.use(body.urlencoded({limit: '50mb', extended: true}));


app.use(body.urlencoded({ extended: false }))
app.use(body.json());

app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "169.254.255.190");

//console.log(__dirname);
  routescan(app, {
      directory: [
          './routes'
      ]
  });

var server = app.listen(3000, function () {

  var host = app.get('ip');
  var port = server.address().port

  console.log('RESTFul Web Service loaded. Server Listening At http://%s:%s', host, port)
  });
