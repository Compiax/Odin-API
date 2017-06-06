var html          = require('./html');
var CustomError   = require('./custom');
var debug         = require('debug')('odin-api:helpers:errors:users');

// Typedef for easier usage.
var NotFoundError = html._4xx.NotFoundError;

debug('Defining users error class: UserNotFoundError');
var UserNotFoundError = function(){
  NotFoundError.call(this, 'User not found.');
  return this;
};

debug('Defining users error class: UsersNotFoundError');
var UsersNotFoundError = function(){
  NotFoundError.call(this, 'Users not found.');
  return this;
};


debug('Binding UserNotFoundError to parent class: NotFoundError');
UserNotFoundError.prototype = Object.create(NotFoundError.prototype);

debug('Binding UsersNotFoundError to parent class: NotFoundError');
UsersNotFoundError.prototype = Object.create(NotFoundError.prototype);


debug('Exporting users error class: UserNotFoundError');
module.exports.UserNotFoundError = UserNotFoundError;

debug('Exporting users error class: UsersNotFoundError');
module.exports.UsersNotFoundError = UsersNotFoundError;
