const { MongoClient } = require("mongodb");


let db
async function connectToDb() {
  try {
    const url = 'mongodb://localhost';
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();
    console.log('Connected to db');
    db = client.db("incident");
  }
  catch(e) {
    console.error(e);
  }
}

function getDb() {
  return db;
}


module.exports = { connectToDb, getDb };