var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var config          = require('config');
var cors            = require('cors')
var debug           = require('debug')('odin-api:core:app');
var errorhandler    = require('../middleware/errorhandler');
var express         = require('express');
var morgan          = require('morgan');
var mongoose        = require('mongoose');
var passport        = require('passport');
var routes          = require('../routes');
var session         = require('express-session');
var MongoStore      = require('connect-mongo')(session);
var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/user')
var cors            = require('cors')

var init = function() {
    debug('Initialising environment variables');
    var mongoHost = config.servers.db.host;
    var mongoDatabase = config.servers.db.database;

    debug('Connecting to mongo database');
    mongoose.connect(`mongodb://${mongoHost}/${mongoDatabase}`, {
      useMongoClient: true
    });

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
    app.use(bodyParser.json());

    app.use(morgan('dev'))

    debug('Adding cors');
    var corsOptions = config.cors || null;
    app.use(cors(corsOptions));
    
    debug('Adding passport middleware');
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    });

    passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
        if (err) debug(err);

        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.password != password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        debug(user.username + " logged in");
        return done(null, user);
        });
    }
    ));

    debug('Adding routes');
    app.use(routes);

    debug("Adding error handler");
    app.use(errorhandler);

    return app;
};

module.exports.init = init;
