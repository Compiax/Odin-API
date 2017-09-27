var controllers     = require('../controllers')
var debug           = require('debug')('odin-api:api:components')

let create = [
    controllers.components.create,
    controllers.components.buildResponse
]

let read = [
    controllers.components.find,
    controllers.components.buildResponse
]

let update = [
    controllers.components.find,
    controllers.components.update,
    controllers.components.buildResponse
]

let browse = [
    controllers.components.browse,
    controllers.components.buildResponse
]

let destroy = [
    controllers.components.find,
    controllers.components.destroy
]

module.exports = { create, read, update, browse, destroy }
debug("Exported components API")

