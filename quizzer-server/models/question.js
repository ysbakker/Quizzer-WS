const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  question: {
    type: String,
    required: true
  }
})

mongoose.model('Question', questionSchema)

module.exports = {
  schema: questionSchema,
  model: mongoose.model('Question')
}