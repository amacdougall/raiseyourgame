require('dotenv').config();
// enables process.env.VARNAME
const mongoose = require('mongoose');

const express = require('express');
const app = express();
const PORT = process.env.NODE_DOCKER_PORT || 5000;

app.get('/status', (req, res) => {
  mongoose.connect("mongodb://root:example@mongodb").then(() => {
    res.send({status: "Hello world. Successfully connected with mongoose. Now what?"});
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`))
