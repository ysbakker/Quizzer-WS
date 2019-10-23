module.exports = {
  category: {
    schema: require('./category').schema,
    model: require('./category').model
  },
  question: {
    schema: require('./question').schema,
    model: require('./question').model
  },
  room: {
    schema: require('./room').schema,
    model: require('./room').model
  },
  round: {
    schema: require('./round').schema,
    model: require('./round').model
  },
  team: {
    schema: require('./team').schema,
    model: require('./team').model
  }
}