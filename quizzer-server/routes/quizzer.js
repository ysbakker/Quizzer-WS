const router = require('express').Router()
const fetch = require('node-fetch')

const models = require('../models/index')
const middleware = require('./middleware')

// Import WebSocket server so messages can be sent
const wss = require('../socket')

/**
 * This endpoint creates a new room and authenticates the session
 * automatically. It also stores the room id in the session for 
 * recovery when the quizmaster disconnects.
 */
router.post('/rooms', async (req, res, next) => {
  const { password, roomname } = req.body

  if (password === undefined || roomname === undefined) {
    const e = new Error('No room name or password specified')
    e.rescode = 400
    return next(e)
  }
  const { model } = models.room

  const room = new model({ name: roomname, password: password })

  try {
    room.number = await room.generateUniqueId()
  } catch (err) {
    // Couldn't generate id
    err.rescode = 500
    return next(err)
  }

  try {
    await room.save()
  } catch (err) {
    const e = new Error(`Validation failed - ${err.message}`)
    e.rescode = 400
    return next(e)
  }

  req.session.auth = 1
  req.session.role = 'quizmaster'
  req.session.room = room._id

  res.json({
    success: 'Created room succesfully',
    number: room.number
  })
})

/**
 * This endpoint allows a user/team/client to join a room. Authentication
 * happens here.
 */
router.post('/rooms/:roomid/teams', middleware.checkIfRoomExists, async (req, res, next) => {
  const { password } = req.body
  const { roomid } = req.params
  const { team, room } = models

  const matchingRoom = await room.model.findOne({
    number: roomid,
    password: password
  })

  if (matchingRoom === undefined || matchingRoom === null) {
    const e = new Error('Password incorrect')
    e.rescode = 401
    return next(e)
  }
  const newTeam = new team.model({
    room: matchingRoom._id
  })

  matchingRoom.teams.push(newTeam._id)
  await matchingRoom.save()
  await newTeam.save()

  req.session.auth = 1
  req.session.room = matchingRoom._id
  req.session.role = 'team'
  req.session.teamid = newTeam._id

  res.json({
    success: 'Joined room succesfully',
    roomname: matchingRoom.name,
    teamid: newTeam._id
  })
})


router.get('/categories', async (req, res, next) => {
  const { question } = models

  const q = await question.model.find()

  const categories = q.reduce((acc, q) => {
    if (!acc.includes(q.category)) return acc.concat(q.category)
    else return acc
  }, [])

  res.json({
    categories
  })
})

/**
 * From this point, all routes require the user to be authenticated.
 */
router.use(middleware.checkIfUserIsAuthenticated)

router.put('/rooms/:roomid/round/answers', middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { room } = models
  const { roomid } = req.params
  const { answer } = req.body

  const r = await room.model.findOne({
    number: roomid
  })

  if (!r.round.question.open) {
    const e = new Error('Question is closed!')
    e.rescode = 403
    return next(e)
  }

  if (r.round.question.answers.find(a => a.team.toString() === req.session.teamid.toString())) {
    r.round.question.answers.find(a => a.team.toString() === req.session.teamid.toString()).answer = answer
  } else {
    r.round.question.answers.push({
      answer: answer,
      team: req.session.teamid
    })
  }

  try {
    await r.save()
  } catch (err) {
    const e = new Error(`Couldn't save round in database: ${err.message}`)
    e.rescode = 500
    return next(e)
  }

  res.json({
    success: "Submitted answer succesfully"
  })
})

router.get('/', middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { session } = req
  const { room, team } = models

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

  let t
  if (session.teamid !== undefined) {
    t = await team.model.findById(session.teamid)
  }

  if (session.role === 'quizmaster') {
    res.json({ role: 'quizmaster', ...r._doc })
  } else {
    res.json({
      role: 'team',
      _id: r._id,
      name: r.name,
      number: r.number,
      team: t,
      currentQuestion: r.currentQuestion,
      currentRound: r.currentRound,
      round: {
        question: r.currentQuestion !== 0 ? {
          open: r.round.question.open,
          questiondata: {
            _id: r.round.question.questiondata._id,
            question: r.round.question.questiondata.question,
            category: r.round.question.questiondata.category
          }
        } : undefined,
      }
    })
  }
})

/**
 * The PATCH teams route is used by both the
 * QUIZMASTER
 * and the
 * TEAMS
 * //////////////////////////
 */
