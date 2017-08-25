/**
 * Contains all the routes that deal with projects
 */

var projects = require('../controllers/project')
var debug     = require('debug')('odin-api:routes:project')
var express   = require('express')
var auth      = require('../controllers/auth')

var router = express.Router()

debug("Adding POST /")
router.post('/', auth.isLoggedIn, projects.create)

debug("Adding GET /")
router.get('/', auth.isLoggedIn, projects.browse)

debug("Adding GET /:id")
router.get('/:id', auth.isLoggedIn, projects.read)

debug("Adding DELETE /:id");
router.delete('/:id', auth.isLoggedIn, projects.delete)

debug("Adding PATCH /:id")
router.patch('/:id', auth.isLoggedIn, projects.update)

debug('Projects router exported')
module.exports = router;