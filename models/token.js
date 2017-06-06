var bcrypt      = require('bcryptjs');
var debug       = require('debug')('odin-api:models:token');
var mongoose    = require('mongoose');

var ObjectId    = mongoose.Schema.Types.ObjectId;
var Schema      = mongoose.Schema;

// Enums
var TYPES = [
  'reset',
  'verification'
];

debug('Defining schema: Token');
var Token = new Schema({
  type: {
    enum: TYPES,
    required: true,
    type: String
  },
  token: {
    required: true,
    type: String
  },
  user: {
    index: true,
    ref: 'User',
    required: true,
    type: ObjectId
  },
  timestamps: {
    expire: {
      default: new Date(),
      required: true,
      type: Date
    }
  }
});

debug('Token model exported');
module.exports = mongoose.model('Token', Token);
