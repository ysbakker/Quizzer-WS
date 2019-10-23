const router = require('express').Router()
const mongoose = require('mongoose')
const models = require('../models/index')

router.post('/quizzer/rooms', (req, res, next) => {
  const {
    password,
    roomname
  } = req.body

  if (password !== undefined && roomname !== undefined) {
    const {
      model
    } = models.room


    const room = new model({
      number: 123456,
      name: rooname,
      password: password
    })

    room.save()
      .then(() => {
        req.session.auth = 1
        req.session.role = 'quizmaster'
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    throw Error('No room name or password specified')
  }
})

module.exports = router