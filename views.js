// Views
module.exports = function(params) {
  var express = require('express');
  var app = express();
  var db = params;

  // app.use("/geospatial", require('./views/geospatial')(db));

  return app;
};