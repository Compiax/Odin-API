/**
 * Contains all the controllers that deal with authentication
 */

var debug                   = require('debug')('odin-api:controllers:auth');
var BadRequestError         = require('../helpers/errors').general.BadRequestError;
var UnauthorizedError       = require('../helpers/errors').general.UnauthorizedError;
var UserAlreadyExistsError  = require('../helpers/errors').users.UserAlreadyExistsError;
var JsonAPIResponse         = require('../helpers/jsonapiresponse');
var passport                = require('passport');
var User                    = require('../models/user');

/**
 * Controllers
 */
debug('Adding controller: login');
module.exports.login = function(req, res, next) {
    debug("Login");
    debug(req.headers);
    passport.authenticate('local', (err, user, info) => {
        if (err) return next (err);
        if (info) debug (info);
        if (!user) return next (new BadRequestError("Username or password is incorrect"));

        debug("Creating response");
        var response = new JsonAPIResponse();
        response.addData('users')
        .id(user._id)
        .attribute(user.attributes())
        .link({self: req.headers.host + "/users/" + user._id});
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
        if(err) {
            if (err.code === 11000) {
                return next(new UserAlreadyExistsError());
            } else {
                return next(err);
            }
        }
        debug("Building JSON:API response")
        var response = new JsonAPIResponse();            
        response.addData('users')
            .id(user._id)
            .attribute(user.attributes())
            .link({self: req.headers.host + "/users/" + user._id});
            
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
    debug(user.attributes());

    debug("Building JSON:API response")
    var response = new JsonAPIResponse();
    response.addData('users').id(user._id).attribute(user.attributes());

    debug('Sending response (status: 200)');
    res.status(200).send(response.toJSON());
}

/**
 * Helpers
 */
// Function to validate the registration query
module.exports.validateRegistration = function(req, res, next) {
    debug (req.body);
    var body = req.body;
    if (!body.hasOwnProperty('username')) {
        return next(new BadRequestError("Missing field 'username'"));
    }
    if (!body.hasOwnProperty('email')) {
        return next(new BadRequestError("Missing field 'email'"));
    }
    if (!body.hasOwnProperty('password')) {
        return next(new BadRequestError("Missing field 'password'"));
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
        return next(new BadRequestError("Missing field 'username'"));
    }
    if (!body.hasOwnProperty('password')) {
        return next(new BadRequestError("Missing field 'password'"));
    }
    // Set local variables
    res.locals.username = body.username;
    res.locals.password = body.password;
    next();
}

// Checks if user is logged in
module.exports.isLoggedIn = function(req, res, next) {
    debug("Checking authentication");
    debug(req.isAuthenticated());
    if(req.isAuthenticated()){
        return next();
    }
    return next(new UnauthorizedError());
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
