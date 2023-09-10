const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
  origin: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8003;

const db = require("./model");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to the database.');
  })
  .catch(err => {
    console.log('Connection failed.', err);
    process.exit();
  });

app.get('/', (_, res) => {
  res.json({ message: 'Hello World from user-service.' });
});

require('./route/user.routes')(app);

app.listen(PORT, () => {
  console.log(`user-service listening on port ${PORT}`);
});