const router = require('express').Router()

// Mongoose models
const models = require('../models/index')
// Express middleware
const middleware = require('./middleware')

router.get('/', middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { session } = req
  const { room } = models

  const r = await room.model.findById(session.room)
    .populate('teams')
    .populate({
      path: 'round.question.questiondata',
      model: 'Question'
    })
  if (r === undefined) {
    const e = new Error('Room not found!')
    e.rescode = 404
    return next(e)
  }

  const data = JSON.parse(JSON.stringify(r));
  data.role = 'quizmaster'

  if (session.role === 'team') {
    data.role = 'team'
    // Some data should not be visible to the team
    data.password = undefined
    data.team
    if (data.round && data.round.question.questiondata) {
      data.round.question.questiondata.answer = undefined
      data.round.question.answers = data.round.question.answers.filter(a => a.team.toString() === session.teamid.toString())
    }
  }

  res.json(data)
})

module.exports = router