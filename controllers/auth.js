/**
 * Contains all the controllers that deal with authentication
 */

var config    = require('../config/development');
var debug     = require('debug')('odin-api:controllers:auth');
var ldap      = require('ldapjs');
var passport  = require('../middleware/passport');
var User      = require('../models/user');
var JsonAPIResponse = require('../helpers/jsonapiresponse');

// Connect to LDAP
debug("Connecting to LDAP server");
var client = ldap.createClient({
  url: 'ldap://' + config.ldap.host + ':' + config.ldap.port
});

// Log in to LDAP
debug("Logging in to LDAP server");
client.bind(config.ldap.root, config.ldap.password, function(err) {
  if (err) debug (err);
});

/**
 * Controllers
 */
debug('Adding controller: login');
module.exports.login = function(req, res, next) {
    var loggedIn = function(err, user, info) {
        debug(req.body.username);
        debug(req.body.password);
        if (info) debug (info);
        if (err) return next(err);
        if (!user) return next("Error - invalid credentials. Either the provided username or password is incorrect.");

        debug("Establishing session")
        req.login(user, function(err) {
            if (err) return next(err);

            debug("Building JSON:API response")
            var response = new JsonAPIResponse();            
            response.addData('user')
                .id(user.uid)
                .attribute({username: user.uid})
                .attribute({email: user.mail});
            res.status(200).send(response.toJSON());
        });
    }

    req.body.username = res.locals.username;
    req.body.password = res.locals.password;
    debug("Authenticating with Passport")
    passport.authenticate('ldapauth', loggedIn)(req, res, next);
}

debug('Adding controller: register');
module.exports.register = function(req, res, next) {
    debug('Validating registration data');

    debug("Creating new user entry for LDAP");
    var entry = {
        sn: res.locals.username,
        cn: res.locals.username,
        uid: res.locals.username,
        mail: res.locals.email,
        objectClass: 'inetOrgPerson',
        userPassword: res.locals.password
    }

    debug(entry);

    debug('Creating new user object for Mongo');
    var user = new User({
        username: res.locals.username,
        email: res.locals.email
    });

    debug("Generating distinguished name for LDAP add function");
    var dn = "cn=" + entry.cn + ",dc=AlbertPrime,dc=co, dc=za";

    debug("Adding user to LDAP")
    client.add(dn, entry, function(err) {
        debug('Checking for errors');
        // @todo: Handle this error better
        if (err) return next("Error saving user to to LDAP");

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
                .attribute({createdAt: user.createdAt});
            res.status(200).send(response.toJSON());

            debug('Sending response (status: 200)');
            res.status(200).send(response);
        });
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
    debug(res.locals.username);
    debug(res.locals.password);
    next();
}

// Checks if user is logged in
module.exports.isLoggedIn = function(req, res, next) {
    debug(req.isAuthenticated());
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