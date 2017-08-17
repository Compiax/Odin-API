/**
 * Contains all the controllers that deal with authentication
 */

var config    = require('../config/development');
var debug     = require('debug')('odin-api:controllers:auth');
var User      = require('../models/user');
var passport  = require('passport');
var JsonAPIResponse = require('../helpers/jsonapiresponse');

/**
 * Controllers
 */
debug('Adding controller: login');
module.exports.login = function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next (err);
        if (info) debug (info);
        if (!user) return next ("Authenticatio failed");
        var response = new JsonAPIResponse();
        response.addData('user')
        .id(user.username)
        .attribute({username: user.username})
        .attribute({email: user.email})
        .attribute({password: user.password})
        .attribute({createdAt: user.createdAt});
        req.logIn(user, (err) => {
            if (err) return next (err);
            res.status(200).send(response.toJSON());
        });
    })(req, res, next);
}

debug('Adding controller: register');
module.exports.register = function(req, res, next) {
    debug('Validating registration data');

    debug('Creating new user object for Mongo');
    var user = new User({
        username: res.locals.username,
        email: res.locals.email,
        password: res.locals.password
    });

    debug('Saving user to mongo database');
    user.save(function(err, user) {
        // @todo: Handle this error better
        if(err) return next("Error saving user to MongoDB");

        debug("Building JSON:API response")
        var response = new JsonAPIResponse();            
        response.addData('user')
            .id(user.username)
            .attribute({username: user.username})
            .attribute({email: user.email})
            .attribute({password: user.password})
            .attribute({createdAt: user.createdAt});
            
        debug('Sending response (status: 200)');
        res.status(200).send(response.toJSON());
    });
}

debug('Adding controller: logout');
module.exports.logout = function(req, res, next) {
    var user = req.user;

    debug('Destroying session');
    req.logout();

    debug('Building JSON:API response');
    debug(user);


    var response = {
        data: {
            type: 'user',
            id: user
        }
    };

    debug('Sending response (status: 200)');
    res.status(200).send(response);
}

/**
 * Helpers
 */
// Function to validate the registration query
module.exports.validateRegistration = function(req, res, next) {
    var body = req.body;
    if (!body.hasOwnProperty('username')) {
        return next ("Invalid query - missing 'username' field");
    }
    if (!body.hasOwnProperty('email')) {
        return next ("Invalid query - missing 'email' field");
    }
    if (!body.hasOwnProperty('password')) {
        return next ("Invalid query - missing 'password' field");
    }

    // Set local variables
    res.locals.username = body.username;
    res.locals.email = body.email;
    res.locals.password = body.password;
    next();
}

// Function to validate the login query
module.exports.validateLogin = function(req, res, next) {
    var body = req.body;
    if (!body.hasOwnProperty('username')) {
        return next ("Invalid query - missing 'username' field");
    }
    if (!body.hasOwnProperty('password')) {
        return next ("Invalid query - missing 'password' field");
    }
    // Set local variables
    res.locals.username = body.username;
    res.locals.password = body.password;
    next();
}

// Checks if user is logged in
module.exports.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
	}

  return next("Access Denied - need to be logged in.");
}

// Checks if user is not logged in
module.exports.isNotLoggedIn = function(req, res, next) {
    debug(req.isAuthenticated());
    if(!req.isAuthenticated()){
        return next();
    }

    return next("Error - already logged in!");
};

debug('Auth controllers exported');