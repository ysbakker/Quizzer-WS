const router = require('express').Router()

// Mongoose models
const models = require('../models/index')
// Express middleware
const middleware = require('./middleware')
// Import WebSocket server so messages can be sent
const wss = require('../socket')

/**
 * This endpoint creates a new room and authenticates the session
 * automatically. It also stores the room id in the session for 
 * recovery when the quizmaster disconnects.
 */
router.post('/', async (req, res, next) => {
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
router.post('/:roomid/teams', middleware.checkIfRoomExists, async (req, res, next) => {
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

/**
 * From this point, all API routes require the user to be authenticated
 * (quizmaster / team)
 */
router.use(middleware.checkIfUserIsAuthenticated)

/**
 * This route allows the team to change their name
 * The quizmaster does not have access to this route.
 */
router.patch('/:roomid/teams/:teamid', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {
  if (req.session.role === 'quizmaster') return next()
  const { team, room } = models
  const { roomid, teamid } = req.params
  const { name } = req.body

  const t = await team.model.findById(teamid)
  const r = await room.model.findOne({ number: roomid }).populate('teams')

  // Check if the team is changing its own name
  if (teamid.toString() !== req.session.teamid.toString()) {
    const e = new Error('You\'re not changing your own name!')
    e.rescode = 404
    return next(e)
  }

  // Allowed PATCH operations
  if (name === undefined) {
    const e = new Error('Invalid PATCH operation!')
    e.rescode = 403
    return next(e)
  }

  if (r.teams.find(t => t.name && t.name.toLowerCase() === name.toLowerCase())) {
    const e = new Error('Team name invalid or already taken!')
    e.rescode = 403
    return next(e)
  }

  t.name = name

  try {
    await t.save()
  } catch (err) {
    const e = new Error(`Validation failed - ${err.message}`)
    e.rescode = 400
    return next(e)
  }
  res.json({
    success: `Updated team name succesfully!`
  })

  /**
   * Send a message to the quizmaster to fetch new teams
   */
  wss.clients.forEach(client => {
    if (client.role === 'quizmaster' && client.room.toString() === r._id.toString()) {
      client.send(JSON.stringify({
        mType: 'new_team'
      }))
    }
  })
})


/**
 * A team can submit an answer through this route
 */
router.patch('/:roomid/round/answers', middleware.checkIfRoomExists, middleware.checkIfUserIsInRoom, async (req, res, next) => {
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

  wss.clients.forEach(client => {
    if (client.role === 'quizmaster' && client.room.toString() === r._id.toString()) {
      client.send(JSON.stringify({
        mType: 'new_answer'
      }))
    }
  })
})

module.exports = router