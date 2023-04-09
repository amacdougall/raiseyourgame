import { Schema, model } from 'mongoose';

const replySchema = new Schema({
  content: String,
  createdAt: String
});

const commentSchema = new Schema({
  timecode: Number,
  content: String,
  replies: [replySchema],
  createdAt: String
});

const videoSchema = new Schema({
  title: String,
  url: String,
  createdAt: String,
  comments: [commentSchema]
});

const Video = model('Video', videoSchema);

export default Video;
