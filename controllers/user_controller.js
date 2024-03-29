const User = require('../models/users')
const Fs = require('fs')
const path = require('path')

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

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id)
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log('multer error', err)
        }
        user.name = req.body.name
        user.email = req.body.email

        if (req.file) {
          // to check if the user already has an avatar or not
          const oldPhoto = Fs.existsSync(
            path.join(__dirname, '..', user.avatar)
          )
          console.log(oldPhoto)
          if (user.avatar) {
            Fs.unlinkSync(path.join(__dirname, '..', user.avatar))
          }

          // this is saving the path of th uploaded file into the avatar field in thr user
          user.avatar = User.avatarPath + '/' + req.file.filename
        }

        user.save()
        return res.redirect('back')
      })
    } catch (error) {
      req.flash('error', error)
      return res.redirect('back')
    }
  } else {
    req.flash('error', 'unauthorized')
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