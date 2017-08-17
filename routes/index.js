var debug     = require('debug')('odin-api:routes');
var express   = require('express');
var auth      = require('./auth');
var component = require('./component');
var project   = require('./project');
var users     = require('./users');
var session   = require('./session');

var router = express.Router();

debug('Adding /auth route');
router.use('/auth', auth);

debug('Adding /component route');
router.use('/component', component);

debug('Adding /project route');
router.use('/project', project);

debug('Adding /user route');
router.use('/users', users);

debug('Adding /session route');
router.use('/session', session);

debug('Main router exported');
module.exports = router;