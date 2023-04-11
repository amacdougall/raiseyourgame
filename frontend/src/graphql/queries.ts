import { gql } from '@apollo/client';

export const GET_VIDEO = gql`
  query Query($videoId: ID!) {
    video(id: $videoId) {
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
    }
  }
`;
