var express = require('express');
var router = express.Router();
var User = require('../models/User');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]
    );
  },
});

const upload = multer({ storage: storage });

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get(`/dashboard`, (req, res, next) => {
  res.render(`dashboard`);
});

router.get('/signup', (req, res, next) => {
  var exist = req.flash(`exist`);
  var min = req.flash(`min`);
  res.render('signup', { exist, min });
});

router.post('/signup', upload.single('profilePic'), (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(err);
    if (user) {
      req.flash(`exist`, `Email is already registered`);
      return res.redirect(`/users/signup`);
    }
    console.log(req.body);
    if (req.body.password.length < 5) {
      req.flash(`min`, `Password is less than 5 character`);
      return res.redirect(`/users/signup`);
    }
    User.create(
      { ...req.body, profilePic: '/images/' + req.file.filename },
      (err, user) => {
        console.log(user);
        if (err) return next(err);
        return res.redirect(`/users/login`);
      }
    );
  });
});

router.get('/login', (req, res, next) => {
  var ep = req.flash(`ep`);
  var email = req.flash(`email`);
  var password = req.flash(`password`);
  res.render('login', { ep, email, password });
});

router.post('/login', function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('ep', 'Email/Password required!');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    console.log(user);
    if (err) return next(err);
    if (!user) {
      req.flash('email', 'This email is not registered');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('password', 'Incorrect password! Try Again!');
        return res.redirect('/users/login');
      }
      //password match
      req.session.userId = user.id;
      return res.redirect('/users/dashboard');
    });
  });
});
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie();
  res.redirect('/users/login');
});

module.exports = router;
