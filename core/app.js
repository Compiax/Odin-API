var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var config          = require('../config/development');
var debug           = require('debug')('odin-api:core:app');
var express         = require('express');
var morgan          = require('morgan');
var mongoose        = require('mongoose');
var routes          = require('../routes');


var init = function() {
    debug('Initialising environment variables');
    var mongoHost = config.mongo.host;
    var mongoDatabase = config.mongo.database;

    debug('Connecting to mongo database');
    mongoose.connect('mongodb://' + mongoHost + '/' + mongoDatabase);
    mongoose.Promise = global.Promise;

    debug('Creating application');
    app = express();

    debug('Adding body-parser');
        app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(morgan('dev'))

    debug('Adding routes');
    app.use(routes);

    return app;
};

module.exports.init = init;