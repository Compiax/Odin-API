var controllers     = require('../controllers')
var debug           = require('debug')('odin-api:api:auth')

let register = [
    controllers.users.create,
    controllers.users.buildResponse
]

let login = controllers.auth.login

let logout = controllers.auth.logout

let check = controllers.auth.authenticate

module.exports = { register, login, logout, check }
debug("Exported auth API")

