import { Schema, model } from 'mongoose';
import Comment from './comment';

const Video = model('Video', new Schema({
  title: String,
  url: String,
  createdAt: String,
  comments: [Comment]
}));

export default Video;
