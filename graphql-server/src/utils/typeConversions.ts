import { Video, Comment } from '../generated/graphql';
import { VideoInterface } from '../models/VideoModel';
import { HydratedDocument } from 'mongoose';

export const videoModelToGraphQL = (videoModel: HydratedDocument<VideoInterface>): Video => {
  return {
    id: videoModel._id,
    title: videoModel.title,
    youTubeId: videoModel.youTubeId,
    sessionId: videoModel.sessionId,
    token: videoModel.token,
    createdAt: videoModel.createdAt,
    comments: videoModel.comments.map(comment => {
      return {
        id: comment._id || '',
        timecode: comment.timecode,
        content: comment.content,
        sessionId: comment.sessionId,
        token: comment.token,
        username: comment.username,
        createdAt: comment.createdAt,
      }
    })
  };
};
