var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const User = require('../models/users');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');
const favoriteRouter = require('./favoriteRouter');

/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res) => { res.statusCode = 200 })
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  User.find({}, (err, users) => {
    if (err) {
      var err = new Error('Not authenticated')
      err.statusCode = 403;
      next(err);
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    }
  });
});

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        if (req.body.firstname)
          user.firstName = req.body.firstname
        if (req.body.lastname)
          user.lastName = req.body.lastname
        user.save()
          .then((user) => {
            if (user.errors) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({ err: user.errors });
            } else {
              passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, status: 'Registration Successful!' });
              });
            }

          })


      }
    });
});

router.post('/login', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => { // user not exist or incorrect pass in info (error has only err if something goes wrong)
    if (err)
      return next(err);
    if (!user) { // username or pass incorrect
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: false, status: "Login Unsuccessful!", err: info });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, status: "Login Unsuccessful!", err: 'Could not log in user' });
      }
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, status: "Login successful!", token: token });
    });

  })(req, res, next);

})

router.get('/checkJWTToken', cors.corsWithOptions, (req,res) => {
  passport.authenticate('jwt', {session: false}, (err,user,info) => {
    if (err){
      return next(err);
    }
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: false, status: "JWT Invalid!", err: info});
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, status: "JWT valid", user: user});
    }

  }) (req,res);
});

router.get('/logout', authenticate.verifyUser, (req, res, next) => {
  if (req.user) {
    res.clearCookie('session-id');
    res.redirect('/');
  }
});

module.exports = router;
