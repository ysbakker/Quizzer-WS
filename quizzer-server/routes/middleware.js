const models = require('../models/index')

// Check if the room exists
const checkIfRoomExists = async (req, res, next) => {
  const { roomid } = req.params
  const { room } = models
  if (roomid !== undefined) {
    const roomsFound = await room.model.find({
      number: roomid
    })
    if (roomsFound.length === 0) {
      const e = new Error('Couldn\'t find room')
      e.rescode = 404
      return next(e)
    }
  }
  next()
}

const checkIfUserIsAuthenticated = async (req, res, next) => {
  const { roomid } = req.params
  const { auth, room } = req.session
  const { model } = models.room

  const r = await model.findOne({ number: roomid })

  if (r._id.toString() !== room.toString()) {
    const e = new Error('You are not authenticated for this room!')
    e.rescode = 403
    return next(e)
  }

  if (auth === 1) return next()
  else {
    const e = new Error('You don\'t have access to this room!')
    e.rescode = 401
    return next(e)
  }
}

const checkIfUserIsQuizmaster = async (req, res, next) => {
  const { roomid } = req.params
  const { role, room } = req.session
  const { model } = models.room

  const r = await model.findOne({ number: roomid })

  if (r._id.toString() !== room.toString()) {
    const e = new Error('You don\'t have access to this room!')
    e.rescode = 403
    return next(e)
  }

  if (role === 'quizmaster') return next()
  else {
    const e = new Error('You are not the quizmaster!')
    e.rescode = 403
    return next(e)
  }
}

module.exports = {
  checkIfRoomExists,
  checkIfUserIsAuthenticated,
  checkIfUserIsQuizmaster
}