require('dotenv').config();
// enables process.env.VARNAME
const mongoose = require('mongoose');
const express = require('express');

const Video = require('./model/video');

const app = express();
app.use(express.json());

const PORT = process.env.NODE_DOCKER_PORT || 5000;

app.get('/api/status', (req, res) => {
  res.send({status: "Hello world."});
});

app.get('/api/dbstatus', (req, res) => {
  mongoose.connect("mongodb://root:example@mongodb").then(() => {
    res.send({status: "Hello world. Successfully connected with mongoose. Now what?"});
  });
});

app.post('/api/video', async (req, res) => {
  const { title, url } = req.body; // TODO: null/empty check, etc

  await mongoose.connect("mongodb://root:example@mongodb");
  const video = await Video.create({ title, url });

  res.send({status: `Posted video ${video}`});
});

app.get('/api/videos', async (req, res) => {
  await mongoose.connect("mongodb://root:example@mongodb");
  const videos = await Video.find({});
  // TODO: pagination? no, because we actually aren't going to need this route
  // at all.
  res.send({ videos });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`))
