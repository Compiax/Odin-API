
var debug       = require('debug')('odin-api:models:component');
var mongoose    = require('mongoose');

debug('Initialising model: Component');

var ObjectId    = mongoose.Schema.Types.ObjectId;

debug('Defining schema: Component');
var Component = new mongoose.Schema({
        name: {
                type: String,
                required: true
        },
        description: {
                type: String,
                required: true,
                default: ""
        },
        stats: {
                downloaded: {
                        type: Number,
                        required: true,
                        default: 0
                },
                stars: {
                        type: Number,
                        required: true,
                        default: 0
                }
        },
        usage: {
                type: String,
                default: "",
                required: true
        },
        created: {
                required: true,
                type: Date,
                default: new Date()
        },
        author: {
                type: ObjectId,
                ref: 'User',
                required: true
        }
});

Component.methods.attributes = function(cb) {
        return {
                name: this.name,
                description: this.description,
                stats: this.stats,
                usage: this.usage,
                created: this.created,
                author: this.author
        };
}

debug('Component model exported');
module.exports = mongoose.model('Component', Component);