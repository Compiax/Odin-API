/**
 * Contains all the controllers that deal with users
 */

var debug     = require('debug')('odin-api:controllers:users');
var User      = require('../models/user');
var JsonAPIResponse = require('../helpers/jsonapiresponse');

// Returns all users
debug("Adding controller: browse");
module.exports.browse = function(req, res, next) {
    var response = new JsonAPIResponse();
    User.find({}, function(err, users) {
        if (err) return next (err);
        debug(err);
        users.forEach(function(user) {
            response.addData('user')
              .id(user._id)
              .attribute({username: user.username})
              .attribute({email: user.email})
              .attribute({password: user.password});
        })
        res.send(response.toJSON());
    });
}

// Returns a specific users information
debug("Adding controller: read");
module.exports.read = function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) return next (err);
        if (user == null) return next("User does not exist!");
        var response = new JsonAPIResponse();
        response.addData('user')
            .id(user._id)
            .attribute({password: user.password})
            .attribute({username: user.username})
            .attribute({email: user.email});
        res.send(response.toJSON());
    });
} 

// Updates a user
debug("Adding controller: update");
module.exports.update = function(req, res, next) {
    User.findById(res.locals.id, function(err, user) {
        if (err) return next (err);
        if (user == null) return next("User does not exist!");

        if (res.locals.username != null && res.locals.username != undefined) {
            user.username = res.locals.username;
        }
        if (res.locals.password != null && res.locals.password != undefined) {
            user.password = res.locals.password;
        }
        if (res.locals.email != null && res.locals.email != undefined) {
            user.email = res.locals.email;
        }
        // debug(res.locals)
        user.save((err, user) => {
            if (err) return next (err);
        });

        var response = new JsonAPIResponse();
        response.addData('user')
            .id(user.username)
            .attribute({username: user.username})
            .attribute({email: user.email});
        res.send(response.toJSON());
    });
} 

// Function to validate update request
module.exports.validateUpdate = function(req, res, next) {
    var body = req.body;
    // Set local variables
    res.locals.username = body.username;
    res.locals.password = body.password;
    res.locals.email = body.email;
    res.locals.id = req.params.id;
    next();
}

debug('User controllers exported');