var debug       = require('debug')('odin-api:models:user');
var mongoose    = require('mongoose');
var JsonAPIResponse = require('../helpers/jsonapiresponse');

debug('Defining schema: User');
var User = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        minlength: 3,
        maxlength: 100,
        index: true,
        unique: true
    },
    email: {
        required: true,
        type: String,
        minlength: 3,
        maxlength: 100
    },
    password: {
        required: true,
        type: String
    }
});

User.methods.attributes = function(cb) {
    return {username: this.username, email: this.email};
}

debug('User model exported');
module.exports = mongoose.model('User', User);
