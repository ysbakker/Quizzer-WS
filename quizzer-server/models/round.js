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
    questiondata: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    open: Boolean,
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