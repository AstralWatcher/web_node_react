var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

const passport = require('passport');
const authenticate = require('./authenticate')
const config = require('./config');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const leaderRouter = require('./routes/leaderRouter');
const promotionRouter = require('./routes/promoRouter');
const dishRouter = require('./routes/dishRouter');
const uploadRouter = require('./routes/uploadRouter');
const favoriteRouter = require('./routes/favoriteRouter');
const commentRouter = require('./routes/commentRouter');

const mongoose = require('mongoose');
// TODO 1 Update depracation https://stackoverflow.com/questions/51960171/node63208-deprecationwarning-collection-ensureindex-is-deprecated-use-creat
// by replacing mongoose update(), remove() with new varients()
// mongoose.set('useNewUrlParser', true); 
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected to db')
}, (error) => {
  console.log('Error to conn db', error);
});

var app = express();
const cors =  require('cors');

app.use((req, res, next) => { //TODO on deployment remove this and modify cors.js
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.all('*', (req, res, next) => {
  if (req.secure) { // comming with https (it will be set when secure port)
    next();
  } else {
    res.redirect(307, 'https://' + req.hostname + ":" + app.get('secPort') + req.url);
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// const corsOpts = {
//   origin: '*',

//   methods: [
//     'GET',
//     'POST',
//   ],

//   allowedHeaders: [
//     'Content-Type',
//   ],
// };


app.use(cors());
app.options('*', cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('123456-765432-345678-987654'));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(express.static(path.join(__dirname, 'public'))); // get html files

app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);
app.use('/comments', commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
