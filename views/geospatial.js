// Geospatial view
module.exports = function(params) {
  var express = require('express');
  var app = express();
  var db = params;
  var geo = db.collection('geo');
  
  // Root
  app.get("/", function(req, res) {
    geo.find({}, {limit: 10}).toArray( function(err, rows) {
      console.log(rows);
      res.json(rows);
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
  app.get("/:id", function(req, res) {
  console.log(req.params);
    geo.find({ "_id": db.bson_serializer.ObjectID.createFromHexString(req.params.id) }, {limit: 1 }).toArray( function(err, row) { 
      res.json(row);
    });
  });
  // Update
  app.all('/:id', function (req, res, next) {
    if (req.method === 'PUT' || req.method === 'POST') {
      // Update
      res.status(501).json({'error':'Not yet implemented.'});    
    } else {
      next();
    }
  });
  // Delete
  app.del('/:id', function(req, res) {
    geo.remove({"_id": db.bson_serializer.ObjectID.createFromHexString(req.params.id) },{ },function(err, row) {
      console.log(err);
      res.json(row);
    });   
  });

  return app;
};