var debug           = require('debug')('odin-api:models:project')
var mongoose        = require('mongoose')

debug('Initialising model: Project')

var ObjectId    = mongoose.Schema.Types.ObjectId

debug('Defining schema: Project')
var Project = new mongoose.Schema({
    name: String,
    description: String,
    data: String,
    owner: {
        ref: 'User',
        type: ObjectId
    },
    created: {
        required: true,
        type: Date,
        default: new Date()
    },
    variables: {
        type: []
    },
    code: {
        type: [String]
    }
})

Project.methods.attributes = function(cb) {
    return { name: this.name, description: this.description, owner: { id: (this.owner) ? this.owner.id : null, username: (this.owner) ? this.owner.username : null }, created: this.created, data: this.data, variables: this.variables, code: this.code}
}

debug('Project model exported')
module.exports = mongoose.model('Project', Project)