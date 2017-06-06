var auth            = require('./auth.test');
var users           = require('./users.test');

module.exports.test = function(app){
  describe('e2e =>', function() {
    auth.test(app);
    users.test(app);
  });
};
