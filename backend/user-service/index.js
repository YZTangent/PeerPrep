const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();

var corsOptions = {
  origin: 'http://127.0.0.1:8000',
  methods: 'PUT, PATCH, POST, DELETE',
  allowedHeaders: 'Origin, Authorization, Content-Type, Accept, Cookie',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieSession({
    name:"a_session",
    keys:["COOKIE_SECRET"],
    httpOnly:true
}));

//routes
app.get("/", (req, res) => {
    res.json({message:"route_message says hi!"});
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

//db
const db = require("./models");
const dbConfig = require("./config/db.config.js");

const Role = db.role;
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
  initial();

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


//set port & listen for requests
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}.`);});

function initial() {
  Role.estimatedDocumentCount().then((count) => {
    if (count === 0) {
      new Role({
        name: "user"
      }).save().then(() => {
        console.log("added 'user' to roles collection");
      }).catch(err => {console.log("error", err);});

      new Role({
        name: "moderator"
      }).save().then(() => {console.log("added 'moderator' to roles collection");})
      .catch(err => {console.log("error", err);});

      new Role({
        name: "admin"
      }).save().catch(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
module.exports = app;