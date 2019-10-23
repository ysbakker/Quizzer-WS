const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
})

mongoose.model('Category', categorySchema)

module.exports = {
  schema: categorySchema,
  model: mongoose.model('Category')
}