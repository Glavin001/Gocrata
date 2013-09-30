// API
module.exports = function(params) {
  var express = require('express');
  var app = express();
  var db = params;
  var tools = require("./tools")(db);
  
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
      
    );
  });
  
  // Supported Sources
  app.get("/sources", function(req, res) {
    var result = [];
    db.collection("sources").find().toArray( function (err, rows) {
      // Iterate thru each
      for (var i=0, len=rows.length; i<len; i++) {
        var curr = rows[i];
        curr.views = [ ]; // TODO: Group aggregate function to determine available views.
        result.push(curr);
      }        
      res.json(result);
    });
  });

  return app;
};