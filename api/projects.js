var auth            = require('../controllers/auth')
var debug           = require('debug')('odin-api:api:auth')
var controllers     = require('../controllers')

let create = [
    controllers.projects.create,
    controllers.projects.buildResponse
]

let browse = [
    controllers.projects.browse,
    controllers.projects.buildResponse
]

let read = [
    controllers.projects.find,
    controllers.projects.buildResponse
]

let update = [
    controllers.projects.find,
    controllers.projects.update,
    controllers.projects.buildResponse
]

let destroy = [
    controllers.projects.find,
    controllers.projects.destroy
]

<<<<<<< HEAD
let save = [
    controllers.projects.find,
    controllers.projects.check,
    controllers.projects.save,
    controllers.projects.buildResponse
]

let execute = [
    controllers.projects.find,
    controllers.projects.check,
    controllers.projects.build,
    controllers.projects.getVariables,
    controllers.projects.getOperations,
    controllers.projects.execute
]

let exportProject = [
    controllers.projects.find,
    controllers.projects.check,
    controllers.projects.build,
    controllers.projects.getVariables,
    controllers.projects.getOperations,
    controllers.projects.generateComponent,
    controllers.projects.buildResponse
]

module.exports = { browse, read, update, destroy, create, exportProject, save, execute }
=======
let getByUser = [
   projects.find,
   projects.buildResponse
]

module.exports = { browse, read, update, destroy, create, getByUser }
>>>>>>> 433e0584fe6219cc9c58920330b88fd141d8cba9
debug("Exported projects API")