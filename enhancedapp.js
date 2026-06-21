var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');

// Database connection
require('./app_api/models/db');

// Route imports
var apiRouter = require('./app_api/routes/index');
var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var travelRouter = require('./app_server/routes/travel');

var app = express();


// View Engine Configuration
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(
    path.join(__dirname, 'app_server', 'views', 'partials')
);


// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Application Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter);


// 404 Handler
app.use((req, res, next) => {
    next(createError(404, 'Page not found'));
});



// Error Handler
app.use((err, req, res, next) => {

    console.error(err.stack);

    res.locals.message = err.message;

    res.locals.error =
        req.app.get('env') === 'development'
            ? err
            : {};

    res.status(err.status || 500);

    res.render('error');
});

module.exports = app;
