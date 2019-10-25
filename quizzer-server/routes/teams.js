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
  console.log(matchingRoom)
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

  res.json({
    success: 'Created team succesfully'
  })
})

module.exports = router