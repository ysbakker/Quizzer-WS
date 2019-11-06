const router = require('express').Router()

// Mongoose models
const models = require('../models/index')

router.get('/', async (req, res, next) => {
  const { question } = models

  const q = await question.model.find()

  const categories = q.reduce((acc, q) => {
    if (!acc.includes(q.category)) return acc.concat(q.category)
    else return acc
  }, [])

  res.json({
    categories
  })
})

module.exports = router