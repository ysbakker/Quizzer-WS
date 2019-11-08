const router = require('express').Router()
const fetch = require('node-fetch')

// Mongoose models
const models = require('../models/index')
// Express middleware
const middleware = require('./middleware')
// Import WebSocket server so messages can be sent
const wss = require('../socket')

/**
 * This function is used to determine the points
 * a team gets for the round
 */
const determinePoints = score => {
  const compare = (x, y) => {
    if (x.correct > y.correct) return -1
    if (x.correct < y.correct) return 1

    return 0
  }

  const sorted = score.sort(compare)

  const points = sorted.map(s => ({ team: s.team, points: 0.1 }))
  if (points.length >= 1) points[0].points = 4;
  if (points.length >= 2) points[1].points = sorted[1].correct === sorted[0].correct ? 4 : 2;
  if (points.length >= 3) points[2].points = sorted[2].correct === sorted[0].correct ? 4
    : (sorted[2].correct === sorted[1].correct ? 2 : 1);

  return points
}


/**
 * From this point, all API routes require the client to be quizmaster.
 */
router.use(middleware.checkIfUserIsQuizmaster)

/**
 * This route is used for automatically deleting the room when there
 * are no more clients left in the room
 */
router.delete('/:roomid', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {

})

/**
 * This route lets the quizmaster close the room
 */
router.patch('/:roomid', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { room, team } = models
  const { roomid } = req.params
  const { open } = req.body

  if (open === undefined) {
    const e = new Error('Invalid PATCH operation!')
    e.rescode = 403
    return next(e)
  }

  const r = await room.model.findOne({ number: roomid })

  if (open !== false || r.currentQuestion < 12) {
    const e = new Error('You can\'t close the round as a round is still in progress!')
    e.rescode = 403
    return next(e)
  }

  const points = determinePoints(r.round.score)
  if (points) {
    const t = await team.model.find({ room: r._id })
    points.forEach(p => {
      t.find(t => t._id.toString() === p.team.toString()).points += p.points
    })
    for (const team of t) {
      await team.save()
    }
  }

  r.open = false

  try {
    await r.save()
  } catch (err) {
    const e = new Error(`Validation failed - ${err.message}`)
    e.rescode = 400
    return next(e)
  }

  res.json({
    success: `Closed quiz succesfully`
  })

  /**
   * Send a message to the teams that the quiz closed
   */
  wss.clients.forEach(client => {
    if (client.role === 'team' && client.room.toString() === r._id.toString()) {
      client.send(JSON.stringify({
        mType: 'quiz_closed'
      }))
    }
  })
})

/**
 * This route allows the quizmaster to deny / verify a team
 * The 'team' client does **NOT** have access to this route
 */
router.patch('/:roomid/teams/:teamid', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { team, room } = models
  const { roomid, teamid } = req.params
  const { verified } = req.body

  const t = await team.model.findById(teamid)
  const r = await room.model.findOne({ number: roomid })

  // Check if team is actually in the specified room
  if (!r.teams.includes(t._id)) {
    const e = new Error('This team is not in your room!')
    e.rescode = 404
    return next(e)
  }

  // Allowed PATCH operations
  if (verified === undefined) {
    const e = new Error('Invalid PATCH operation!')
    e.rescode = 403
    return next(e)
  }

  if (verified === false) t.name = undefined
  t.verified = verified

  try {
    await t.save()
  } catch (err) {
    const e = new Error(`Validation failed - ${err.message}`)
    e.rescode = 400
    return next(e)
  }
  res.json({
    success: `${verified ? 'Verified' : 'Denied'} team succesfully`
  })

  /**
   * Send a message to the team if their name was approved or denied
   */
  wss.clients.forEach(client => {
    if (client.role === 'team' && client.teamid.toString() === t._id.toString()) {
      client.send(JSON.stringify({
        mType: verified ? 'name_approved' : 'name_denied'
      }))
    }
  })
})

/**
 * Start a new round
 */
router.put('/:roomid/round', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { room, team } = models
  const { roomid } = req.params

  const r = await room.model.findOne({
    number: roomid
  }).populate('teams')

  if (r.round === undefined || r.currentQuestion >= 12) {
    if (r.round !== undefined) {
      const points = determinePoints(r.round.score)
      if (points) {
        const t = await team.model.find({ room: r._id })
        points.forEach(p => {
          t.find(t => t._id.toString() === p.team.toString()).points += p.points
        })
        for (const team of t) {
          await team.save()
        }
      }
    }
    const newRound = {
      roundNumber: r.currentRound + 1
    }

    r.round = newRound
    r.currentRound = newRound.roundNumber
    r.currentQuestion = 0
  } else {
    // This means the round hasn't completed yet, so the quizmaster
    // shouldn't be able to start a new one

    const e = new Error(`Can't start a new round if the previous one hasn't finished yet!`)
    e.rescode = 403 /* not sure about the response code */
    return next(e)
  }

  try {
    await r.save()
  } catch (err) {
    const e = new Error(`Couldn't save round in database: ${err.message}`)
    e.rescode = 500
    return next(e)
  }

  res.json({
    success: "Started new round succesfully"
  })

  wss.clients.forEach(client => {
    if (client.role === 'team' && client.room.toString() === r._id.toString()) {
      client.send(JSON.stringify({
        mType: 'start_round'
      }))
    }
  })
})

/**
 * Set the round's categories
 */
