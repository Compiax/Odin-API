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
        users.forEach(function(user) {
            response.addData('user')
              .id(user.username)
              .attribute({username: user.username})
              .attribute({email: user.email});
        })
        res.send(response.toJSON());
    });
}

// Returns a specific users information
debug("Adding controller: read");
module.exports.read = function(req, res, next) {
    User.findOne({username: req.params.username}, function(err, user) {
        if (err) return next (err);
        if (user == null) return next("User does not exist!");
        var response = new JsonAPIResponse();
        response.addData('user')
            .id(user.username)
            .attribute({username: user.username})
            .attribute({email: user.email});
        res.send(response.toJSON());
    });
} 

debug('User controllers exported');