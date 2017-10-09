var api       = require('../api')
var debug     = require('debug')('odin-api:routes:projects')
var express   = require('express')

var router = express.Router()

router.delete('/:projectID', api.http(api.projects.destroy))
router.get('/:projectID', api.http(api.projects.read))
router.get('/', api.http(api.projects.browse))
router.patch('/:projectID', api.http(api.projects.update))
router.post('/', api.http(api.projects.create))
router.post('/:UserID', api.http(api.projects.create))

debug('Projects router exported')
module.exports = router
