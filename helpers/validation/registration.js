var debug       = require('debug')('odin-api:helpers:validation:registration');
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

  debug('Validating email')
  if(data.hasOwnProperty('email')){
    var email = data.email;

    debug('- Checking if empty');
    if(validator.isEmpty(email)) return cb(new Error('Email cannot be empty.'));

    debug('- Checking length');
    if(!validator.isLength(username, {min:3, max: 64})) return cb(new Error('Email must have a length between 3 and 64 characters.'));

    debug('- Checking email type');
    if(!validator.isEmail(email)) return cb(new Error('Email format incorrect.'));
  }
  else{
    return cb(new Error('Email is a required field.'));
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
