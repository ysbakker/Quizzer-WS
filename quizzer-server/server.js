const express = require('express');
const ws = require('ws');
const http = require('http');

// Import event listeners
const messageListener = require('./messageListener');

const app = express();
const server = http.createServer();
const wss = new ws.Server({
  noServer: true
});

wss.rooms = {};

// HTTP upgrade handler, currently always emits connection
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  })
})

// Handle new socket connection, this means HTTP upgrade was OK
wss.on("connection", socket => {
  console.log("New socket connected!")

  attachListeners(socket, wss)
})

server.on('request', app);
server.listen(3000, () => {
  console.log("The Server is lisening on port 3000.")
});

const attachListeners = (socket, server) => {
  socket.on('message', (message) => messageListener(message, socket, server))
}