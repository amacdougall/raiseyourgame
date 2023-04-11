import React from 'react';
// import { Comment } from './types';

const CommentView = ({comment}) => {
  return (
    <div>
      <p>{comment.content}</p>
      <p>at {comment.createdAt}</p>
    </div>
  );
  // TODO: edit button for creator; delete button for creator/admins
}

export default CommentView;
