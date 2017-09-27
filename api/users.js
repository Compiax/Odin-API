var auth            = require('../controllers/auth')
var debug           = require('debug')('odin-api:api:auth')
var controllers     = require('../controllers')

let browse = [
    controllers.users.browse,
    controllers.users.buildResponse
]

let read = [
    controllers.users.find.byUsername,
    controllers.users.buildResponse
]

let update = [
    controllers.users.find.byUsername,
    controllers.users.update,
    controllers.users.buildResponse
]

let destroy = [
    controllers.users.find.byUsername,
    controllers.users.destroy
]

module.exports = { browse, read, update, destroy }
debug("Exported users API")