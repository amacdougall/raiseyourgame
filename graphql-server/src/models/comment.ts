import { Schema, model } from 'mongoose';
import Reply from './reply';

const Comment = model('Comment', new Schema({
  timecode: Number,
  content: String,
  createdAt: String,
  replies: [Reply]
}));

export default Comment;
