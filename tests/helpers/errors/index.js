var auth      = require('./auth.test');
var custom    = require('./custom.test');
var general   = require('./general.test');
var html      = require('./html');
var tokens    = require('./tokens.test');
var users     = require('./users.test');

module.exports.test = function(){
  describe('errors =>', function() {
    auth.test();
    custom.test();
    general.test();
    html.test();
    tokens.test();
    users.test();
  });
};
