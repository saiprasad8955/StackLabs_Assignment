require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db/connect')
const routes = require('./routes/routes')
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Express App Started on https://localhost:${port}`);
});
