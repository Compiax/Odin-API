var api       = require('../api')
var debug     = require('debug')('odin-api:routes:auth')
var express   = require('express')

var router = express.Router()

router.delete('/:username', api.http(api.users.destroy))
router.get('/:username', api.http(api.users.read))
router.get('/', api.http(api.users.browse))
router.patch('/:username', api.http(api.users.update))

debug('Users router exported')
module.exports = router
