const cors = require('cors');
const express = require('express');
var path = require('path');
const app = express();
const port = 4000;
const host = '0.0.0.0';
require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// connect to database
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
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  console.log("Server responding")
  res.send("Hello from Heroku");
})
// app.use('/', indexRouter);
app.use('/users', usersRouter);


app.listen(port, host, () => {
    console.log("Server running on port " + port);
})