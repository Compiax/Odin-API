/**
 * Contains all the routes that deal with projects
 */

var project = require('../controllers/project')
var debug     = require('debug')('odin-api:routes:project');
var express   = require('express');

var router = express.Router();

debug("Adding /create route");
router.post('/create', project.create);

debug("Adding /publicList route");
router.post('/publicList', project.publicList);

debug("Adding / privateList route");
router.post('/privateList', project.privateList);

debug('Project router exported');
module.exports = router;