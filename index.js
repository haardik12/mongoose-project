const express = require('express');
const cookieParser = require('cookie-parser')
const app = express()
const port = 8000
const expressLayouts = require('express-ejs-layouts')
const db = require('./config/mongoose')

app.use(express.urlencoded())

app.use(cookieParser())

app.use(express.static('./assets'))

// we have written this code above routes because we want to tell the routes that every file now is going to have this library used in them
app.use(expressLayouts)

// extrating the styles and scripts from sub pages into the layouts
// so every page has its own indivisual style as well
app.set('layout extractStyles', true)
app.set('layout extractScripts', true)

// use express router
app.use('/', require('./routes'))

// view engine setup
app.set('view engine', 'ejs')
app.set('views', './views')


app.listen(port, function(err){
    if (err) {
        console.log(`error in running the server ${err}`)
    }

    console.log(`server is running on port: ${port}`)
})