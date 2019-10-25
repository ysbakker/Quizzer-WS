const mongoose = require('mongoose')
const round = require('./round')

const roomSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 16
  },
  password: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 16
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  rounds: {
    type: [round.schema]
  }
})

roomSchema.methods.generateUniqueId = async function () {
  /* From:
   * https://stackoverflow.com/a/21816636
   */
  const generateId = () => Math.floor(100000 + Math.random() * 900000).toString()

  const rooms = await this.model('Room').find({})

  // Get all currently taken room ids
  const ids = rooms.reduce((acc, doc) => {
    if (acc.includes(doc.number)) return acc
    else return [...acc, doc.number]
  }, [])

  // Generate unique id
  let id;
  let count;
  do {
    id = generateId()
    count++
    if (count >= 1000) throw new Error('Took to long to get a unique id, try again')
  } while (ids.includes(id))

  return id
}

mongoose.model('Room', roomSchema)

module.exports = {
  schema: roomSchema,
  model: mongoose.model('Room')
}