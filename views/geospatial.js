// Geospatial view
module.exports = function() {
  var express = require('express');
  var app = express();
  
  app.get("/:id", function(req, res) {
    
    res.json({'test': 'test'});
    
  });

  return app;
}();