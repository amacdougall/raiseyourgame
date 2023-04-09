import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';

import Video from './models/video.js';
import Comment from './models/comment.js';
import Reply from './models/reply.js';

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

  type VideoInput {
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

  type CommentInput {
    timecode: Float!
    content: String!
  }

  type Reply {
    id: ID!
    content: String!
    createdAt: String!
  }

  type ReplyInput {
    content: String!
  }

  type Query {
    videos: [Video]
    video(id: ID!): Video
  }

  type Mutation {
    createVideo(input: VideoInput!): Video

    addComment(videoId: ID!, input: CommentInput!): Video
    updateComment(commentId: ID!, input: CommentInput!): Video
    deleteComment(commentId: ID!): Video

    addReply(commentId: ID!, input: ReplyInput!): Video
    updateReply(replyId: ID!, input: ReplyInput!): Video
    deleteReply(replyId: ID!): Video
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
    createVideo: async (_, { title, url }) => {
      const video = new Video({ title, url });
      await video.save();
      return video;
    },
    
    addComment: async (_, { videoId, timecode, content }) => {
      const comment = new Comment({ timecode, content });
      const video = Video.find({ id: videoId });
      video.comments.push(comment);
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
