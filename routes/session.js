var api         = require('../api')
var debug       = require('debug')('odin-api:routes:session')
var express     = require('express')

var router = express.Router()

router.post('/execute', api.http(api.session.execute))

debug('Session router exported')
module.exports = router