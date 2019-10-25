const http = require('http')
const cors = require('cors')
const ws = require('ws')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const app = express();
const server = http.createServer();

const sessionParser = session({
  secret: '9jDb8AHQdY',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
})

/************************
 * Socket Server Config *
 ************************/

// Import event listeners
const messageListener = require('./messageListener');

const wss = new ws.Server({
  noServer: true
});

server.on("upgrade", (request, socket, head) => {
  sessionParser(request, {}, () => {
    const {
      session
    } = request

    if (session.auth === 1) {
      wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
      })
      return
    }

    socket.destroy()
  })
})

// Handle new socket connection, this means HTTP upgrade was OK
wss.on("connection", socket => {
  attachListeners(socket, wss)
})

server.on('request', app);
server.listen(3000, () => {
  console.log("The Server is lisening on port 3000.")
});

const attachListeners = (socket, server) => {
  socket.on('message', message => messageListener(message, socket, server))

  socket.on('close', () => {
    if (socket.roomid !== undefined) {
      // Remove socket from its room's 'team' array
      const room = server.rooms.find(room => room.id === socket.roomid);
      room.teams = room.teams.filter(team => {
        return team !== socket
      })
    }
  })
}

/*******************
 * REST API Config *
 *******************/
// POST /quizzer/rooms -> create new room
// DELETE /quizzer/rooms/:roomid -> delete room as quizmaster
// PATCH /quizzer/rooms/:roomid -> update room information as quizmaster
// GET /quizzer/rooms/:roomid/teams -> get all teams as quizmaster
// POST /quizzer/rooms/:roomid/teams -> create new team (auth)
// PATCH /quizzer/rooms/:roomid/teams/:teamid -> update team name
// POST /quizzer/rooms/:roomid/rounds -> create a new round
// PUT /quizzer/rooms/:roomid/rounds/:round/categories -> edit categories for round

mongoose.connect('mongodb://127.0.0.1/Quizzer', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors({
  origin: true,
  credentials: true
}));
app.options("*", cors({
  origin: true,
  credentials: true
}));
app.use(bodyParser.json())
app.use(sessionParser);

// Attach API routes
app.use('/quizzer', require('./routes/teams'))
app.use('/quizzer', require('./routes/quizmaster'))

// Error handling
app.use((err, req, res, next) => {
  res.status(err.rescode !== undefined ? err.rescode : 418)
  res.json({
    error: err.message
  })
})