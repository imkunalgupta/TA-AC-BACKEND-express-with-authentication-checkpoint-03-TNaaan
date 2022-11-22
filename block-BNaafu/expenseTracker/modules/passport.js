var passport = require('passport');
var User = require('../models/User');

var GitHubStrategy = require('passport-github2').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    },
    (accessToken, refreshToken, profile, done) => {
      var profileData = {
        name: profile.displayName,
        username: profile.username,
        email: profile.emails[0].value,
        photo: profile._json.avatar_url,
      };
      User.findOne({ email: profile.emails[0].value }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            console.log(addedUser, err);
            if (err) return done(err);
            return done(null, addedUser);
          });
        } else {
          return done(null, user);
        }
      });
    }
  )
);

// Google Log In

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile.emails[0].value);
      var profileData = {
        name: profile.displayName,
        username: profile._json.name,
        email: profile._json.email,
        profilePic: profile._json.picture,
      };
      User.findOne({ email: profile.emails[0].value }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            console.log(addedUser, err);
            if (err) return done(err);
            return done(null, addedUser);
          });
        } else {
          return done(null, user);
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, 'name email username', function (err, user) {
    done(err, user);
  });
});
