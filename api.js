// API
module.exports = function(params) {
  var express = require('express');
  var app = express();
  var conn = params;
  var r = require("rethinkdb");
  var db = r.db('gocrata');
  var tools = require("./tools")(conn);
  
  // 
  app.all('*', function(req, res, next) {
      console.log('API '+req.method+' Request');
      tools.auth(req, res, function(req, res) {
        next();
      });
  });
  
  //  
  app.use("/views", require('./views')(conn));
  app.use("/util", require('./util')(conn));
  
  // Root
  app.get('/', function(req, res) {
    console.log('Root API request');
    res.json({
      'util': '/api/util',
      'geospatial': '/api/geospatial'
    });
  });
  // Geospatial
  db.tableCreate('geospatial').run(conn, function(err, res2) {
    app.use("/geospatial", require('./views/geospatial')(conn));
  });
  
  // Documentation
  app.get("/doc", function(req, res) {
    res.json(
      
    );
  });
  
  // Supported Sources
  app.get("/sources", function(req, res) {
    var result = [];
    /* // MongoDB
    db.collection("sources").find().toArray( function (err, rows) {
      // Iterate thru each
      for (var i=0, len=rows.length; i<len; i++) {
        var curr = rows[i];
        curr.views = [ ]; // TODO: Group aggregate function to determine available views.
        result.push(curr);
      }        
      res.json(result);
    });
    */
    db.tableCreate('sources').run(conn, function(err, res2) {
      db.table('sources').run(conn, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
          if (err) throw err;
          // console.log(JSON.stringify(result, null, 2));
          res.json(result);
        });
      });
    });

  });

  return app;
};