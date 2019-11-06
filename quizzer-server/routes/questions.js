const router = require('express').Router()

// Mongoose models
const models = require('../models/index')
// Express middleware
const middleware = require('./middleware')

/**
 * Get random questions (as quizmaster)
 */
router.get('/random', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { room, question } = models
  const count = req.query.count ? parseInt(req.query.count) : 10

  const r = await room.model.findById(req.session.room)

  const cats = r.round.categories

  if (!cats || cats.length === 0) {
    const e = new Error(`Categories not set yet!`)
    e.rescode = 403
    return next(e)
  }

  let questions = await question.model.find()
  // filter out questions with wrong categories
  questions = questions.filter(q => cats.includes(q.category))

  let selectedQuestions = []
  let iterations = 0
  while (selectedQuestions.length < count && iterations <= 1000) {
    const r = Math.floor(Math.random() * questions.length)

    if ((!r.usedQuestions || !r.usedQuestions.includes(questions[r]._id)) && !selectedQuestions.find(q => q._id === questions[r]._id)) {
      selectedQuestions.push(questions[r])
    }
    iterations++
  }

  res.json({
    questions: selectedQuestions
  })
})

module.exports = router