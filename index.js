const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;
const host = '0.0.0.0';

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