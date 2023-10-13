const express = require('express')

const router = express.Router()

router.use('/posts', require('./posts-2'))

module.exports = router
