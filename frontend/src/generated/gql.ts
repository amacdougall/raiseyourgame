/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation CreateVideoMutation($input: VideoInput!) {\n    createVideo(input: $input) {\n      id\n      title\n      youTubeId\n      createdAt\n      comments {\n        id\n        timecode\n        content\n        sessionId\n        username\n        createdAt\n      }\n    }\n  }\n": types.CreateVideoMutationDocument,
    "\n  mutation AddCommentMutation($videoId: ID!, $input: CommentInput!) {\n    addComment(videoId: $videoId, input: $input) {\n      id\n      title\n      youTubeId\n      createdAt\n      comments {\n        id\n        timecode\n        content\n        sessionId\n        username\n        createdAt\n      }\n    }\n  }\n": types.AddCommentMutationDocument,
    "\n  mutation DeleteComment($videoId: ID!, $commentId: ID!, $input: DeleteCommentInput!) {\n    deleteComment(videoId: $videoId, commentId: $commentId, input: $input) {\n      id\n      title\n      youTubeId\n      comments {\n        id\n        timecode\n        content\n        sessionId\n        username\n        token\n        createdAt\n      }\n      createdAt\n    }\n  }\n": types.DeleteCommentDocument,
    "\n  query Query($videoId: ID!) {\n    video(videoId: $videoId) {\n      id\n      title\n      youTubeId\n      createdAt\n      comments {\n        id\n        timecode\n        content\n        sessionId\n        username\n        createdAt\n      }\n    }\n  }\n": types.QueryDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateVideoMutation($input: VideoInput!) {\n    createVideo(input: $input) {\n      id\n      title\n      youTubeId\n      createdAt\n      comments {\n        id\n        timecode\n        content\n        sessionId\n        username\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateVideoMutation($input: VideoInput!) {\n    createVideo(input: $input) {\n      id\n      title\n      youTubeId\n      createdAt\n      comments {\n        id\n        timecode\n        content\n        sessionId\n        username\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddCommentMutation($videoId: ID!, $input: CommentInput!) {\n    addComment(videoId: $videoId, input: $input) {\n      id\n      title\n      youTubeId\n      createdAt\n      comments {\n        id\n        timecode\n        content\n        sessionId\n        username\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddCommentMutation($videoId: ID!, $input: CommentInput!) {\n    addComment(videoId: $videoId, input: $input) {\n      id\n      title\n      youTubeId\n      createdAt\n      comments {\n        id\n        timecode\n        content\n        sessionId\n        username\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteComment($videoId: ID!, $commentId: ID!, $input: DeleteCommentInput!) {\n    deleteComment(videoId: $videoId, commentId: $commentId, input: $input) {\n      id\n      title\n      youTubeId\n      comments {\n        id\n        timecode\n        content\n        sessionId\n        username\n        token\n        createdAt\n      }\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteComment($videoId: ID!, $commentId: ID!, $input: DeleteCommentInput!) {\n    deleteComment(videoId: $videoId, commentId: $commentId, input: $input) {\n      id\n      title\n      youTubeId\n      comments {\n        id\n        timecode\n        content\n        sessionId\n        username\n        token\n        createdAt\n      }\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Query($videoId: ID!) {\n    video(videoId: $videoId) {\n      id\n      title\n      youTubeId\n      createdAt\n      comments {\n        id\n        timecode\n        content\n        sessionId\n        username\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query Query($videoId: ID!) {\n    video(videoId: $videoId) {\n      id\n      title\n      youTubeId\n      createdAt\n      comments {\n        id\n        timecode\n        content\n        sessionId\n        username\n        createdAt\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;