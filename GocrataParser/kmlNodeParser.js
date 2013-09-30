////////////////////////////////////////////////////////////
// Parser made by Scott Wesley and Liam Coleman-Aulenbach //
//           Ported to Node.js by Scott Wesley            //
////////////////////////////////////////////////////////////

// Dependencies
var fs = require('fs'),
	cheerio = require('cheerio'),
	urls = ['bus_stops', 'waste_collection', 'trails', 'bylaw_areas', 'building', 'building_symbols', 'bus_routes', 'civic_addresses', 'street_network', 'zoning_boundaries', 'community_boundaries', 'crime', 'park_recreation_features', 'polling_district'],
	url = {
		'bus_stops': 'socrata/Bus Stops.kml',
		'waste_collection': 'socrata/Solid Waste Collection Areas.kml',
		'trails': 'socrata/Trails.kml',
		'bylaw_areas': 'socrata/Bylaw Areas.kml',
		'building': 'socrata/Building.kml',
		'building_symbols': 'socrata/Building Symbols.kml',
		'bus_routes': 'socrata/Bus Routes.kml',
		'civic_addresses': 'socrata/Civic Addresses.kml',
		'street_network': 'socrata/Street Network.kml',
		'zoning_boundaries': 'socrata/Zoning Boundaries.kml',
		'community_boundaries': 'socrata/Community Boundaries.kml',
		'crime': 'socrata/Crime.kml',
		'park_recreation_features': 'socrata/HRM Park Recreation Features.kml',
		'polling_district': 'socrata/Polling District.kml'
	};


var type = "geo";

// Module
/* Usage:   
var kmlNodeParser = require("./GocrataParser/kmlNodeParser");
kmlNodeParser(filePath,function(placemark) { 
  //console.log("New placemark:");
  console.dir(placemark); 
  // Push placemark into collection "geo"
  // geo.insert(placemark); // geo = mongoDB collection db."geo" 
}, function(placemarks) { 
  console.log("===> Done with "+placemarks.length+" placemarks."); 
});
*/ 
module.exports = function() {
  console.log("kmlNodeParser");
  var parseData = function (filePath, placemarkCallback, completionCallback) {
    if (!filePath)
      return console.log("File path undefined."); //
     
    console.log("Parsing KML file: "+filePath);
    // __dirname + '/' + filePath
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        // throw err;
        console.error(err);
      }
      
      var $ = cheerio.load(data);
      var $placemarks = $('Document').find('Placemark');
      var placemarks = [ ];
    
      for (i = 0, lenA = $placemarks.length; i < lenA; i++) {
        var foundID = false;
              var $LookAt = $($placemarks[i]).children('LookAt');
              var $placemark = {
                  loc: {
                      type: "",
    
                      coordinates: []
                  },
                  'latitude': parseFloat($($LookAt.children('latitude')).text()),
                  'longitude': parseFloat($($LookAt.children('longitude')).text()),
                  'meta': {
                      'altitude': parseFloat($($LookAt.children('altitude')).text()),
                      'range': parseFloat($($LookAt.children('range')).text()),
                      'tilt': parseFloat($($LookAt.children('tilt')).text()),
                      'heading': parseFloat($($LookAt.children('heading')).text()),
                      'altitudeMode': $($LookAt.children('altitudeMode')).text()
                  },
                  // 'type': type
              };
      
              metaData = $($placemarks[i]).children('description').toString();
              formattedMetaData = metaData.split('<li><strong><span class="atr-name">');
              formattedMetaData.shift();
              for(j = 0, lenB = formattedMetaData.length; j < lenB; j++) {
                  formattedMetaData[j] = formattedMetaData[j].split('</span>:</strong> <span class="atr-value">');
                  formattedMetaData[j][1] = formattedMetaData[j][1].split('</span></li>')[0];
        
                  if(foundID === false && formattedMetaData[j][0] === "_SocrataID") {
                    $placemark._SocrataID = formattedMetaData[j][1];
                    foundID = true;
                  }
        
                  $placemark.meta[formattedMetaData[j][0]] = formattedMetaData[j][1];
              }
    
              if ($($placemarks[i]).children('MultiGeometry').length === 1) {
                  if ($($placemarks[i]).children('MultiGeometry').children('Polygon').length === 1) {
                      var coordsOut = $($placemarks[i]).children('MultiGeometry').children('Polygon').children('outerBoundaryIs').children('LinearRing').children('coordinates').text();
                      var coordsIn = $($placemarks[i]).children('MultiGeometry').children('Polygon').children('innerBoundaryIs').children('LinearRing').children('coordinates').text();
                      var coordPairsOut = coordsOut.split(' ');
                      var coordPairsIn = coordsIn.split(' ');
                      var finalFormatCoordsOut = [];
                      var finalFormatCoordsIn = [];

                      for (var k = 0, lenC = coordPairsOut.length; k < lenC; k++) {
                          var tempPairHolder = coordPairsOut[k].split(',');
    
                          finalFormatCoordsOut[k] = [];
                          finalFormatCoordsOut[k][0] = parseFloat(tempPairHolder[0]);
                          finalFormatCoordsOut[k][1] = parseFloat(tempPairHolder[1]);
                      }
          
                      for (var k = 0, lenC = coordPairsIn.length; k < lenC; k++) {
                          var tempPairHolder = coordPairsIn[k].split(',');
    
                          finalFormatCoordsIn[k] = [];
                          finalFormatCoordsIn[k][0] = parseFloat(tempPairHolder[0]);
                          finalFormatCoordsIn[k][1] = parseFloat(tempPairHolder[1]);
                      }

                      $placemark.loc.coordinates[0] = finalFormatCoordsOut;
                      $placemark.loc.coordinates[1] = finalFormatCoordsIn;
                      $placemark.loc.type = "Polygon";
                  }
                  else if ($($placemarks[i]).children('MultiGeometry').children('LineString').length === 1) {
                      var coords = $($placemarks[i]).children('MultiGeometry').children('LineString').children('coordinates').text();
                      var coordPairs = coords.split(' ');
    
                      for (var k = 0, lenC = coordPairs.length; k < lenC; k++) {
                          var tempPairHolder = coordPairs[k].split(',');
    
                          $placemark.loc.coordinates[k] = [];
                          $placemark.loc.coordinates[k][0] = parseFloat(tempPairHolder[0]);
                          $placemark.loc.coordinates[k][1] = parseFloat(tempPairHolder[1]);
                      }
                  }
              }
              else if ($($placemarks[i]).children('Point').length === 1) {
                  $placemark.loc.coordinates[0] = parseFloat($($LookAt.children('longitude')).text());
                  $placemark.loc.coordinates[1] = parseFloat($($LookAt.children('latitude')).text());
                  $placemark.loc.type = "Point";
              }
      
              // Iterating thru placemarks, send the current placemark to the placemarkCallback
              //console.dir($placemark);
              placemarks.push($placemark); // Push to save
              placemarkCallback && placemarkCallback($placemark);
              
              //callBack.apply(this, [$placemark]);
          }
      
          // Done! Let the Callee know.
          completionCallback && completionCallback(placemarks);
      
      });
  }

  // Testing
  // parseData(url[urls[4]], "WEEE!");
  
  return parseData;
  
}();