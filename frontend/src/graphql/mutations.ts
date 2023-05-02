import { gql } from '@apollo/client';

export const CREATE_VIDEO = gql`
  mutation CreateVideoMutation($input: VideoInput!) {
    createVideo(input: $input) {
      id
      title
      youTubeId
      sessionId
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
      sessionId
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

export const DELETE_COMMENT = gql`
  mutation DeleteComment($videoId: ID!, $commentId: ID!, $input: DeleteCommentInput!) {
    deleteComment(videoId: $videoId, commentId: $commentId, input: $input) {
      id
      title
      youTubeId
      sessionId
      createdAt
      comments {
        id
        timecode
        content
        sessionId
        username
        token
        createdAt
      }
    }
  }
`;
