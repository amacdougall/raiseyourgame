import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from '@apollo/server';
import { GraphQLError } from 'graphql';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

import { readFileSync } from 'fs';
const typeDefs = readFileSync('./src/schema.graphql', {encoding: 'utf8'});

import VideoModel from './models/VideoModel.js';
import { VideoInterface } from './models/VideoModel.js';
import {
  Video,
  Comment,
  Resolvers,
  VideoInput,
  CommentInput,
  DeleteCommentInput,
  QueryVideoArgs,
  MutationCreateVideoArgs,
  MutationAddCommentArgs,
  MutationDeleteCommentArgs,
} from './generated/graphql';
import { videoModelToGraphQL } from './utils/typeConversions.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI === undefined) {
  throw new Error('MONGODB_URI is not defined; cannot start server');
}
// TODO: ...should it be necessary to select a database?

// TODO: put resolvers in a different file
const resolvers = {
  Query: {
    videos: async (): Promise<Video[]> => {
      const videoModels = await VideoModel.find({});
      return videoModels.map(videoModelToGraphQL);
    },

    video: async (_: Video, { videoId }: QueryVideoArgs): Promise<Video> => {
      const videoModel = await VideoModel.findById(videoId);
      if (videoModel === null) {
        throw new GraphQLError('Video not found', {
          extensions: { code: 'VIDEO_NOT_FOUND' }
        });
      }
      return videoModelToGraphQL(videoModel);
    }
  },

  Mutation: {
    createVideo: async (
      _: Video,
      { input }: MutationCreateVideoArgs
    ): Promise<Video> => {
      const url = input.url;
      // extract YouTube video id from url
      let youTubeId: string | null = '';
      if (url.indexOf('youtube.com/watch?v=') !== -1) {
        const urlObject = new URL(url);
        youTubeId = urlObject.searchParams.get('v');
      } else if (url.indexOf('youtu.be/') !== -1) {
        const urlObject = new URL(url);
        youTubeId = urlObject.pathname.split('/')[1].split('?')[0].split('#')[0];
      } else if (url.indexOf('youtube.com/embed/') !== -1) {
        youTubeId = url.split('/embed/')[1].split('?')[0].split('#')[0];
      }

      if (youTubeId === null) {
        throw new GraphQLError('Invalid YouTube URL', {
          extensions: { code: 'INVALID_YOUTUBE_URL' }
        });
      }

      const video = new VideoModel({
        ...input,
        createdAt: new Date().toISOString()
      });
      await video.save();
      return videoModelToGraphQL(video);
    },

    addComment: async (_: Video, { videoId, input }: MutationAddCommentArgs) => {
      const video = await VideoModel.findById(videoId);
      if (video === null) {
        throw new GraphQLError('Video not found', {
          extensions: { code: 'VIDEO_NOT_FOUND' }
        });
      }
      video.comments.push({
        ...input, createdAt: new Date().toISOString()
      });
      await video.save();
      return videoModelToGraphQL(video);
    },

    /**
     * Delete a comment from a video. Only the comment author or video owner
     * may delete a comment; otherwise, throws UNAUTHORIZED.
     */
    deleteComment: async (_: Video, {
      videoId,
      commentId,
      input: { token }
    }: MutationDeleteCommentArgs) => {
      const video = await VideoModel.findById(videoId);
      if (video === null) {
        throw new GraphQLError('Video not found', {
          extensions: { code: 'VIDEO_NOT_FOUND' }
        });
      }

      const comment = video.comments.id(commentId);

      if (comment === undefined || comment === null) {
        throw new GraphQLError('Comment not found', {
          extensions: { code: 'COMMENT_NOT_FOUND' }
        });
      } else if (![comment.token, video.token].some(t => t === token)) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 'UNAUTHORIZED' }
        });
      }

      comment.deleteOne();
      await video.save();
      return videoModelToGraphQL(video);
    }
  }
};

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Apollo connected to MongoDB!'))
  .catch(err => console.log(`Apollo failed to connect to MongoDB on ${MONGODB_URI}: ${err.message}`));

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 server ready at ${url}!`);
