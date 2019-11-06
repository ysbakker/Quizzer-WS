const router = require('express').Router()

// Attach API routes
router.use('/categories', require('./categories'))
router.use('/session', require('./session'))
router.use('/rooms', require('./rooms-team'))
router.use('/rooms', require('./rooms-quizmaster'))
router.use('/questions', require('./questions'))

module.exports = router