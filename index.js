const express = require('express');
const cookieParser = require('cookie-parser')
const app = express()
const port = 8000
const expressLayouts = require('express-ejs-layouts')
const db = require('./config/mongoose')

// used for session cookie
const session = require('express-session')
const passport = require('passport')
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')

app.use(express.urlencoded())

app.use(cookieParser())

app.use(express.static('./assets'))

// we have written this code above routes because we want to tell the routes that every file now is going to have this library used in them
app.use(expressLayouts)

// extrating the styles and scripts from sub pages into the layouts
// so every page has its own indivisual style as well
app.set('layout extractStyles', true)
app.set('layout extractScripts', true)

// view engine setup
app.set('view engine', 'ejs')
app.set('views', './views')

// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: 'codeial',
    // todo change the secret key used for encryption before deployement on production server
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: 'mongodb://127.0.0.1:27017/codiel_development_db',
        autoRemove: 'disabled',
      },
      function (err) {
        console.log(err)
      }
    ),
  })
)

app.use(passport.initialize());
app.use(passport.session());    

app.use(passport.setAuthenticatedUser);

// use express router
app.use('/', require('./routes'))

app.listen(port, function(err){
    if (err) {
        console.log(`error in running the server ${err}`)
    }

    console.log(`server is running on port: ${port}`)
})

