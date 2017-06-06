var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var cors            = require('cors');
var debug           = require('debug')('odin-api:core:app');
var errors          = require('../middleware/errors');
var express         = require('express');
var logger          = require('morgan');
var mongoose        = require('mongoose');
var passport        = require('passport');
var session         = require('express-session');
var routes          = require('../routes');
// Init of Redis
var MongoStore      = require('connect-mongo')(session);

var init = function(config){
  debug('Initialising environment variables');
  var mongoHost = config.servers.db.host;
  var mongoDatabase = config.servers.db.database;
  var sessionSecret = config.session.secret;

  debug('Connecting to mongo database');
  mongoose.connect('mongodb://' + mongoHost + '/' + mongoDatabase);
  var mongoStore = new MongoStore({mongooseConnection: mongoose.connection});

  debug('Creating application');
  app = express();

  debug('Adding body-parser');
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  debug('Adding cookie-parser');
  app.use(cookieParser());

  debug('Adding morgan');
  app.use(logger('dev'));

  debug('Adding cors');
  var corsOptions = config.cors || null;
  app.use(cors(corsOptions));

  debug('Adding session');
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: sessionSecret,
    store: mongoStore
  }));

  debug('Adding passport');
  app.use(passport.initialize());
  app.use(passport.session());

  debug('Adding router');
  app.use('/', routes);

  debug('Adding generic error middleware');
  app.use(errors);

  return app;
};

module.exports.init = init;
