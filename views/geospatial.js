// Geospatial view
module.exports = function(params) {
  var express = require('express');
  var app = express();
  //var db = params;
  //var geo = db.collection('geo'); // MongoDB
  var conn = params;
  var r = require("rethinkdb");
  var db = r.db('gocrata');
  var geo = db.table("geospatial");

  // Root
  app.get("/", function(req, res) {
    /*
    geo.find({}, {limit: 10}).toArray( function(err, rows) {
      console.log(rows);
      res.json(rows);
    });
    */
    geo.run(conn, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
          if (err) throw err;
          // console.log(JSON.stringify(result, null, 2));
          res.json(result);
        });
      });
  });
  
  // Create
  app.post("/", function(req, res) {
    console.log(req.body);
    var doc = req.body || { };
    geo.insert(doc, {}, function(err, row) {
      res.status(201).json({'created':row });
    });
  });
  // Read
  app.get("/id/:id", function(req, res) {
    console.log(req.params);
    geo.find({ "_id": db.bson_serializer.ObjectID.createFromHexString(req.params.id) }, { }).toArray( function(err, row) { 
      res.json(row);
    });
  });
  app.get("/type/:type", function(req, res) {
    console.log(req.params);
    geo.find({ "type": req.params.type }, { }).toArray( function(err, row) { 
      res.json(row);
    });
  });
  // Update
  app.all('/id/:id', function (req, res, next) {
    if (req.method === 'PUT' || req.method === 'POST') {
      // Update
      res.status(501).json({'error':'Not yet implemented.'});    
    } else {
      next();
    }
  });
  // Delete
  app.del('/id/:id', function(req, res) {
    geo.remove({"_id": db.bson_serializer.ObjectID.createFromHexString(req.params.id) },{ },function(err, row) {
      console.log(err);
      res.json(row);
    });   
  });
  
  
  // Documentation
  app.get("/doc", function(req, res) {
    res.json({}
    );
  });

  return app;
};