const User = require('../models/users')

module.exports.profile = function (req, res) {
  if (req.cookies.user_id) {
    User.findById(req.cookies.user_id, function (err, user) {
      if (user) {
        return res.render('users', {
          title: 'User profile',
          user: user,
        })
      }
    })
  } else {
    return res.redirect('/users/sign-in')
  }
}

// render the sign up page
module.exports.signUp = function (req, res) {
  return res.render('sign-up', {
    title: 'codeial : Sign Up',
  })
}

// render the sign in page
module.exports.signIn = function (req, res) {
  return res.render('sign-in', {
    title: 'codeial : Sign In',
  })
}

// get the users data and store it in db
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect('back')
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log('error in finding user in signing up')
      return
    }

    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log('error in signing up user')
          return
        }

        return res.redirect('/users/sign-in')
      })
    } else {
      return res.redirect('back')
    }
  })
}

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  // steps to authenticate

  // find the user

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log('error in finding user in signing in')
      return
    }
    // handle user found

    if (user) {
      // handle passwords which doesn't match

      if (user.password != req.body.password) {
        return res.redirect('back')
      }
      // handle session creation

      res.cookie('user_id', user.id)
      return res.redirect('/users/profile')
    } else {
      // handle user not found
      res.redirect('back')
    }
  })
}

module.exports.signOut = function (req, res) {
  res.clearCookie('user_id')
  return res.redirect('/users/sign-in')
}
