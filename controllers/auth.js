/**
 * Contains all the controllers that deal with authentication
 */

var config    = require('../config/development');
var debug     = require('debug')('odin-api:controllers:auth');
var ldap      = require('ldapjs');
var passport  = require('../middleware/passport');
var User      = require('../models/user');

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
        if (err) return next(err);
        if (!user) return next("Error - invalid credentials. Either the provided username or password is incorrect.");

        debug("Establishing session")
        req.login(user, function(err) {
            if (err) return next(err);

            debug("Building JSON:API response")
            var response = {
                data: {
                    type: 'users',
                    id: user.uid,
                    attributes: {
                        username: user.uid,
                        email: user.mail
                    }
                }
            }
            debug('Sending response (status: 200)');
            res.status(200).send(response);
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

            debug('Building JSON:API response');
            var response = {
                data: {
                type: 'users',
                id: user.username,
                attributes: {
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt
                }
                }
            };

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
    if (!body.hasOwnProperty("data")) {
        return next("Invalid query - missing 'data' field");
    };
    if (!body.data.hasOwnProperty('type')) {
        return next ("Invalid query - missing 'data.type' field");
    };
    if (body.data.type != 'auth') {
        return next ("Invalid query - type should be 'auth");
    }
    if (!body.data.hasOwnProperty('attributes')) {
        return next ("Invalid query - missing 'data.attributes' field");
    }
    if (!body.data.attributes.hasOwnProperty('username')) {
        return next ("Invalid query - missing 'data.attributes.username' field");
    }
    if (!body.data.attributes.hasOwnProperty('email')) {
        return next ("Invalid query - missing 'data.attributes.email' field");
    }
    if (!body.data.attributes.hasOwnProperty('password')) {
        return next ("Invalid query - missing 'data.attributes.password' field");
    }

    // Set local variables
    res.locals.username = body.data.attributes.username;
    res.locals.email = body.data.attributes.email;
    res.locals.password = body.data.attributes.password;
    next();
}

// Function to validate the login query
module.exports.validateLogin = function(req, res, next) {
    var body = req.body;
    if (!body.hasOwnProperty("data")) {
        return next("Invalid query - missing 'data' field");
    };
    if (!body.data.hasOwnProperty('type')) {
        return next ("Invalid query - missing 'data.type' field");
    };
    if (body.data.type != 'auth') {
        return next ("Invalid query - type should be 'auth");
    }
    if (!body.data.hasOwnProperty('attributes')) {
        return next ("Invalid query - missing 'data.attributes' field");
    }
    if (!body.data.attributes.hasOwnProperty('username')) {
        return next ("Invalid query - missing 'data.attributes.username' field");
    }
    if (!body.data.attributes.hasOwnProperty('password')) {
        return next ("Invalid query - missing 'data.attributes.password' field");
    }

    // Set local variables
    res.locals.username = body.data.attributes.username;
    res.locals.password = body.data.attributes.password;
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