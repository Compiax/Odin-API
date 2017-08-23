
var debug       = require('debug')('odin-api:models:component');
var mongoose    = require('mongoose');

debug('Initialising model: Component');

debug('Defining schema: Component');
var Component = new mongoose.Schema({
        name: String,
        description: String,
        created: {
                required: true,
                type: Date,
                default: new Date()
        }
});

debug('Component model exported');
module.exports = mongoose.model('Component', Component);