import { gql } from '@apollo/client';

export const CREATE_VIDEO = gql`
  mutation Mutation($input: VideoInput!) {
    createVideo(input: $input) {
      id
      title
      url
      comments {
        id
        timecode
        content
        replies {
          id
          content
          createdAt
        }
        createdAt
      }
      createdAt
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation Mutation($videoId: ID!, $input: CommentInput!) {
    addComment(videoId: $videoId, input: $input) {
      id
      title
      url
      comments {
        id
        timecode
        content
        replies {
          id
          content
          createdAt
        }
        createdAt
      }
      createdAt
    }
  }
`;
