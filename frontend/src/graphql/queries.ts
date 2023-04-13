import { gql } from '@apollo/client';

export const GET_VIDEO = gql`
  query Query($videoId: ID!) {
    video(id: $videoId) {
      id
      title
      url
      createdAt
      comments {
        id
        timecode
        content
        sessionId
        username
        createdAt
        replies {
          id
          content
          sessionId
          username
          createdAt
        }
      }
    }
  }
`;
