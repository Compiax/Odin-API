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

let getByUser = [
   projects.find,
   projects.buildResponse
]

module.exports = { browse, read, update, destroy, create, getByUser }
debug("Exported projects API")