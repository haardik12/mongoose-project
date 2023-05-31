const User = require('../models/users')

module.exports.profile = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err)
    }
    return res.render('users', {
      title: 'User Profile',
      profile_user: user,
    })
  })
}

module.exports.update = function (req, res) {
  if (req.user.id == req.params.id) {
    User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
      return res.redirect('back')
    })
  } else {
    return res.status(401).send('unauthorized')
  }
}

// profile page loading using manual authentication locally
// module.exports.profile = function (req, res) {
//   if (req.cookies.user_id) {
//     User.findById(req.cookies.user_id, function (err, user) {
//       if (user) {
//         return res.render('users', {
//           title: 'User profile',
//           user: user,
//         })
//       }
//     })
//   } else {
//     return res.redirect('/users/sign-in')
//   }
// }

// render the sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/users/profile')
  }

  return res.render('sign-up', {
    title: 'codeial : Sign Up',
  })
}

// render the sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/users/profile')
  }

  return res.render('sign-in', {
    title: 'codeial : Sign In',
  })
}

// module.exports.signIn = function (req, res) {
//   return res.render('sign-in', {
//     title: 'codeial : Sign In',
//   })
// }

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

// sign in and create a session for the user using manual authentication locally
// module.exports.createSession = function (req, res) {
//   // steps to authenticate

//   // find the user

//   User.findOne({ email: req.body.email }, function (err, user) {
//     if (err) {
//       console.log('error in finding user in signing in')
//       return
//     }
//     // handle user found

//     if (user) {
//       // handle passwords which doesn't match

//       if (user.password != req.body.password) {
//         return res.redirect('back')
//       }
//       // handle session creation

//       res.cookie('user_id', user.id)
//       return res.redirect('/users/profile')
//     } else {
//       // handle user not found
//       res.redirect('back')
//     }
//   })
// }

// sign in and create a session for the user using passport js, passport local library and session cookies
module.exports.createsession = function (req, res) {
  req.flash('success', 'Logged in successfully')
  return res.redirect('/')
}

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err)
    }
    req.flash('success', 'You have been logged out')
    return res.redirect('/')
  })
}