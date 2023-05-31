const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy

const User = require('../models/users')

// authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    function (email, password, done) {
      // Find a user and establish the identity
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          console.log('error in finding the user --> passport')
          return done(err)
        }

        // in the statement below the two arguments that are passed null and false are to represent two things
        // first null represents that there is no error
        // false represents that the authentication has not been done like the username/password didnt match
        if (!user || user.password != password) {
          console.log('password dont match')
          return done(null, false)
        }

        return done(null, user)
      })
    }
  )
)

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

// deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log('error in finding the user --> passport')
      return done(err)
    }

    return done(null, user)
  })
})

passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in
  if (req.isAuthenticated()) {
    return next()
  }

  // if the user is not signed in
  return res.redirect('/users/sign-in')
}

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user
  }

  next()
}

module.exports = passport