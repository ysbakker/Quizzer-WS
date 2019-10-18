const express = require('express');
const ws = require('ws');
const http = require('http');

const app = express();
const HTTPServer = http.createServer();
const WSServer = new ws.Server({
  server: HTTPServer
});

// code to setup event listeners for WebSocket communication can go here
WSServer.on("connection", socket => {
  socket.on("close", () => {})

  socket.on("message", (message) => {})
})

HTTPServer.on('request', app);
HTTPServer.listen(3000,
  function () {
    console.log("The Server is lisening on port 3000.")
  });