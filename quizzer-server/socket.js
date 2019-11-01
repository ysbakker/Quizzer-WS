const ws = require('ws')

/************************
 * Socket Server Config *
 ************************/

const wss = new ws.Server({
  noServer: true
});


const attachListeners = (socket, server) => {
  socket.on('message', message => {
  })

  socket.on('close', () => {
  })
}

// Handle new socket connection, this means HTTP upgrade was OK
wss.on("connection", (socket, req) => {
  const { session } = req
  socket.role = session.role
  socket.room = session.room
  socket.teamid = session.teamid

  attachListeners(socket, wss)
})

module.exports = wss