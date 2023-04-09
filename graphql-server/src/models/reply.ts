import { Schema, model } from 'mongoose';

const Reply = model('Reply', new Schema({
  content: String,
  createdAt: String,
}));

export default Reply;
