import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';

import Video from './models/video.js'; // no model classes for subdocuments?

// const MONGODB_URI = 'mongodb://root:example@mongodb';
const MONGODB_URI = 'mongodb://root:example@localhost:27017';
// TODO: switch based on docker/local?

// TODO: different file
const typeDefs = `#graphql
  type Video {
    id: ID!
    title: String!
    url: String!
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
    replies: [Reply!]
    createdAt: String!
  }

  input CommentInput {
    timecode: Float!
    content: String!
  }

  input UpdateCommentInput {
    content: String!
  }

  type Reply {
    id: ID!
    content: String!
    createdAt: String!
  }

  input ReplyInput {
    content: String!
  }

  type Query {
    videos: [Video]
    video(id: ID!): Video
  }

  type Mutation {
    createVideo(input: VideoInput!): Video

    addComment(videoId: ID!, input: CommentInput!): Video
    updateComment(videoId: ID!, commentId: ID!, input: UpdateCommentInput!): Video
    deleteComment(videoId: ID!, commentId: ID!): Video

    addReply(videoId: ID!, commentId: ID!, input: ReplyInput!): Video
    updateReply(videoId: ID!, commentId: ID!, replyId: ID!, input: ReplyInput!): Video
    deleteReply(videoId: ID!, commentId: ID!, replyId: ID!): Video
  }
`;

// TODO: put resolvers in a different file
const resolvers = {
  Query: {
    videos: async () => {
      return await Video.find({});
    },

    video: async (_, { id }) => {
      return await Video.findById(id);
    }
  },

  Mutation: {
    createVideo: async (_, { input: { title, url }}) => {
      const video = new Video({ title, url });
      await video.save();
      return video;
    },

    addComment: async (_, { videoId, input: { timecode, content } }) => {
      const video = await Video.findById(videoId);
      video.comments.push({
        timecode,
        content,
        createdAt: new Date().toISOString()
      });
      await video.save();
      return video;
    },

    updateComment: async (_, { videoId, commentId, input: { content } }) => {
      const video = await Video.findById(videoId);
      const comment = video.comments.id(commentId);
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
