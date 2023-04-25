import { gql } from '@apollo/client';

export const GET_VIDEO = gql`
  query Query($videoId: ID!) {
    video(videoId: $videoId) {
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
