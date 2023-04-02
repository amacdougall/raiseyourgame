const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const videoSchema = new Schema({
  title: String,
  url: String
});

const Video = model('Video', videoSchema);
module.exports = Video;
