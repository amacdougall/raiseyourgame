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
  sessionId: String!
  username: String!
  replies: [Reply!]
  createdAt: String!
}

export interface CommentInput {
  timecode: number;
  content: string;
  sessionId: string;
  token: string;
  username: string;
}

export interface UpdateCommentInput {
  content: string;
  token: string;
}

export type Reply {
  id: ID!
  content: String!
  sessionId: String!
  username: String!
  createdAt: String!
}

export interface ReplyInput {
  content: string;
  sessionId: string;
  token: string;
  username: string;
}

export interface UpdateReplyInput {
  content: string;
  token: string;
}
