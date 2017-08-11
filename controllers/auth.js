/**
 * Contains all the controllers that deal with auth
 */

var config    = require('../config/development');
var debug     = require('debug')('odin-api:controllers:auth');
var ldap      = require('ldapjs');

// Connect to LDAP
debug("Connecting to LDAP server");
var client = ldap.createClient({
  url: 'ldap://' + config.ldap.host + ':' + config.ldap.port
});

debug("Logging in to LDAP server");
client.bind(config.ldap.root, config.ldap.password, function(err) {
  if (err) debug (err);
});

debug('Adding controller: login');
module.exports.login = function(req, res, next) {
    next("Not Implemented");
}

debug('Adding controller: register');
module.exports.register = function(req, res, next) {
    next("Not Implemented");
}

debug('Adding controller: logout');
module.exports.logout = function(req, res, next) {
    next("Not Implemented");
}

debug('Auth controllers exported');