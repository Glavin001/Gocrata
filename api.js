// API
module.exports = function() {
  var express = require('express');
  var app = express();
  
  app.use("/views", require('./views'));
  app.use("/util", require('./util'));

  app.get('/', function(req, res) {
    res.json({
      'util': '/api/util'
      });
  });


  return app;
}();