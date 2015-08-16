'use strict';
var express = require('express'),
    fs = require('fs'),
    path = require('path'),

    favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    helmet = require('helmet'),
    app = express(),
    busboy = require('connect-busboy'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    environment = require('./config/environment'),
    multer = require('multer');

app.environment = environment;

app.use(favicon(environment.root + '/public/img/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(busboy());

app.use(compress());
app.use(cookieParser());
// app.use(session({
//     key: 'session_cookie_name',
//     secret: 'session_cookie_secret',
//     store: new MongoStore(environment.db),
//     resave: true, //reserve backward compatibility
//     saveUninitialized: true, //reserve backward compatibility
// }));

// Use helmet to secure Express headers
app.use(helmet.xframe());
app.use(helmet.xssFilter());
app.use(helmet.nosniff());
app.use(helmet.ienoopen());
app.disable('x-powered-by');

app.use('/upload/defects', express.static(__dirname + '/upload/defects'));
app.use(multer({dest: './upload/defects/'}));

app.use(express.static(environment.root + '/public'));

// app.use(passport.initialize());
// app.use(passport.session());

app.use(methodOverride());

require('./models')(app);
require('./services')(app);

//require('./config/passport')(app);

//require('./middlewares/request-logger')(app);

require('./config/routes')(app);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});




app.stop = function() {
    if (app.server) {
        app.server.close();
    }
};

app.start = function(callback) {
    app.port = environment.port;
    app.server = app.listen(environment.port, function() {
        app.emit('app:ready');
        if ('function' === typeof(callback)) {
            callback.call(app);
        }
    });

};

global.app = app;
module.exports = app;