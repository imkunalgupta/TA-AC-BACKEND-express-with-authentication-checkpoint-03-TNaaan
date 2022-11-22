var User = require(`../models/User`);

module.exports = {
  loggedInUser: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else if (req.session && req.session.passport) {
      next();
    } else {
      console.log(`auth`);
      return res.redirect(`/users/login`);
    }
  },
  userInfo: (req, res, next) => {
    var userId = req.session && req.session.userId;
    var userPassport = req.session && req.session.passport;
    if (userId) {
      User.findById(userId, 'email username name profilePic', (err, user) => {
        if (err) return next(err);
        if (!req.session.passport) {
          req.user = user;
        }
        res.locals.user = user;
        next();
      });
    } else if (userPassport) {
      User.findById(userPassport.user, (err, user) => {
        if (err) return next(err);
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
};
