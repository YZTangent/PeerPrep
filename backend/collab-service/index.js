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

  socket.on("join", (event) => {
    console.log(`${socket.id} joined room ${event.roomId}`)
    socket.join(event.roomId);
  })

  socket.on("codeChange", (event) => {
    console.log(`Emitting ${event}.`);
    io.to(event.roomId).emit("codeChange", event);
  })

});

require('./routes/collab.routes')(app);