const router = require('express').Router()
const models = require('../models/index')
const middleware = require('./middleware')

/**
 * This endpoint allows a user to join a room. Authentication
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

  res.json({
    success: 'Joined room succesfully',
    roomname: matchingRoom.name,
    teamid: newTeam._id
  })
})

router.patch('/rooms/:roomid/teams/:teamid', middleware.checkIfRoomExists, async (req, res, next) => {
  const { name } = req.body
  const { teamid, roomid } = req.params
  const { team, room } = models

  const t = await team.model.findById(teamid)
  const r = await room.model.findOne({ number: roomid })

  // User is not in the specified room
  if (r === undefined || !r.teams.includes(t._id)) {
    const e = new Error('You are not in the specified room!')
    e.rescode = 404
    return next(e)
  }

  // Allowed PATCH operations
  if ([name].every(i => i === undefined)) {
    const e = new Error('Invalid PATCH operation!')
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
    success: 'Submitted name succesfully',
    name
  })
})

module.exports = router