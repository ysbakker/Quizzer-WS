const mongoose = require('mongoose')

const roundSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    required: true
  },
  categories: [String],
  question: {
    questiondata: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
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
    }],
  },
  score: [{
    correct: Number,
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    }
  }]
})

module.exports = {
  schema: roundSchema,
  model: null
}