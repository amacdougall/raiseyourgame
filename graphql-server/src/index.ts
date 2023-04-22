import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from '@apollo/server';
import { GraphQLError } from 'graphql';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';

import Video from './models/video.js'; // no model classes for subdocuments?

const MONGODB_URI = process.env.MONGODB_URI;
// TODO: ...should it be necessary to select a database?

// TODO: different file
const typeDefs = `#graphql
  type Video {
    id: ID!
    title: String!
    youTubeId: String!
    comments: [Comment!]
    createdAt: String!
  }

  input VideoInput {
    title: String!
    url: String!
  }

  type Comment {
    id: ID!
    timecode: Float!
    content: String!
    sessionId: String!
    username: String!
    token: String!
    replies: [Reply!]
    createdAt: String!
  }

  input CommentInput {
    timecode: Float!
    content: String!
    sessionId: String!
    token: String!
    username: String!
  }

  input UpdateCommentInput {
    content: String!
    token: String!
  }

  type Reply {
    id: ID!
    content: String!
    sessionId: String!
    token: String!
    username: String!
    createdAt: String!
  }

  input ReplyInput {
    content: String!
    sessionId: String!
    token: String!
    username: String!
  }

  input UpdateReplyInput {
    content: String!
    token: String!
  }

  type Query {
    videos: [Video]
    video(videoId: ID!): Video
  }

  type Mutation {
    createVideo(input: VideoInput!): Video

    addComment(videoId: ID!, input: CommentInput!): Video
    updateComment(videoId: ID!, commentId: ID!, input: UpdateCommentInput!): Video
    deleteComment(videoId: ID!, commentId: ID!): Video

    addReply(videoId: ID!, commentId: ID!, input: ReplyInput!): Video
    updateReply(videoId: ID!, commentId: ID!, replyId: ID!, input: UpdateReplyInput!): Video
    deleteReply(videoId: ID!, commentId: ID!, replyId: ID!): Video
  }
`;

// TODO: put resolvers in a different file
const resolvers = {
  Query: {
    videos: async () => {
      return await Video.find({});
    },

    video: async (_, { videoId }) => {
      return await Video.findById(videoId);
    }
  },

  Mutation: {
    createVideo: async (_, { input: { title, url }}) => {
      // extract YouTube video id from url
      let youTubeId = '';
      if (url.indexOf('youtube.com/watch?v=') !== -1) {
        const urlObject = new URL(url);
        youTubeId = urlObject.searchParams.get('v');
      } else if (url.indexOf('youtu.be/') !== -1) {
        const urlObject = new URL(url);
        youTubeId = urlObject.pathname.split('/')[1].split('?')[0].split('#')[0];
      } else if (url.indexOf('youtube.com/embed/') !== -1) {
        youTubeId = url.split('/embed/')[1].split('?')[0].split('#')[0];
      } else {
        throw new GraphQLError('Invalid YouTube URL', {
          extensions: { code: 'INVALID_YOUTUBE_URL' }
        });
      }

      const video = new Video({
        title,
        youTubeId,
        createdAt: new Date().toISOString()
      });
      await video.save();
      return video;
    },

    addComment: async (_, {
      videoId,
      input: { timecode, content, sessionId, token, username }
    }) => {
      const video = await Video.findById(videoId);
      video.comments.push({
        timecode, content, sessionId, token, username,
        createdAt: new Date().toISOString()
      });
      await video.save();
      return video;
    },

    updateComment: async (_, { videoId, commentId, input: { content, token } }) => {
      const video = await Video.findById(videoId);
      const comment = video.comments.id(commentId);
      if (comment.token !== token) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 'UNAUTHORIZED' }
        });
      }
      comment.content = content;
      await video.save();
      return video;
    }
  }
};

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Apollo connected to MongoDB!'))
  .catch(err => console.log(`Apollo failed to connect to MongoDB: ${err.message}`));

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 server ready at ${url}!`);
