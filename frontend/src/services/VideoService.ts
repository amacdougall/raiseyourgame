import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GET_VIDEO } from '../graphql/queries';
import { CREATE_VIDEO, ADD_COMMENT } from '../graphql/mutations';
import { VideoInput } from '../types';

const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URI,
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

    // TODO: convert watch link to embed link if needed

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
