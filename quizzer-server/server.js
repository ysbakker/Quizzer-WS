require('dotenv').config();
const http = require('http');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const wss = require('./socket');

const app = express();
const server = http.createServer();

const sessionParser = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),
});

/*********************************
 * Upgrade to WebSocket Protocol *
 *********************************/

server.on('upgrade', (request, socket, head) => {
  sessionParser(request, {}, () => {
    const { session } = request;

    if (session.auth === 1) {
      wss.handleUpgrade(request, socket, head, (socket) => {
        wss.emit('connection', socket, request);
      });
      return;
    }

    socket.destroy();
  });
});

server.on('request', app);
server.listen(3000, () => {
  console.log('The Server is lisening on port 3000.');
});

/*******************
 * REST API Config *
 *******************/
// See README.md for API routes

mongoose.connect(
  `${
    process.env.NODE_ENV === 'production'
      ? process.env.MONGO_URL_PROD
      : process.env.MONGO_URL
  }/Quizzer`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.options(
  '*',
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(sessionParser);

// Attach API routes
app.use('/quizzer', require('./routes/index'));

// Error handling
app.use((err, req, res, next) => {
  res.status(err.rescode !== undefined ? err.rescode : 418);
  res.json({
    error: err.message,
  });
});
