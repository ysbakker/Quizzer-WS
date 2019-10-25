const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 16
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  }
})

mongoose.model('Team', teamSchema)

module.exports = {
  schema: teamSchema,
  model: mongoose.model('Team')
}