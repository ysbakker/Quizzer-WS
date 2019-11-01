const router = require('express').Router()
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

/**
 * From this point, all routes require the user to be authenticated.
 */
router.use(middleware.checkIfUserIsAuthenticated)

router.get('/', middleware.checkIfUserIsInRoom, async (req, res, next) => {
  const { session } = req
  const { room, team } = models

  const r = await room.model.findById(session.room).populate('teams')
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
      rounds: r.rounds,
      number: r.number,
      team: t
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

router.get('/rooms/:roomid/teams', middleware.checkIfRoomExists, async (req, res, next) => {
  const { model } = models.room
  const { roomid } = req.params

  const room = await model.findOne({
    number: roomid
  }).populate('teams')

  res.json({
    teams: room.teams
  })
})

router.post('/rooms/:roomid/rounds', middleware.checkIfRoomExists, async (req, res, next) => {
  const { room, round } = models
  const { roomid } = req.params

  const r = await room.model.findOne({
    number: roomid
  })

  const newRound = {
    roundNumber: r.currentRound + 1
  }

  r.rounds.push(newRound)
  r.currentRound++

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
    if (client.room.toString() === r._id.toString()) {
      client.send(JSON.stringify({
        mType: 'start_round'
      }))
    }
  })
})

module.exports = router