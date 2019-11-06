const models = require('../models/index')

// Check if the room exists
// Should only be used in-line because it accesses route parameters
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

  if (auth === 1) return next()
  else {
    const e = new Error('You don\'t have access to this room!')
    e.rescode = 401
    return next(e)
  }
}

const checkIfUserIsQuizmaster = (req, res, next) => {
  const { role } = req.session

  if (role === 'quizmaster') return next()
  else {
    const e = new Error('You are not the quizmaster!')
    e.rescode = 403
    return next(e)
  }
}

/**
 * Should only be used in-line because it accesses route parameters
 */
const checkIfUserIsInRoom = async (req, res, next) => {
  const { roomid } = req.params
  const { model } = models.room
  const { room } = req.session

  const r = roomid ? await model.findOne({ number: roomid }) : await model.findById(room)
  if (!r || r._id.toString() !== room.toString()) {
    const e = new Error('You don\'t have access to this room!')
    e.rescode = 403
    return next(e)
  }
  next()
}

module.exports = {
  checkIfRoomExists,
  checkIfUserIsAuthenticated,
  checkIfUserIsQuizmaster,
  checkIfUserIsInRoom
}