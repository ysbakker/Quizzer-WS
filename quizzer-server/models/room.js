const mongoose = require('mongoose')
const round = require('./round')

const roomSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    min: 6,
    max: 6
  },
  name: {
    type: String,
    required: true,
    min: 2,
    max: 16
  },
  password: {
    type: String,
    required: true,
    min: 2,
    max: 16
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  rounds: {
    type: [round.schema]
  }
})

mongoose.model('Room', roomSchema)

module.exports = {
  schema: roomSchema,
  model: mongoose.model('Room')
}