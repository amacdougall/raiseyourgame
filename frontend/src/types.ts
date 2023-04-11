export type Video {
  id: ID!
  title: String!
  url: String!
  comments: [Comment!]
  createdAt: String!
}

export interface VideoInput {
  title: string;
  url: string;
}

export type Comment {
  id: ID!
  timecode: Float!
  content: String!
  replies: [Reply!]
  createdAt: String!
}

export type Reply {
  id: ID!
  content: String!
  createdAt: String!
}
