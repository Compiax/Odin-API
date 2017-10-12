var api       = require('../api')
var debug     = require('debug')('odin-api:routes:projects')
var express   = require('express')

var router = express.Router()

router.delete('/:projectID', api.http(api.projects.destroy))
router.get('/:projectID', api.http(api.projects.read))
router.get('/', api.http(api.projects.browse))
router.post('/:projectID/export', api.http(api.projects.exportProject))
router.patch('/:projectID', api.http(api.projects.update))
router.patch('/:projectID/save', api.http(api.projects.save))
router.post('/:projectID/execute', api.http(api.projects.execute))
router.post('/', api.http(api.projects.create))

debug('Projects router exported')
module.exports = router
