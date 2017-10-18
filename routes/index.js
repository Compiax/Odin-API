var auth       = require('./auth')
var components = require('./components')
var debug      = require('debug')('odin-api:routes')
var express    = require('express')
var project    = require('./project')
var users      = require('./users')

var router = express.Router()

router.use('/auth', auth)
router.use('/components', components)
router.use('/projects', project)
router.use('/users', users)

debug('Main router exported')
module.exports = router
