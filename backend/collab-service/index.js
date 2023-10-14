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

  socket.on("leave", () => {
    console.log(`${socket.id} leaving room ${matchedRoomId}`);
    socket.leave(matchedRoomId);
    console.log(`Existing rooms: ${Array.from(io.sockets.adapter.rooms.keys())}.`);
  })

  socket.on("change", (change) => {
    console.log(`${socket.id} emitting change ${change} to ${matchedRoomId}.`);
    socket.broadcast.to(matchedRoomId).emit("change", change);
  })

  socket.on("message", (message) => {
    console.log(`${socket.id} emitting message ${message} to ${matchedRoomId}`);
    socket.broadcast.to(matchedRoomId).emit("message", message);
  })

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected.`);
    console.log(`Existing rooms: ${Array.from(io.sockets.adapter.rooms.keys())}.`);
  })
});

require('./routes/collab.routes')(app);