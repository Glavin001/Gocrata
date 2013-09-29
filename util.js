// Views
module.exports = function(params) {
  var express = require('express');
  var app = express();
  var db = params;
  var geo = db.collection('geo');

  //
  app.get('/', function(req, res) {
    res.json({
      'geoNear': '/api/util/geoNear',
      'geoWithBB': '/api/util/geoWithBB',
      'gotime': '/api/util/gotime'
    });
  });

  // Utilities
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
};
