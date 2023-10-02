const express = require('express');
const cors = require('cors');

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

const PORT = 8003;

app.get('/', (_, res) => {
  res.json({ message: 'Hello from matching-service.' });
});

require('./routes/matching.routes')(app);

app.listen(PORT, () => {
  console.log(`matching-service listening on port ${PORT}`);
});