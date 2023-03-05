const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/codiel_development_db')

// create an connection
const db = mongoose.connection

// if error handle it
db.on(
  'error',
  console.error.bind(console, 'error occuring while connecting to MongoDB')
)

// open the db
db.once('open', () => {
  console.log('connected to database :: MongoDB')
})

// exports the connection
module.exports = db
// const mongoose = require('mongoose')

// mongoose.set('strictQuery', false)

// mongoose.connect('mongodb://localhost/codeial_development')

// const db = mongoose.connection

// db.on('error', console.error.bind(console, 'error in connection'))

// db.once('open', function () {
//   console.log('connected to the database')
// })

// module.exports = db
