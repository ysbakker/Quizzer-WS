const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
})

mongoose.model('Question', questionSchema)

module.exports = {
  schema: questionSchema,
  model: mongoose.model('Question')
}