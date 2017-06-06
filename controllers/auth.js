var bcrypt        = require('bcryptjs');
var cryptojs      = require('crypto-js');
var debug         = require('debug')('odin-api:controllers:auth');
var errors        = require('../helpers/errors');
var HmacSHA256    = require("crypto-js/hmac-sha256");
var passport      = require('../middleware/passport');
var Token         = require('../models/token');
var User          = require('../models/user');
var validation    = require('../helpers/validation');

// Typedefs for easier usage.
var AuthenticatedError  = errors.auth.AuthenticatedError;
var InvalidCredentialsError  = errors.auth.InvalidCredentialsError;
var NotAuthenticatedError  = errors.auth.NotAuthenticatedError;
var NotImplementedError = errors.general.NotImplementedError;
var NotLoggedInError  = errors.auth.NotLoggedInError;
var TokenNotFoundError = errors.tokens.TokenNotFoundError;
var UnauthorizedError = errors.html._4xx.UnauthorizedError;
var UserNotFoundError = errors.users.UserNotFoundError;

debug('Exporting method: check');
module.exports.check = function(req, res, next){
  if(req.isAuthenticated()){
    debug('Building JSON:API response');
    var response = {
      data: {
        type: 'users',
        id: req.user.id,
      }
    };

    debug('Sending response (status: 200)');
    res.status(200).send(response);
  }
  else {
    next(new NotAuthenticatedError());
  }
};

debug('Exporting method: isAuthenticated');
module.exports.isAuthenticated = function(req, res, next){
  if(req.isAuthenticated()){
    debug('User is authenticated, moving to next');
    return next();
	}

  debug('User is not authenticated, moving to next with new error');
  return next(new NotAuthenticatedError());
};

debug('Exporting method: isNotAuthenticated');
module.exports.isNotAuthenticated = function(req, res, next){
  if(!req.isAuthenticated()){
    debug('User is not authenticated, moving to next');
    return next();
	}

  debug('User is authenticated, moving to next with new error');
  return next(new AuthenticatedError());
};

debug('Exporting method: register');
module.exports.register = function(req, res, next){
  debug('Validating registration data');
  validation.registration(req.body, function(err){
    debug('Checking for errors');
    if(err) return next(err);
  });

  /**
   * @todo: check if email or username is taken.
   */

  debug('Generating password hash');
  var salt = bcrypt.genSaltSync(10);
  var password = bcrypt.hashSync(req.body.password, salt);

  debug('Creating new user object');
  var user = new User({
    auth: {
      username: req.body.username,
      email: req.body.email,
      password: password
    }
  });

  debug('Saving user to database');
  user.save(function(err, user){
    debug('Checking for errors');
    /**
     * @todo: The err instance that we receive needs to be handled better.
     * @priority: MEDIUM
     */
    if(err) return next(err);
    if(!user) return next(new UserNotFoundError());

    debug('Creating token for newly registered user')
    debug('Extracting userid for token');
    var userid = user.id;

    debug('Removing token if it already exists');
    Token.remove({user: userid, type: 'verification'}, function(err){
      //@TODO: Is this sufficient?
      if (err) return next(err);

      debug('Generating token hash');
      var date = new Date();
      var dateString = date.toString();
      var hashedToken = HmacSHA256(userid, dateString);

      debug('Creating new token object');
      var expireDate = new Date(date.getTime() + 60*60*24*1000); // The 60*60*24*1000 means 1 day
      var token = new Token({
        type: 'verification',
        token: hashedToken,
        user: userid,
        timestamps: {
          expire: expireDate
        }
      });

      debug('Saving token to database');
      token.save(function(err, token){
        debug('Checking for errors');
        /**
         * @todo: The err instance that we receive needs to be handled better.
         * @priority: MEDIUM
         */
        if(err) return next(err);
        if(!token) return next(new TokenNotFoundError());

        debug('Building JSON:API response');
        var response = {
          data: {
            type: 'users',
            id: user.id,
            attributes: {
              status: user.status,
              auth: {
                username: user.auth.username,
                email: user.auth.email
              },
              timestamps: user.timestamps
            }
          }
        };

        debug('Sending response (status: 200)');
        res.status(200).send(response);
      });
    });
  });
};

