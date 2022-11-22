var express = require('express');
var router = express.Router();
var passport = require(`passport`);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Logging in with github

router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/users/login',
  }),
  (req, res) => {
    res.redirect('/users/dashboard');
  }
);

// Logging in with google

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/users/login',
  }),
  (req, res) => {
    res.redirect('/users/dashboard');
  }
),
  (module.exports = router);
