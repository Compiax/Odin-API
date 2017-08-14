var debug         = require('debug')('odin-api:middleware:passport');
var passport      = require('passport');
var strategies    = require('./strategies');
var User          = require('../../models/user');

debug('Adding passport strategy: ldap');
passport.use(strategies.ldap);

debug('Defining serialization method');
passport.serializeUser(function(user, done) {
  done(null, user.uid);
});

debug('Defining de-serialization method');
passport.deserializeUser(function(user, done) {
    done(null, user);
});

debug('Custom passport middlware exported');
module.exports = passport;
