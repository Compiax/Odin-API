var _           = require('lodash');
var User        = require('../models/user');
var debug       = require('debug')('odin-api:controllers:users');
var errors      = require('../helpers/errors');

// Typedefs for easier usage.
var NotImplementedError = errors.general.NotImplementedError;
var UsersNotFoundError = errors.users.UsersNotFoundError;

debug('Exporting method: browse');
module.exports.browse = function(req, res, next){
  debug('Trying to find users');
  User.find(function(err, users){
    debug('Checking for errors');
    if(err) return next(err);
    if(!users) return next(new UsersNotFoundError());

    debug('Building JSON:API response');
    var data = [];

    /**
     * @todo: Relationships field not populated correctly yet.
     */
    _.forEach(users, function(user){
      var _data = {
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
      };

      data.push(_data);
    });

    var response = {
      data: data
    };

    debug('Sending response (status: 200)');
    res.status(200).send(response);
  });
};

debug('Exporting method: create');
module.exports.create = function(req, res, next){
  next(new NotImplementedError());
};

debug('Exporting method: read');
module.exports.read = function(req, res, next){
  next(new NotImplementedError());
};

debug('Exporting method: update');
module.exports.update = function(req, res, next){
  next(new NotImplementedError());
};

debug('Exporting method: delete');
module.exports.delete = function(req, res, next){
  next(new NotImplementedError());
};

debug('Exporting method: ideas');
module.exports.ideas = function(req, res, next){
  next(new NotImplementedError());
};

debug('Exporting method: submissions');
module.exports.submissions = function(req, res, next){
  next(new NotImplementedError());
};

debug('Exporting method: history');
module.exports.history = function(req, res, next){
  next(new NotImplementedError());
};

debug('Exporting method: transactions');
module.exports.transactions = function(req, res, next){
  next(new NotImplementedError());
};

debug('Exporting method: wallet');
module.exports.wallet = function(req, res, next){
  next(new NotImplementedError());
};

debug('Exporting method: profile');
module.exports.profile = function(req, res, next){
  next(new NotImplementedError());
};

debug('Exporting method: votes');
module.exports.votes = function(req, res, next){
  next(new NotImplementedError());
};
