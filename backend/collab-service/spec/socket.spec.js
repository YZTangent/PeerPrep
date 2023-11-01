const { createServer } = require("node:http");
const { Server } = require("socket.io");
const ioc = require("socket.io-client");

function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe('socket testing', () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });

  it('should receive a message when a user connects', (done) => {
    clientSocket.on("test", (arg) => {
      expect(arg).toEqual("connect!");
      done();
    });
    serverSocket.emit("test", "connect!");
  });

  it('should work with an acknoledgement', (done) => {
    serverSocket.on("testAck", (arg) => {
      arg(5);
    });
    clientSocket.emit("testAck", (arg) => {
      expect(arg).toEqual(5);
      done();
    });
  });

  it('should work with emitWithAck', async () => {
    serverSocket.on("testEmitWithAck", (arg1) => {
      arg1("reply");
    });
    const result = await clientSocket.emitWithAck("testEmitWithAck");
    expect(result).toEqual("reply");
  });

  it('should work with waitFor()', async () => {
    clientSocket.emit("testWaitFor", "test");
    return waitFor(serverSocket, "testWaitFor").then((arg) => {
      expect(arg).toEqual("test");
    });
  });
});
