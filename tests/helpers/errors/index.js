var auth      = require('./auth.test');
var campaigns = require('./campaigns.test');
var categories = require('./categories.test');
var custom    = require('./custom.test');
var general   = require('./general.test');
var ideas     = require('./ideas.test');
var html      = require('./html');
var tokens    = require('./tokens.test');
var users     = require('./users.test');

module.exports.test = function(){
  describe('errors =>', function() {
    auth.test();
    campaigns.test();
    categories.test();
    custom.test();
    general.test();
    html.test();
    ideas.test();
    tokens.test();
    users.test();
  });
};
