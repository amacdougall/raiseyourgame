import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import RaiseYourGameAPI from './raiseyourgame-api.js';
// this import needs to refer to the runtime filename (with the .js extension);
// see https://stackoverflow.com/a/65975356.

interface ContextValue {
  dataSources: {
    raiseYourGameAPI: RaiseYourGameAPI
  }
}

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  type Video {
    title: String
    url: String
  }

  type Message {
    message: String
  }

  type Query {
    videos: [Video]
    helloWorld: Message
  }
`;

const resolvers = {
  Query: {
    videos: async (_, __, { dataSources }) => {
      return dataSources.raiseYourGameAPI.getVideos();
    },
    helloWorld: () => {
      return { 'message': 'hello world!' };
    }
  }
};

const server = new ApolloServer<ContextValue>({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  context: async () => {
    const { cache } = server;
    return {
      dataSources: {
        raiseYourGameAPI: new RaiseYourGameAPI({ cache })
      }
    };
  },
  listen: { port: 4000 },
});

console.log(`🚀 server ready at ${url}!`);
