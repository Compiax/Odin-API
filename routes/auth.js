var api      = require('../api')
var debug     = require('debug')('odin-api:routes:auth')
var express   = require('express')

var router = express.Router()

router.post('/check',       api.auth.check)
router.post('/login',       api.auth.login)
router.post('/logout',      api.auth.logout)
router.post('/register',    api.http(api.auth.register))

debug('Auth router exported')
module.exports = router
