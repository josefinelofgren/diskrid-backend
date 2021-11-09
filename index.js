const cors = require('cors');
const express = require('express');
const app = express();
const port = 4000;
const host = '0.0.0.0';
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;
const { log } = require("console");

MongoClient.connect(process.env.DB_CLOUD, {
  useUnifiedTopology: true,
}).then((client) => {
  console.log("Database connected");

  const db = client.db("users");
  app.locals.db = db;
});

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.json('Hello World!')
})

app.listen(port, host, () => {
    console.log("Server running on port " + port);
})