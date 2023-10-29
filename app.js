var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
const connect = require('./db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categorieRouter = require('./routes/categorieRouter');
// var categorieBlogRouter = require('./routes/categorieBlogRouter');
var produitAdminRouter = require('./routes/produitAdminRouter');
var blogsRouter = require('./routes/blogsRouter');
var categorieFormationRouter = require('./routes/categorieFormationRouter');
var formationsRouter = require('./routes/formationsRouter');
var fournisseursRouter = require('./routes/fournisseursRouter');

const cors = require('cors');

var app = express();
app.use(cors());

app.use(passport.initialize()); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categorieRouter);
// app.use('/categoriesblog', categorieBlogRouter);
app.use('/produitsAdmin', produitAdminRouter);
app.use('/blogs', blogsRouter);
app.use('/categoriesFormation', categorieFormationRouter);
app.use('/formations', formationsRouter);
app.use('/fournisseurs', fournisseursRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