router.put('/:roomid/round/categories', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { room } = models
  const { categories } = req.body
  const { roomid } = req.params

  if (categories === undefined) {
    const e = new Error('No categories supplied!')
    e.rescode = 403
    return next(e)
  }

  const r = await room.model.findOne({
    number: roomid
  })
  if (r.round === undefined || r.round.roundNumber !== r.currentRound) {
    const e = new Error('Round not initialized!')
    e.rescode = 404
    return next(e)
  }

  const response = await fetch('http://localhost:3000/quizzer/categories')
  const json = await response.json()
  const allowedCategories = json.categories
  if (allowedCategories === undefined || !categories.every(cat => allowedCategories.includes(cat)) || categories.length > 3 || r.currentQuestion !== 0) {
    const e = new Error('Invalid categories!')
    e.rescode = 400
    return next(e)
  }
  r.round.categories = categories

  try {
    await r.save()
  } catch (err) {
    const e = new Error(`Couldn't save room: ${err.message}`)
    e.rescode = 500
    return next(e)
  }

  res.json({
    success: "Set categories succesfully"
  })

  wss.clients.forEach(client => {
    if (client.role === 'team' && client.room.toString() === r._id.toString()) {
      client.send(JSON.stringify({
        mType: 'set_categories',
        categories: r.round.categories
      }))
    }
  })
})

/**
 * Set the current question
 */
router.put('/:roomid/round/question', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { room, question } = models
  const { questionId } = req.body
  const { roomid } = req.params

  if (questionId === undefined) {
    const e = new Error('No questionId supplied!')
    e.rescode = 403
    return next(e)
  }

  const r = await room.model.findOne({
    number: roomid
  })

  if (r.round === undefined || r.round.roundNumber !== r.currentRound) {
    const e = new Error('Round not initialized!')
    e.rescode = 404
    return next(e)
  }
  const q = await question.model.findById(questionId)

  if (q === undefined || !r.round.categories.includes(q.category)) {
    const e = new Error('Invalid question for this round!')
    e.rescode = 400
    return next(e)
  }
  if (r.usedQuestions.find(q => q._id.toString() === questionId._id.toString()) !== undefined) {
    const e = new Error('This question was already used!')
    e.rescode = 400
    return next(e)
  }

  if (r.round.question === undefined || !r.round.question.open) {
    r.round.question.questiondata = q._id
    r.round.question.open = true
    r.usedQuestions.push(q._id)
    r.currentQuestion++
  } else {
    const e = new Error(`Question ${r.currentQuestion} is not closed yet!`)
    e.rescode = 403
    return next(e)
  }

  try {
    await r.save()
  } catch (err) {
    const e = new Error(`Couldn't save room: ${err.message}`)
    e.rescode = 500
    return next(e)
  }

  const q_raw = JSON.parse(JSON.stringify(r.round.question))
  const q_data = JSON.parse(JSON.stringify(q))
  res.json({
    success: "Set question succesfully",
    question: { ...q_raw, ...q_data }
  })

  wss.clients.forEach(client => {
    if (client.role === 'team' && client.room.toString() === r._id.toString()) {
      client.send(JSON.stringify({
        mType: 'next_question'
      }))
    }
  })
})

/**
 * Quizmaster can close a question here and update the score
 */
router.patch('/:roomid/round/question', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { room, question } = models
  const { correct, team, open, questionId } = req.body
  const { roomid } = req.params

  const operations = [
    { operation: 'score', val: correct !== undefined && team ? { correct, team } : undefined },
    { operation: 'open', val: open }
  ]
  // Allowed PATCH operations
  if (operations.every(i => i.val === undefined)) {
    const e = new Error('Invalid PATCH operation!')
    e.rescode = 403
    return next(e)
  }

  const r = await room.model.findOne({
    number: roomid
  }).populate({
    path: 'round.question.questiondata',
    model: 'Question'
  })

  if (r.round === undefined || r.round.roundNumber !== r.currentRound) {
    const e = new Error('Round not initialized!')
    e.rescode = 404
    return next(e)
  }

  for (op of operations) {
    if (op.val !== undefined) {
      if (op.operation === 'score') {
        r.round.question.answers = r.round.question.answers.filter(a => a.team.toString() !== op.val.team.toString())
        if (r.round.score.find(s => s.team.toString() === op.val.team.toString())) {
          const score = r.round.score.find(s => s.team.toString() === op.val.team.toString());
          score.team = op.val.team
          score.correct = op.val.correct ? score.correct + 1 : score.correct
        } else {
          r.round.score.push(op.val)
        }
      } else if (op.operation === 'open') {
        r.round.question.open = op.val
      }
    }
  }

  try {
    await r.save()
  } catch (err) {
    const e = new Error(`Couldn't save room: ${err.message}`)
    e.rescode = 500
    return next(e)
  }

  const q = await question.model.findById(questionId)

  res.json({
    success: "Changed values succesfully!",
    question: questionId ? { questionNumber: r.currentQuestion, open: true, ...q._doc } : undefined
  })

  wss.clients.forEach(client => {
    if (client.role === 'team' && client.room.toString() === r._id.toString()) {
      if (operations.find(op => op.operation === 'open').val !== undefined) client.send(JSON.stringify({
        mType: 'question_closed'
      }))
      else if (operations.find(op => op.operation === 'score').val) if (client.teamid.toString() === team.toString()) client.send(JSON.stringify({
        mType: `answer_${operations.find(op => op.operation === 'score').val.correct ? 'approved' : 'denied'}`,
        answer: r.round.question.questiondata.answer
      }))
    }
  })
})

module.exports = router