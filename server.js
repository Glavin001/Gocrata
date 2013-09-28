console.log('Starting Server');

// Requirements
var mongo = require("mongoskin");
var express = require("express");
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

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(allowCrossDomain);

// var db = mongo.db('localhost:27017/gocrata', serverOptions);
// mongo.connect('mongodb://localhost/gocrata', {db:{safe:false}})

var client = new Db('gocrata', new Server("localhost", 27017, {safe:false}), {});
client.open(function(err, client) {
    console.log('Opened MongoDB Client!');
    client.authenticate('admin', 'admin', function(err, result) {
        // Authenticated
    });
});

// 
app.get('/', function(req, res) {
  res.json({'api':'/api'});
});

// 
app.use('/api', require('./api'));

app.listen(process.env.PORT || 5000);