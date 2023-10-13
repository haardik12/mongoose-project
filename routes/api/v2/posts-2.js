const express = require('express')

const router = express.Router()

const postsApiTwo = require('../../../controllers/api/v2/posts_api-2')

router.get('/', postsApiTwo.index)

module.exports = router
