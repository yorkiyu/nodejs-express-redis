var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine("html",ejs.renderFile);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('xiaocc__'));
app.use(session({
	store: new RedisStore({
		host: '127.0.0.1',
		port: 6379,
		pass: 'yu'
	}),
	resave: false,
	saveUninitialized: false,
	secret: 'keyboard cat'
}));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.get('/', routes.index);
app.all('/login',notAuthentication);
app.get('/login',routes.login);
app.post('/login',routes.doLogin);
app.get('/logout',routes.logout);
app.get('/home',routes.home);
app.get('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function authentication (req,res,next){
	if(!req.session.user){
		return res.redirect('/login');		
	}
	next();
}
function notAuthentication(req,res,next){
	if(req.session.user){
		return res.redirect('/');
	}
	next();
}

module.exports = app;
