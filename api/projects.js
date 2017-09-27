var auth            = require('../controllers/auth')
var debug           = require('debug')('odin-api:api:auth')
var projects           = require('../controllers/projects')

let create = [
    projects.create,
    projects.buildResponse
]

let browse = [
    projects.browse,
    projects.buildResponse
]

let read = [
    projects.find,
    projects.buildResponse
]

let update = [
    projects.find,
    projects.update,
    projects.buildResponse
]

let destroy = [
    projects.find,
    projects.destroy
]

module.exports = { browse, read, update, destroy, create }
debug("Exported projects API")