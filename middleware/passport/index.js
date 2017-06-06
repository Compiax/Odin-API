var debug         = require('debug')('odin-api:middleware:passport');
var passport      = require('passport');
var strategies    = require('./strategies');
var User          = require('../../models/user');

debug('Adding passport strategy: local');
passport.use(strategies.local);

debug('Defining serialization method');
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

debug('Defining de-serialization method');
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

debug('Custom passport middlware exported');
module.exports = passport;
