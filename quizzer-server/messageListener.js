class Room {
  constructor() {
    this.name
    this.password = 'test'
    this.teams = []
    this.quizmaster
  }
}

const uniqueRandomRoomId = (rooms) => {
  /* From:
   * https://stackoverflow.com/a/21816636
   */
  const generateId = () => Math.floor(100000 + Math.random() * 900000)

  let id = generateId()
  while (rooms[id] !== undefined) {
    id = generateId()
  }
  return id
}

const messageListener = (message, socket, server) => {
  message = JSON.parse(message)
  console.log(message)
  switch (message.mType) {
    case 'GENERATE_ROOM': {
      // Generates unique room id and makes this client 'quiz master'
      const id = uniqueRandomRoomId(server.rooms)
      server.rooms[id] = new Room()
      server.rooms[id].quizmaster = socket

      socket.send(JSON.stringify({
        mType: 'ROOM_ID',
        id: id
      }))
      break
    }

    case 'SET_PASSWORD': {
      // Sets the room password for the room where the quizmaster is
      // this client
      const {
        password
      } = message
      const room = [...server.rooms].find(room => room.quizmaster === socket)

      if (room === undefined) {
        // Client isn't quizmaster of any room
        socket.send({
          mType: 'ERROR',
          message: 'You are not the quizmaster!'
        })
        break
      }

      room.password = password

      socket.send({
        mType: 'SUCCESS',
        message: 'Set password succesfully!'
      })
      break
    }

    case 'SET_NAME': {
      // Sets the room name for the room where the quizmaster is
      // this client
      const {
        name
      } = message
      const room = [...server.rooms].find(room => room.quizmaster === socket)

      if (room === undefined) {
        // Client isn't quizmaster of any room
        socket.send({
          mType: 'ERROR',
          message: 'You are not the quizmaster!'
        })
        break
      }

      room.name = name

      socket.send({
        mType: 'SUCCESS',
        message: 'Set name succesfully!'
      })
      break
    }

    case 'JOIN_ROOM': {
      // Adds client to the 'teams' array in the specified room
      // if the room exists and if the password is correct
      const {
        id,
        password
      } = message
      const room = server.rooms[id]

      if (room === undefined || room.password === undefined) {
        // Room doesn't exist
        // If password isn't set the quizmaster isn't done setting up
        // the room.
        socket.send(JSON.stringify({
          mType: 'ERROR',
          message: 'That room doesn\'t exist!'
        }))
        break
      }

      if (password !== room.password) {
        // Password incorrect
        socket.send(JSON.stringify({
          mType: 'ERROR',
          message: 'Password incorrect!'
        }))
        break
      }

      room.teams.push(socket)
      socket.send(JSON.stringify({
        mType: 'ROOM_NAME',
        payload: room.name
      }))
      socket.send(JSON.stringify({
        mType: 'SUCCESS',
        message: 'You joined the room!'
      }))
      break
    }

    default: {
      socket.send(JSON.stringify({
        mType: 'ERROR',
        message: 'I don\`t know that message type!'
      }))
      break
    }
  }
}

module.exports = messageListener