// Common 
module.exports = function(params) {
  var crypto = require("crypto");  
  var conn = params;
  
  //
  var self = { };
  
  // Authentication
  self.auth = function(req, res, successCallback) {
  
  /*
  // Source: http://stackoverflow.com/a/5957629/2578205
    var header=req.headers['authorization']||'',        // get the header
      token=header.split(/\s+/).pop()||'',            // and the encoded auth token
      auth=new Buffer(token, 'base64').toString(),    // convert from base64
      parts=auth.split(/:/),                          // split on colon
      username=parts[0],
      password=parts[1];
  */
  
    var username = req.query.username || "";
    var apiKey = req.query.apiKey || "";
    var hash = crypto.createHash('md5').update(username).digest('base64');
    console.log(username, hash, apiKey);
    if (true || hash === apiKey) {
      return successCallback && successCallback(res, res);
    } else {
      res.status(401).json({'error':'Authentication failed.'});
      return;
    }
  };

  return self;
};