console.log('Starting Server');

// Requirements
var mongo = require("mongoskin");
var express = require("express");
var https = require('https');
var http = require('http');
var crypto = require("crypto");
var tools = require("./tools");
// Setup
var Db = mongo.Db;
var connection = mongo.Connection;
var Server = mongo.Server;
var app = express();
var serverOptions = {
  'author_reconnect': true,
  'poolSize': 5
};
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

// Configure
app.configure(function() {
  /*
  app.use(function(req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      req.rawBody = data;
      next();
    });
  });
  */
  // app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(allowCrossDomain);
});

// Connect to MongoDB
console.log('Connecting to MongoDB');
var client = new Db('gocrata', new Server("localhost", 27017, {}), {safe:false});
client.open(function(err, client) {
    console.log('Connected to MongoDB!');
    /*
    // Secure all requests    
    app.all('*', function(req, res, next) {
      if(req.secure !== true) {
        console.log('Unsecure request');
        res.redirect('https://'+req.host+req.originalUrl);
      } else {
        next();
      };
    });
    */
    // Root
    app.get('/', function(req, res) {
      console.log('Root request');
      res.json({'api':'/api'});
    });
    // Root of API
    app.use('/api', require('./api')(client));
    // Start listening
    console.log('Starting Gocrata REST API');    
    //http.createServer(app).listen(80);
    //https.createServer({}, app).listen(443);
    app.listen(process.env.PORT || 5000);
    
    /*
    client.authenticate('admin', 'admin', function(err, result) {
        // Authenticated
    });
    */
});

