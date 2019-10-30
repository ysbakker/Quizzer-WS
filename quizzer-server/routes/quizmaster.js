const router = require('express').Router()
const models = require('../models/index')
const middleware = require('./middleware')

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

router.get('/rooms/:roomid/teams', middleware.checkIfRoomExists, middleware.checkIfUserIsQuizmaster, async (req, res, next) => {
  const { model } = models.room
  const { roomid } = req.params

  const room = await model.findOne({
    number: roomid
  }).populate('teams')

  res.json({
    teams: room.teams
  })
})

router.patch('/rooms/:roomid/teams/:teamid', middleware.checkIfRoomExists, middleware.checkIfUserIsQuizmaster, async (req, res, next) => {
  const { team, room } = models
  const { roomid, teamid } = req.params
  const { verified, name } = req.body

  const t = await team.model.findById(teamid)
  const r = await room.model.findOne({ number: roomid })

  // Check if team is actually in the specified room
  if (!r.teams.includes(t._id)) {
    const e = new Error('This team is not in your room!')
    e.rescode = 404
    return next(e)
  }

  const operations = [{ operation: 'verified', val: verified }, { operation: 'name', val: name }]

  // Allowed PATCH operations
  if (operations.every(i => i.val === undefined)) {
    const e = new Error('Invalid PATCH operation!')
    e.rescode = 403
    return next(e)
  }

  operations.forEach(op => {
    if (op.val !== undefined) t[op.operation] = op.val
  })

  try {
    await t.save()
  } catch (err) {
    const e = new Error(`Validation failed - ${err.message}`)
    e.rescode = 400
    return next(e)
  }
  res.json(Object.assign({
    success: `Changed values succesfully`
  }, ...operations.map(op => ({ [op.operation]: op.val }))))
})

module.exports = router