debug('Exporting method: login');
module.exports.login = function(req, res, next){
  //@TODO: Check verification field in User before allowing login
  debug('Validating login data');
  validation.login(req.body, function(err){
    debug('Checking for errors');
    if(err) return next(err);
  });

  debug('Defining post-passport-login method');
  var postLogin = function(err, user, info){
    debug('Checking for errors');
    if (err) return next(err);
    if (!user) return next(new InvalidCredentialsError());

    debug('Calling passport\'s added request login function');
    req.logIn(user, function(err) {
      debug('Checking for errors');
      if (err) return next(err);

      debug('Building JSON:API response');
      var response = {
        data: {
          type: 'users',
          id: user.id,
          attributes: {
            status: user.status,
            auth: {
              username: user.auth.username,
              email: user.auth.email
            },
            timestamps: user.timestamps
          }
        }
      };

      debug('Sending response (status: 200)');
      res.status(200).send(response);
    });
  };

  debug('Passport authentication');
  passport.authenticate('local', postLogin)(req, res, next);
};

debug('Exporting method: logout');
module.exports.logout = function(req, res, next){
  debug('Extracting user');
  var user = req.user;

  debug('Calling passport\'s added request logout function');
  req.logout();

  debug('Building JSON:API response');
  var response = {
    data: {
      type: 'users',
      id: user.id
    }
  };

  debug('Sending response (status: 200)');
  res.status(200).send(response);
};

debug('Exporting method: verify');
module.exports.verify = function(req, res, next){
  var token = req.body.token;

  Token.findOne({token: token, type: "verification"}, function(err, token){
    //@TODO: Is this sufficient?
    if (err) return next(err);
    if (!token) return next(new TokenNotFoundError());

    var userid = token.user;
    User.findOneAndUpdate({_id: userid}, {'status.verified': 'true'}, {new: true}, function(err, user){
      //@TODO: Is this sufficient?
      if (err) return next(err);

      debug('Building JSON:API response');
      var response = {
        data: {
          type: 'users',
          id: user.id,
          attributes: {
            status: user.status,
            auth: {
              username: user.auth.username,
              email: user.auth.email
            },
            timestamps: user.timestamps
          }
        }
      };

      debug('Sending response (status: 200)');
      res.status(200).send(response);
    });
  });
};

debug('Exporting method: forgot');
module.exports.forgot = function(req, res, next){
  debug('Extracting user');
  var email = req.body.email;

  User.findOne({'auth.email': email}, function(err, user){
    if (err) return next(err);
    if (!user) return next(new UserNotFoundError());

    var userid = user.id;

    debug('Removing token if it already exists');
    Token.remove({user: userid, type: 'reset'}, function(err){
      //@TODO: Is this sufficient?
      if (err) return next(err);
      if (!token) return next(new TokenNotFoundError());

      debug('Generating token hash');
      var date = new Date();
      var dateString = date.toString();
      var hashedToken = HmacSHA256(userid, dateString);

      debug('Creating new token object');
      var expireDate = new Date(date.getTime() + 60*60*1000); // The 60*60*1000 means 1 hour
      var token = new Token({
        type: 'reset',
        token: hashedToken,
        user: userid,
        timestamps: {
          expire: expireDate
        }
      });

      debug('Saving token to database');
      token.save(function(err, token){
        debug('Checking for errors');
        /**
         * @todo: The err instance that we receive needs to be handled better.
         * @priority: MEDIUM
         */
        if(err) return next(err);
        if(!token) return next(new TokenNotFoundError());

        debug('Building JSON:API response');
        var response = {
          data: {
            type: 'tokens',
            id: token.id,
            attributes: {
              type: token.type,
              token: token.hashedToken,
              timestamps: {
                expire: token.timestamps.expire
              }
            },
            relationships: {
              user: token.user
            }
          }
        };

        //@TODO: Need to send email with created token

        debug('Sending response (status: 200)');
        res.status(200).send(response);
      });
    });
  });
};

debug('Exporting method: reset');
module.exports.reset = function(req, res, next){
  var token = req.body.token;
  var password = req.body.password;

  debug('Generating password hash');
  var salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);

  Token.findOne({token: token, type: "reset"}, function(err, token){
    //@TODO: Is this sufficient?
    if (err) return next(err);
    if (!token) return next(new TokenNotFoundError());

    var userid = token.user;
    User.findOneAndUpdate({_id: userid}, {'auth.password': password}, {new: true}, function(err, user){
      //@TODO: Is this sufficient?
      if (err) return next(err);

      debug('Building JSON:API response');
      var response = {
        data: {
          type: 'users',
          id: user.id,
          attributes: {
            status: user.status,
            auth: {
              username: user.auth.username,
              email: user.auth.email
            },
            timestamps: user.timestamps
          }
        }
      };

      debug('Sending response (status: 200)');
      res.status(200).send(response);
    });
  });
};
