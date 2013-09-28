// Common 
module.exports = function() {
  var crypto = require("crypto");
    
  //
  var self = { };
  
  // Authentication
  self.auth = function(req, res, success) {
    var username = req.query.username || "";
    var apiKey = req.query.apiKey || "";
    var hash = crypto.createHash('md5').update(username).digest('base64');
    console.log(username, hash, apiKey);
    if (hash === apiKey) {
      return success && success(res, res);
    } else {
      res.status(401).json({'error':'Authentication failed.'});
      return;
    }
  };

  return self;
}();