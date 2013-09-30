// Views
module.exports = function(params) {
  // Dependencies
  var fs = require('fs');
  var url = require('url');
  var http = require('http');
  var exec = require('child_process').exec;
  var express = require('express');
  var app = express();
  var db = params;
  var geo = db.collection('geo');
  var request = require("request");
  var downloadDirectory = "./cache";
  var kmlNodeParser = require("./GocrataParser/kmlNodeParser");
  
  //
  app.get('/', function(req, res) {
    res.json({
      'geoNear': '/api/util/geoNear',
      'geoWithBB': '/api/util/geoWithBB',
      'gotime': '/api/util/gotime'
    });
  });

  // Utilities
  app.get('/geoNear', function(req, res) {
    res.status(501).json({'error':'Not yet implemented.'});
  });
  app.get('/geoWithBBox', function(req, res) {
    console.log(req.headers);
    console.log(req.query);
    res.status(501).json({'error':'Not yet implemented.'});
  });
  app.get('/gotime', function(req, res) {
    res.status(501).json({'error':'Not yet implemented.'});
  });
  
  
  // Update Sources
  app.get('/update/sources', function(req, res) { 
    // For adding sources  
    console.log('Loading sources');
    var result = [];
    db.collection("sources").find().toArray( function (err, rows) {
      console.log("Sources loaded");
      // Iterate thru each
      for (var i=0, len=rows.length; i<len; i++) {
        var curr = rows[i];
        console.log("Loading '"+curr.name+"': "+curr.path);
        // Get all views from source API
        request(curr.path+"/api/views", function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log('Obtained list of views');
            var jbody = JSON.parse(body);
            for (var j=0, jlen=jbody.length; j<jlen; j++) {
              // var view = jbody[j];
              
              (function(view) {
                return function() {
                  console.log("=====");
                  console.log("View '"+view.name+"', "+(j+1)+' of '+jlen+' for '+curr.path);
                  console.log(view.id, view.name, view.viewType);
                  switch (view.viewType) {
                    case "geo": {
                      console.log("Supported Geospatial data.");
                  
                      /*
                      // TEMPORARY: For testing, do not download all of the large KML files.
                      if (view.blobFileSize > 70000) {
                        console.log("View '"+view.name+"' is too large.");
                        break;
                      } else {
                        console.log("View '"+view.name+"' is within size limits.");
                      }
                      */
                  
                      var geoDataUrl = curr.path+view['metadata']['geo']['owsUrl']+"?method=export&format=kml";
                      // extract the file name
                      var fileName = url.parse(geoDataUrl).pathname.split('/').pop();
                      var filePath = downloadDirectory+"/"+fileName+".kml";
                      
                      (function (v, p,u) {
                        var view = v, filePath = p, geoDataUrl = u;
                        //console.log("(v,p,u)=",v,p,u);
                        return wgetDownloadFile(filePath, geoDataUrl, function() { 
                          console.log("Done downloading '"+view.name+"' geo data"); 

                          console.log("==> Using KML Node Parser on "+filePath);
                          kmlNodeParser(filePath,function(placemark) { 
                            //console.log("New placemark:");
                            // Tags
                            placemark.tags = view.tags;
                            // Source
                            placemark.source = curr;
                            // console.dir(placemark); 
                            
                            // Push placemark into collection "geo"
                            geo.insert(placemark);
                            
                          }, function(placemarks) { 
                            console.log("===> Done with '"+view.name+"', "+placemarks.length+" placemarks."); 
                          });
                        });
                      })(view, filePath, geoDataUrl);
                      
                      break;
                    } 
                    default: {
                      console.log("Unsupported view type.");
                    }
                  }
                
                }              
              })(jbody[j])();
              
            }
            //console.log(body);
          } else {
            console.log(error);
          }
        });
        result.push(curr);
      }        
      res.json(result);
    });  
  });
  
  // Function to download file using wget
  // Source: http://www.hacksparrow.com/using-node-js-to-download-files.html
  var wgetDownloadFile = function(_filePath, _fileUrl, _callback) {
    
    (function (filePath, fileUrl, callback) {
      return function() {
        console.log("Downloading file '"+fileUrl+"' to '"+filePath+"'");
        // compose the wget command
        var wget = 'wget -O "'+filePath+'" "'+fileUrl+'"';
        console.log(wget);
      
        // TEMPORARY: Disable actually downloading
        // return callback && callback();
      
        // excute wget using child_process' exec function
        var child = exec(wget, function(err, stdout, stderr) {
            if (err) { 
              // throw err;
              return console.error(err);
            } else {
              //console.log("'"+fileUrl+"' downloaded to '"+filePath+"'.");
              return callback && callback();
            }
        });
      
      }();
    })(_filePath,_fileUrl,_callback);
          
  };
  
  /*
  //  kmlNodeParser Test
  console.log("Testing KML Node Parser");
  kmlNodeParser("/Users/glavin/Documents/Project\ Dev/Gocrata/cache/Bus\ Stops.kml",function(placemark) { 
    console.log("New placemark:");
    console.dir(placemark); 
  }, function(placemarks) { 
    console.log("Done with "+placemarks.length+" placemarks."); 
  });
  */
  
  return app;
};
