const express = require('express')
const ws = require('ws')
const http = require('http')
const mongoose = require('mongoose')
const cors = require('cors');
const bodyParser = require('body-parser')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Import event listeners
const messageListener = require('./messageListener');

const app = express();
const server = http.createServer();

const sessionParser = session({
  secret: '9jDb8AHQdY',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
})

/************************
 * Socket Server Config *
 ************************/

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
// POST /quizzer/rooms/:roomid/teams -> create new team (auth)
// PATCH /quizzer/rooms/:roomid/teams/:teamid -> update team name
// POST /quizzer/rooms/:roomid/rounds -> create a new round
// PUT /quizzer/rooms/:roomid/rounds/:round/categories -> edit categories for round
// 

mongoose.connect('mongodb://localhost/Quizzer', {
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

// app.use('/', require('./routes/teams'))
app.use('/', require('./routes/quizmaster'))