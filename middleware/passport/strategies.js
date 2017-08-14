var debug           = require('debug')('odin-api:middleware:passport:strategies');
var passport        = require('passport');
var LdapStrategy    = require('passport-ldapauth');
var User            = require('../../models/user');
var config          = require('../../config/development')

debug('Exporting passport strategy: LDAPStrategy');
var OPTS = {
  server: {
    url: 'ldap://' + config.ldap.host + ':' + config.ldap.port,
    bindDN: config.ldap.root,
    bindCredentials: config.ldap.password,
    searchBase: 'ou=users,dc=AlbertPrime,dc=co,dc=za',
    searchFilter: '(uid={{username}})'
  },
  "usernameField": "username",
  "passwordField": "password"
};

debug("Exported LDAP Passport strategy");
module.exports.ldap = new LdapStrategy(OPTS);
