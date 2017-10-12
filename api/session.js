var debug           = require('debug')('odin-api:api:auth')
var controllers    = require('../controllers')

let execute = [
    controllers.projects.find,
    controllers.session.check,
    controllers.session.generateCode,
    controllers.session.execute
]

module.exports = { execute }
debug("Exported users API")