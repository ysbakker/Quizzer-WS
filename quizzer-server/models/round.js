const mongoose = require('mongoose')

const roundSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    required: true
  },
  open: {
    type: Boolean,
    default: true
  },
  categories: [String],
  question: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    open: Boolean,
    questionNumber: {
      type: Number
    },
    answers: [{
      answer: {
        type: String,
        required: true
      },
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
      }
    }]
  }
})

module.exports = {
  schema: roundSchema,
  model: null
}