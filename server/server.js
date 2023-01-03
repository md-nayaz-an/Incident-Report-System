require('dotenv').config({ path: './.env.development'});

const express = require('express');
const cors = require('cors');
const dB = require('./conn'); 

const app = express();
const port = process.env.REACT_APP_SERVER_PORT;

app.use(cors());

app.use(express.json());
app.use(require('./routes'));

app.listen(port, () => {
  dB.connectToDb();

  console.log(`Server started at port: ${port}`);
})
