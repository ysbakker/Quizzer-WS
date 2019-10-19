const WebSocket = require('ws')

const socket = new WebSocket('ws://localhost:3000')

socket.onopen = event => {
  socket.send(JSON.stringify({
    mType: 'JOIN_ROOM',
    id: 1,
    password: 'test'
  }))
}

socket.onmessage = event => {
  const message = JSON.parse(event.data)
  console.log(message)
}