// Views
module.exports = function() {
  var express = require('express');
  var tools = require("./tools");
  var app = express();

  //
  app.get('/', function(req, res) {
    tools.auth(req, res, function(req, res) {
      res.json({
        'geoNear': '/api/util/geoNear',
        'geoWithBB': '/api/util/geoWithBB',
        'gotime': '/api/util/gotime'
      });
    });
  });

  // Utilities
  //   app.use("/geospatial", require('./views/geospatial'));
  app.get('/api/util/geoNear', function(req, res) {
    res.status(501).json({'error':'Not yet implemented.'});
  });
  app.get('/api/util/geoWithBB', function(req, res) {
    res.status(501).json({'error':'Not yet implemented.'});
  });
  app.get('/api/util/gotime', function(req, res) {
    res.status(501).json({'error':'Not yet implemented.'});
  });

  return app;
}();
