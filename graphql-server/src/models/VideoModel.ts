import { Schema, model } from 'mongoose';

interface CommentInterface {
  _id?: string;
  timecode: number;
  content: string;
  sessionId: string;
  token: string;
  username: string;
  createdAt: string;
}

export interface VideoInterface {
  _id?: string;
  title: string;
  youTubeId: string;
  createdAt: string;
  comments: CommentInterface[];
}

const commentSchema = new Schema<CommentInterface>({
  timecode: Number,
  content: String,
  sessionId: String,
  token: String,
  username: String,
  createdAt: String
});

const videoSchema = new Schema<VideoInterface>({
  title: String,
  youTubeId: String,
  createdAt: String,
  comments: [commentSchema]
});

const VideoModel = model<VideoInterface>('Video', videoSchema);

export default VideoModel;
