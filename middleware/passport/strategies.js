var debug           = require('debug')('odin-api:middleware:passport:strategies')
var LocalStrategy   = require('passport-local').Strategy
var passport        = require('passport')
var User            = require('../../models/user')

debug('Exporting passport strategy: LocalStrategy')
module.exports.local = new LocalStrategy(
  function(username, password, done){
    debug('Authenticating using local strategy')

    debug('Finding user')
    User.findOne({'auth.username': username}, function(err, user){
      debug('Checking for errors')
      if (err) return done(err)
      if (!user) return done(null, false)

      debug('Verifying password')
      user.verifyPassword(password, function(isMatch){
        if(!isMatch){
          debug('Password not verified, continuing with errors')
          return done(null, false)
        }

        debug('Password verified, continuing')
        return done(null, user) // => Passes user to postLogin function in auth.login
      })
    })
  }
)
