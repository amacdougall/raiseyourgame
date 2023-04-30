import { Schema, Types, Model, model } from 'mongoose';

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

// NOTE: https://mongoosejs.com/docs/typescript/subdocuments.html 
// Without this complex type dance, video.comments will not have mongoose
// methods like .id and .deleteOne. (ORMs can be more trouble than they're
// worth, exhibit seven million.)
type VideoDocumentProps = {
  comments: Types.DocumentArray<CommentInterface>;
};

type VideoModelType = Model<VideoInterface, {}, VideoDocumentProps>;

const VideoModel = model<VideoInterface, VideoModelType>(
  'Video',
  new Schema<VideoInterface, VideoModelType>({
    title: String,
    youTubeId: String,
    createdAt: String,
    comments: [commentSchema]
  })
);

export default VideoModel;
