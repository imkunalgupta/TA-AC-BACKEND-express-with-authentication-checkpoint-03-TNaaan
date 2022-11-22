var express = require('express');
var auth = require('../middlewares/auth');
var router = express.Router();
var passport = require('passport');
var moment = require('moment');

var User = require('../models/User');
var Income = require('../models/Income');
var Expense = require('../models/Expense');

// Dsitinct Function

var incomeData = (req, res, next) => {
  Income.distinct('source', (err, income) => {
    res.locals.income = income;
    next();
  });
};
var expenseData = (req, res, next) => {
  Expense.distinct('category', (err, expense) => {
    res.locals.expense = expense;
    next();
  });
};

/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.redirect('/');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    // no user
    if (!user) {
      res.redirect('/');
    }
    // password verification
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        return res.redirect('/');
      }
      req.session.userId = user.id;
      res.redirect('/dashboard');
    });
  });
});

// Routes for registering the user

router.get('/register', (req, res, next) => {
  res.render('register');
});

// Adding data from form to database

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    // console.log(user, err, 'User Created');
    if (!user.email) {
      return res.redirect('/');
    }
    if (user.password <= 4) {
      return res.redirect('/');
    }
    res.redirect('/');
  });
});

// Logging in with github

router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/dashboard');
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
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/dashboard');
  }
),
  // Dahboard routes

  router.use(auth.userInfo);

router.get(
  '/dashboard',
  auth.loggedInUser,
  incomeData,
  expenseData,
  (req, res, next) => {
    Income.find({}, (err, income) => {
      if (err) return next(err);
      Expense.find({}, (err, expense) => {
        if (err) return next(err);
        // console.log(income, expense);
        var data = res.locals.data;
        res.render('dashboard', { income, expense, data });
      });
    });
  }
);

// -------Logout route--------

router.get('/dashboard/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});

// Adding Income Routes

router.get('/dashboard/income', (req, res, next) => {
  res.render('income');
});

router.post('/dashboard/income', (req, res, next) => {
  // console.log(req.body);
  Income.create(req.body, (err, income) => {
    // console.log(income);
    if (err) return next(err);
    res.redirect('/dashboard');
  });
});

// Adding Expense route

router.get('/dashboard/expense', (req, res, next) => {
  res.render('expense');
});

router.post('/dashboard/expense', (req, res, next) => {
  // console.log(req.body);
  Expense.create(req.body, (err, expense) => {
    if (err) return next(err);
    console.log(expense);
    res.redirect('/dashboard');
  });
});

// Filters Route

router.get('/dashboard/search', (req, res, next) => {
  var query = req.query;
  console.log(res.query.income, 'Locals');
  res.send('hello');
});

module.exports = router;
