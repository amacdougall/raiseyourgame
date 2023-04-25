/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Comment = {
  __typename?: 'Comment';
  content: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  sessionId: Scalars['String'];
  timecode: Scalars['Float'];
  token: Scalars['String'];
  username: Scalars['String'];
};

export type CommentInput = {
  content: Scalars['String'];
  sessionId: Scalars['String'];
  timecode: Scalars['Float'];
  token: Scalars['String'];
  username: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addComment?: Maybe<Video>;
  createVideo?: Maybe<Video>;
  deleteComment?: Maybe<Video>;
  updateComment?: Maybe<Video>;
};


export type MutationAddCommentArgs = {
  input: CommentInput;
  videoId: Scalars['ID'];
};


export type MutationCreateVideoArgs = {
  input: VideoInput;
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['ID'];
  videoId: Scalars['ID'];
};


export type MutationUpdateCommentArgs = {
  commentId: Scalars['ID'];
  input: UpdateCommentInput;
  videoId: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  video?: Maybe<Video>;
  videos?: Maybe<Array<Maybe<Video>>>;
};


export type QueryVideoArgs = {
  videoId: Scalars['ID'];
};

export type UpdateCommentInput = {
  content: Scalars['String'];
  token: Scalars['String'];
};

export type Video = {
  __typename?: 'Video';
  comments: Array<Comment>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  title: Scalars['String'];
  youTubeId: Scalars['String'];
};

export type VideoInput = {
  title: Scalars['String'];
  url: Scalars['String'];
};

export type CreateVideoMutationMutationVariables = Exact<{
  input: VideoInput;
}>;


export type CreateVideoMutationMutation = { __typename?: 'Mutation', createVideo?: { __typename?: 'Video', id: string, title: string, youTubeId: string, createdAt: string, comments: Array<{ __typename?: 'Comment', id: string, timecode: number, content: string, sessionId: string, username: string, createdAt: string }> } | null };

export type AddCommentMutationMutationVariables = Exact<{
  videoId: Scalars['ID'];
  input: CommentInput;
}>;


export type AddCommentMutationMutation = { __typename?: 'Mutation', addComment?: { __typename?: 'Video', id: string, title: string, youTubeId: string, createdAt: string, comments: Array<{ __typename?: 'Comment', id: string, timecode: number, content: string, sessionId: string, username: string, createdAt: string }> } | null };

export type QueryQueryVariables = Exact<{
  videoId: Scalars['ID'];
}>;


export type QueryQuery = { __typename?: 'Query', video?: { __typename?: 'Video', id: string, title: string, youTubeId: string, createdAt: string, comments: Array<{ __typename?: 'Comment', id: string, timecode: number, content: string, sessionId: string, username: string, createdAt: string }> } | null };


export const CreateVideoMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVideoMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VideoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"youTubeId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timecode"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<CreateVideoMutationMutation, CreateVideoMutationMutationVariables>;
export const AddCommentMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddCommentMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"videoId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"videoId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"videoId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"youTubeId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timecode"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<AddCommentMutationMutation, AddCommentMutationMutationVariables>;
export const QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Query"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"videoId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"video"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"videoId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"videoId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"youTubeId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timecode"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<QueryQuery, QueryQueryVariables>;