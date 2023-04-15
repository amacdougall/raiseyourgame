// typescript interface for Video object
export interface Video {
  id: string;
  title: string;
  youTubeId: string;
  comments: Comment[];
  createdAt: string;
}

export interface VideoInput {
  title: string;
  url: string;
}

export interface Comment {
  id: string;
  timecode: number;
  content: string;
  sessionId: string;
  username: string;
  replies: Reply[];
  createdAt: string;
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

export interface Reply {
  id: string;
  content: string;
  sessionId: string;
  username: string;
  createdAt: string;
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
