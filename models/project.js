var debug       = require('debug')('odin-api:models:project');
var mongoose    = require('mongoose');
var JsonAPIResponse = require('../helpers/jsonapiresponse');

debug('Initialising model: Project');

var ObjectId    = mongoose.Schema.Types.ObjectId;

debug('Defining schema: Project');
var Project = new mongoose.Schema({
    name: String,
    description: String,
    owner: {
        ref: 'User',
        type: ObjectId
    },
    created: {
            required: true,
            type: Date,
            default: new Date()
    }
});

Project.methods.attributes = function(cb) {
    return { name: this.name, description: this.description, owner: this.owner, created: this.created};
}

debug('Project model exported');
module.exports = mongoose.model('Project', Project);