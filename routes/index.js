var debug     = require('debug')('odin-api:routes');
var express   = require('express');
var auth      = require('./auth');
var component = require('./component');
var project   = require('./project');
var user      = require('./user');

var router = express.Router();

debug('Adding /auth route');
router.use('/auth', auth);

debug('Adding /component route');
router.use('/component', component);

debug('Adding /project route');
router.use('/project', project);

debug('Adding /user route');
router.use('/user', user);

debug('Main router exported');
module.exports = router;