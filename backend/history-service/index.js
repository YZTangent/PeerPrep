const express = require('express');
const app = express();
const port = 8004;

const db = require('./models');
const dbConfig = require('./config/db.config.js');

db.mongoose.connection.on('error', console.error.bind(console, 'History database connection error:'));

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser:true,
    useUnifiedTopology:true
  }).then(() => {
    console.log('Connected to the history database.');
  }).catch(err => {
    console.log('Connection to history database failed.', err);
    process.exit();
  });

app.get('/', (_, res) => { res.json({ message: 'History-service online and reporting.' }); });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// require('./routes/matching.routes')(app);

// const cors = require('cors');


// var corsOptions = {
//   origin: 'http://127.0.0.1:8000',
//   methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
//   allowedHeaders: 'Origin, Authorization, Content-Type, Accept',
//   credentials: true,
//   optionsSuccessStatus: 200
// };
// 
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

