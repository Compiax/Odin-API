var debug       = require('debug')('odin-api:models:project');
var mongoose    = require('mongoose');

debug('Initialising model: Project');

debug('Defining schema: Project');
var Project = new mongoose.Schema({
        name: String,
        description: String,
        owner: String, //User ID or something like that
        public: boolean,
        //Where to store the actual source
});

debug('Project model exported');
module.exports = mongoose.model('Project', Project);