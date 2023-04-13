import { Schema, model } from 'mongoose';

// MongoDB schemas; kind of redundant with GraphQL typedefs, but whatever.
const replySchema = new Schema({
  content: String,
  sessionId: String,
  token: String,
  username: String,
  createdAt: String
});

const commentSchema = new Schema({
  timecode: Number,
  content: String,
  replies: [replySchema],
  sessionId: String,
  token: String,
  username: String,
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
