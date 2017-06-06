var bcrypt      = require('bcryptjs');
var debug       = require('debug')('odin-api:models:user');
var mongoose    = require('mongoose');

// Typedefs for easier usage.
var ObjectId    = mongoose.Schema.Types.ObjectId;
var Schema      = mongoose.Schema;

debug('Defining schema: User');
var User = new Schema({
  status: {
    enabled: {
      default: true,
      required: true,
      type: Boolean
    },
    verified: {
      default: false,
      required: true,
      type: Boolean
    }
  },
  auth: {
    username: {
      required: true,
      index: true,
      type: String,
      unique: true
    },
    email: {
      required: true,
      index: true,
      type: String,
      unique: true
    },
    password: {
      required: true,
      type: String
    }
  },
  timestamps: {
    created: {
      default: new Date(),
      required: true,
      type: Date
    },
    updated: {
      default: new Date(),
      required: true,
      type: Date
    }
  }
});

debug('Adding custom schema method: verifyPassword');
User.methods.verifyPassword = function(password, cb){
  debug('Checking if passwords match');
  var isMatch = bcrypt.compareSync(password, this.auth.password);

  debug('Calling callback with isMatch');
  return cb(isMatch);
};

debug('User model exported');
module.exports = mongoose.model('User', User);
