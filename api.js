// API
module.exports = function(params) {
  var express = require('express');
  var tools = require("./tools")();
  var app = express();
  var db = params;
  
  // 
  app.all('*', function(req, res, next) {
      console.log('API '+req.method+' Request');
      tools.auth(req, res, function(req, res) {
        next();
      });
  });
  
  //  
  app.use("/views", require('./views')(db));
  app.use("/util", require('./util')(db));
  
  // Root
  app.get('/', function(req, res) {
    console.log('Root API request');
    res.json({
      'util': '/api/util',
      'geospatial': '/api/geospatial'
    });
  });
  // Geospatial
  app.use("/geospatial", require('./views/geospatial')(db));

  // Documentation
  app.get("/doc", function(req, res) {
    res.json(
      {}
    );
  });

  return app;
};