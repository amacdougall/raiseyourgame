import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GET_VIDEO } from '../graphql/queries';
import { CREATE_VIDEO, ADD_COMMENT, DELETE_COMMENT } from '../graphql/mutations';
import {
  Video,
  QueryVideoArgs,
  MutationCreateVideoArgs,
  MutationAddCommentArgs,
  MutationDeleteCommentArgs
} from '../generated/graphql';

const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URI,
  cache: new InMemoryCache(),
});

export default class VideoService {
  /* NOTE: see queries/mutations files for return values; Apollo may call it
   * response.data.<nameOfMutation>, but the actual value of that key is the
   * video data.
   */
  static async getVideo(args: QueryVideoArgs): Promise<Video> {
    const response = await client.query({
      query: GET_VIDEO,
      variables: args
    });

    return response.data.video;
  }

  static async createVideo(args: MutationCreateVideoArgs): Promise<Video> {
    const response = await client.mutate({
      mutation: CREATE_VIDEO,
      variables: args
    });

    return response.data.createVideo;
  }

  static async addComment(args: MutationAddCommentArgs): Promise<Video> {
    const response = await client.mutate({
      mutation: ADD_COMMENT,
      variables: args
    });

    return response.data.addComment;
  }

  static async deleteComment(args: MutationDeleteCommentArgs): Promise<Video> {
    const response = await client.mutate({
      mutation: DELETE_COMMENT,
      variables: args
    });

    return response.data.deleteComment;
  }
}
