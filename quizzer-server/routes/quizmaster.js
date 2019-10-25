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
    throw e
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

router.use(middleware.checkIfUserIsAuthenticated)
router.use(middleware.checkIfUserIsQuizmaster)

module.exports = router