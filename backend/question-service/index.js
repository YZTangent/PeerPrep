const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
  credentials: true, 
  origin: 'http://localhost:4200'
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8002;

const db = require("./models");
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
  res.json({ message: 'Hello World from question-service.' });
});

require('./routes/question.routes')(app);

app.listen(PORT, () => {
  console.log(`question-service listening on port ${PORT}`);
});