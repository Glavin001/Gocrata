// Views
module.exports = function() {
  var express = require('express');
  var app = express();
  
  app.use("/geospatial", require('./views/geospatial'));

  return app;
}();