router.patch('/rooms/:roomid/teams/:teamid', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { team, room } = models
  const { roomid, teamid } = req.params
  const { denied, verified, name } = req.body
  const { role } = req.session

  const t = await team.model.findById(teamid)
  const r = await room.model.findOne({ number: roomid })

  // Check if team is actually in the specified room
  if (!r.teams.includes(t._id)) {
    const e = new Error('This team is not in your room!')
    e.rescode = 404
    return next(e)
  }

  let operations;

  if (role === 'quizmaster') {
    // Quizmaster can change team names and verify/deny a team
    operations = [{ operation: 'denied', val: denied }, { operation: 'verified', val: verified }, { operation: 'name', val: name }]
  } else {
    // Teams can only change their name
    operations = [{ operation: 'name', val: name }]
  }

  // Allowed PATCH operations
  if (operations.every(i => i.val === undefined)) {
    const e = new Error('Invalid PATCH operation!')
    e.rescode = 403
    return next(e)
  }

  operations.forEach(op => {
    if (op.val !== undefined) {
      if (op.operation === 'denied') t.name = undefined
      else t[op.operation] = op.val
    }
  })

  try {
    await t.save()
  } catch (err) {
    const e = new Error(`Validation failed - ${err.message}`)
    e.rescode = 400
    return next(e)
  }
  res.json(Object.assign({
    success: `Operation succesful`
  }, ...operations.map(op => ({ [op.operation]: op.val }))))

  /**
   * Send a message to the quizmaster to fetch new teams
   */
  wss.clients.forEach(client => {
    if (client.role === 'quizmaster' && client.room.toString() === r._id.toString()) {
      client.send(JSON.stringify({
        mType: 'new_team'
      }))
    } else if (client.role === 'team' && client.teamid.toString() === t._id.toString()) {
      if (verified || denied) client.send(JSON.stringify({
        mType: verified ? 'name_approved' : 'name_denied'
      }))
    }
  })
})


/**
 * From this point, all routes require the client to be quizmaster.
 */
router.use(middleware.checkIfUserIsQuizmaster)

router.get('/rooms/:roomid/teams', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { model } = models.room
  const { roomid } = req.params

  const room = await model.findOne({
    number: roomid
  }).populate('teams')

  res.json({
    teams: room.teams
  })
})

router.put('/rooms/:roomid/round', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { room } = models
  const { roomid } = req.params

  const r = await room.model.findOne({
    number: roomid
  })

  if (r.round === undefined || (r.currentRound !== r.round.roundNumber && !r.round.open)) {
    const newRound = {
      roundNumber: r.currentRound + 1
    }

    r.round = newRound
    r.currentRound = newRound.roundNumber
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

router.patch('/rooms/:roomid/round', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { room, question } = models
  const { categories, questionId } = req.body
  const { roomid } = req.params

  const operations = [{ operation: 'categories', val: categories }, { operation: 'question', val: questionId }]
  // Allowed PATCH operations
  if (operations.every(i => i.val === undefined)) {
    const e = new Error('Invalid PATCH operation!')
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

  for (op of operations) {
    if (op.val !== undefined) {
      if (op.operation === 'categories') {
        const response = await fetch('http://localhost:3000/quizzer/categories')
        const json = await response.json()
        const allowedCategories = json.categories
        if (allowedCategories === undefined || !categories.every(cat => allowedCategories.includes(cat)) || categories.length > 3) {
          const e = new Error('Invalid categories!')
          e.rescode = 400
          return next(e)
        }
        r.round.categories = categories
      } else if (op.operation === 'question') {
        const q = await question.model.findById(questionId)
        if (q === undefined || !r.round.categories.includes(q.category)) {
          const e = new Error('Invalid question for this round!')
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
    question: questionId ? { questionNumber: r.currentQuestion, ...q._doc } : undefined
  })

  wss.clients.forEach(client => {
    if (client.role === 'team' && client.room.toString() === r._id.toString()) {
      if (operations.find(op => op.operation === 'categories').val) client.send(JSON.stringify({
        mType: 'set_categories',
        categories: r.round.categories
      }))
      else if (operations.find(op => op.operation === 'question').val) client.send(JSON.stringify({
        mType: 'next_question'
      }))
    }
  })
})

router.get('/questions/random', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {
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
  while (selectedQuestions.length < count) {
    const r = Math.floor(Math.random() * questions.length)

    if ((!r.usedQuestions || !r.usedQuestions.includes(questions[r]._id)) && !selectedQuestions.find(q => q._id === questions[r]._id)) {
      selectedQuestions.push(questions[r])
    }
  }

  res.json({
    questions: selectedQuestions
  })
})

module.exports = router