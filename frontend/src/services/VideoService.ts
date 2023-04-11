import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GET_VIDEO } from '../graphql/queries';
import { CREATE_VIDEO, ADD_COMMENT } from '../graphql/mutations';
import { VideoInput } from '../types';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // TODO: switch based on docker/local?
  cache: new InMemoryCache(),
});

export default class VideoService {
  static async getVideo(videoId: string) {
    const response = await client.query({
      query: GET_VIDEO,
      variables: {
        videoId,
      },
    });

    return response;
  }

  static async createVideo(videoInput: VideoInput) {
    const response = await client.mutate({
      mutation: CREATE_VIDEO,
      variables: {
        input: videoInput,
      }
    });

    return response;
  }

  static async addComment(videoId: string, commentInput: CommentInput) {
    const response = await client.mutate({
      mutation: ADD_COMMENT,
      variables: {
        videoId,
        input: commentInput,
      }
    });

    return response;
  }
}
