const WebSocket = require('ws')

const socket = new WebSocket('ws://localhost:3000')

socket.onopen = event => {
  socket.send(JSON.stringify({
    mType: 'GENERATE_ROOM'
  }))
}

socket.onmessage = event => {
  const message = JSON.parse(event.data)
  console.log(message)

  if (message.mType === 'ROOM_ID') {
    socket.send(JSON.stringify({
      mType: 'JOIN_ROOM',
      id: message.id,
      password: 'test'
    }))
  }
}