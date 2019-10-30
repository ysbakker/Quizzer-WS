const http = require('http')
const cors = require('cors')
const ws = require('ws')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const middleware = require('./routes/middleware')
const models = require('./models/index')

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
wss.on("connection", (socket, req) => {
  const { session } = req
  socket.role = session.role
  socket.room = session.room
  socket.teamid = session.teamid
  attachListeners(socket, wss, session)
})

server.on('request', app);
server.listen(3000, () => {
  console.log("The Server is lisening on port 3000.")
});

const attachListeners = (socket, server, session) => {
  socket.on('message', message => {

  })

  socket.on('close', () => {

  })
}

/*******************
 * REST API Config *
 *******************/
// See README.md for API routes

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
app.use('/quizzer', require('./routes/quizzer'))

// Error handling
app.use((err, req, res, next) => {
  res.status(err.rescode !== undefined ? err.rescode : 418)
  res.json({
    error: err.message
  })
})