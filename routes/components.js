var api      = require('../api')
var debug     = require('debug')('odin-api:routes:components')
var express   = require('express')

var router = express.Router()

router.delete('/:componentID', api.http(api.components.destroy))
router.get('/:componentID', api.http(api.components.read))
router.get('/', api.http(api.components.browse))
router.patch('/:componentID', api.http(api.components.update))
router.post('/', api.http(api.components.create))
router.get('/:userID', api.http(api.components.getByUser))
router.get('/:searchString', api.http(api.components.search))

debug('Components router exported')
module.exports = router
