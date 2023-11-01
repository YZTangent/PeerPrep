const express = require('express');
const cors = require('cors');
const cookieSession = require("cookie-session");

const app = express();

var corsOptions = {
  origin: 'http://127.0.0.1:8000',
  methods: 'PUT, PATCH, POST, DELETE',
  allowedHeaders: 'Origin, Authorization, Content-Type, Accept, Cookie',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  maxAge:24*60*60,
  name:"a_session",
  keys:["COOKIE_SECRET"],
  httpOnly:true
}));

const PORT = 8002;

const db = require("./models");
const dbConfig = require("./config/db.config.js");
const { MongoMemoryServer } = require('mongodb-memory-server');

if (process.env.JASMINE) {
  const startMongoStub = async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await db.mongoose.connect(mongoUri).then(() => {
      console.log("Successfully connected to Mongo Memory Server.");
    });
  }

  startMongoStub();

} else {
  db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
      useNewUrlParser:true,
      useUnifiedTopology:true
  }).then(() => {
      console.log("Successfully connected to MongoDB.");
      initial();
  }).catch(err => {
      console.error("Connection error", err);
      process.exit();
  });
}


app.get('/', (_, res) => {
  res.json({ message: 'Hello World from question-service.' });
});

require('./routes/question.routes')(app);

app.listen(PORT, () => {
  console.log(`question-service listening on port ${PORT}`);
});

module.exports = app;