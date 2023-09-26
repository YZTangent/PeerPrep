const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();
const dbConfig = require("./app/config/db.config");


//cors is a middleware
var corsOptions = {
    origin:"http://localhost:8081"
};

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:8081"],
  })
);
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
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

//db

const db = require("./app/models");
const Role = db.role;
db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log("Successfully connected to MongoDB.");
    initial();
}).catch(err => {
    console.error("Connection error", err);
    process.exit();
});


//set port & listen for requests
const PORT = process.env.PORT || 8080;
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