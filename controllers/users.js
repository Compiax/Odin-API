var debug     = require('debug')('odin-api:controllers:users');
var JsonAPIResponse = require('../helpers/jsonapiresponse');
var User      = require('../models/user');
var UserNotFoundError = require('../helpers/errors').users.UserNotFoundError;

module.exports.browse = function(req, res, next) {
    var response = new JsonAPIResponse();
    debug("Fetching users");
    User.find(function(err, users) {
        if (err) return next (err);
        users.forEach(function(user) {
            debug("Building response");
            response.addData('users')
              .id(user._id)
              .attribute(user.attributes())
              .link({self: req.headers.host + "/users/" + user._id});
        })
        res.send(response.toJSON());
    });
}

module.exports.read = function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) return next (err);
        if (user == null) return next(new UserNotFoundError());
        var response = new JsonAPIResponse();
        response.addData('users')
            .id(user._id)
            .attribute(user.attributes())
            .link({self: req.headers.host + "/users/" + user._id})
        res.send(response.toJSON());
    });
} 

module.exports.delete = function(req, res, next) {
    User.findByIdAndRemove(req.params.id, function(err, user) {
        if (err) return next (err);
        if (user == null) return next(new UserNotFoundError());
        var response = new JsonAPIResponse();
        response.addData('users')
            .id(user._id)
            .attribute(user.attributes())
            .link({self: req.headers.host + "/users/" + user._id})
        res.send(response.toJSON());
    });
} 

module.exports.update = function(req, res, next) {
    debug(req.body);
    User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
        if (err) return next (err);
        if (user == null) return next(new UserNotFoundError());
        debug("Found user");
        debug(user);
        User.findById(req.params.id, (err, user) => {
            debug(req.params.id);
            debug("Updated")
            debug(user);
            var response = new JsonAPIResponse();
            response.addData('users')
                .id(user.username)
                .attribute(user.attributes())
                .link({self: req.headers.host + "/users/" + user._id});
            res.send(response.toJSON());
        })
    })
} 

debug('User controllers exported');
