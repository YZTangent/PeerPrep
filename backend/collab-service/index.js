const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io')

const app = express();

var corsOptions = {
  origin: 'http://127.0.0.1:8000',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  allowedHeaders: 'Origin, Authorization, Content-Type, Accept',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: {} });

const PORT = 8004;

app.get('/', (_, res) => {
  res.json({ message: 'Hello World from collab-service.' });
});

httpServer.listen(PORT, () => {
  console.log(`collab-service listening on port ${PORT}.`);
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected.`);

  let matchedRoomId;

  socket.on("join", (roomId) => {
    console.log(`${socket.id} joining room ${roomId}`)
    matchedRoomId = roomId
    socket.join(matchedRoomId);
  })

  socket.on("codeChange", (code) => {
    console.log(`Emitting ${code} to ${matchedRoomId}.`);
    socket.broadcast.to(matchedRoomId).emit("codeChange", code);
  })

  socket.on("message", (message) => {
    console.log(`Emitting ${message} to ${matchedRoomId}`);
    socket.broadcast.to(matchedRoomId).emit("message", message);
  })
});

require('./routes/collab.routes')(app);