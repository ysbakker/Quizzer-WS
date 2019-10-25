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

const checkIfUserIsAuthenticated = (req, res, next) => {
  const { auth } = req.session
  if (auth === 1) next()
  else {
    const e = new Error('You are not authenticated!')
    e.rescode = 401
    return next(e)
  }
  next()
}

const checkIfUserIsQuizmaster = (req, res, next) => {
  const { role } = req.session
  if (role === 'quizmaster') next()
  else {
    const e = new Error('You are not the quizmaster!')
    e.rescode = 403
    return next(e)
  }
  next()
}

module.exports = {
  checkIfRoomExists,
  checkIfUserIsAuthenticated,
  checkIfUserIsQuizmaster
}