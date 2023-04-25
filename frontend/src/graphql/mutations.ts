import { gql } from '@apollo/client';

export const CREATE_VIDEO = gql`
  mutation CreateVideoMutation($input: VideoInput!) {
    createVideo(input: $input) {
      id
      title
      youTubeId
      createdAt
      comments {
        id
        timecode
        content
        sessionId
        username
        createdAt
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddCommentMutation($videoId: ID!, $input: CommentInput!) {
    addComment(videoId: $videoId, input: $input) {
      id
      title
      youTubeId
      createdAt
      comments {
        id
        timecode
        content
        sessionId
        username
        createdAt
      }
    }
  }
`;
