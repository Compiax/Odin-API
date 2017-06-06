var debug       = require('debug')('odin-api:helpers:validation:login');
var validator   = require('validator');

debug('Exporting method');
module.exports = function(data, cb){
  debug('Validating username')
  if(data.hasOwnProperty('username')){
    var username = data.username;

    debug('- Checking if empty');
    if(validator.isEmpty(username)) return cb(new Error('Username cannot be empty.'));

    debug('- Checking length');
    if(!validator.isLength(username, {min:3, max: 32})) return cb(new Error('Username must have a length between 3 and 32 characters.'));

    debug('- Checking alphanumeric');
    if(!validator.isAlphanumeric(username)) return cb(new Error('Username must be alphanumeric.'));
  }
  else{
    return cb(new Error('Username is a required field.'));
  }

  debug('Validating password')
  if(data.hasOwnProperty('password')){
    var password = data.password;

    debug('- Checking if empty');
    if(validator.isEmpty(password)) return cb(new Error('Password cannot be empty.'));

    debug('- Checking length');
    if(!validator.isLength(password, {min:6, max: 64})) return cb(new Error('Password must have a length between 6 and 64 characters.'));
  }
  else{
    return cb(new Error('Password is a required field.'));
  }

  return cb(null);
};
