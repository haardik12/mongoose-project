const express = require('express')
const passport = require('passport')
const router = express.Router()

const userController = require('../controllers/user_controller')

router.get('/profile/:id', passport.checkAuthentication, userController.profile)
router.post('/update/:id', passport.checkAuthentication, userController.update)

router.get('/sign-up', userController.signUp)
router.get('/sign-in', userController.signIn)
router.post('new-session', userController.signUp)

router.post('/create', userController.create)
// the below create session is used for local authentication without the passport library
// router.post('/create-session', userController.createSession)

// the below create session is used for passport authentication, it uses passport as a middlieware to authenticate
router.post(
  '/create-session',
  passport.authenticate('local', { failureRedirect: '/users/sign-in' }),
  userController.createsession
)

router.get('/sign-out', userController.destroySession)

module.exports = router
