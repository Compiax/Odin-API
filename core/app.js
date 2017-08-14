var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var config          = require('../config/development');
var debug           = require('debug')('odin-api:core:app');
var express         = require('express');
var morgan          = require('morgan');
var mongoose        = require('mongoose');
var passport        = require('passport');
var routes          = require('../routes');
var session         = require('express-session');
var MongoStore      = require('connect-mongo')(session);


var init = function() {
    debug('Initialising environment variables');
    var mongoHost = config.mongo.host;
    var mongoDatabase = config.mongo.database;

    debug('Connecting to mongo database');
    mongoose.connect('mongodb://' + mongoHost + '/' + mongoDatabase);
    var mongoStore = new MongoStore({mongooseConnection: mongoose.connection});
    mongoose.Promise = global.Promise;

    debug('Creating application');
    app = express();

    debug('Adding session');
    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: "deadjosh",
        store: mongoStore
    }));


    debug('Adding body-parser');
        app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(morgan('dev'))

    debug('Adding passport middleware');
    app.use(passport.initialize());
    app.use(passport.session());

    debug('Adding routes');
    app.use(routes);

    return app;
};

module.exports.init = init;