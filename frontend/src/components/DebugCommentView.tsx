import React from 'react';
// import { Comment } from './types';

/**
 * Plain comment view for debugging.
 */
const DebugCommentView = ({comment, editable}) => {
  return (
    <div>
      <p>{comment.content}</p>
      <p>at {comment.createdAt}</p>
      { editable ? <p>can edit!</p> : <p>cannot edit</p> }
    </div>
  );
  // TODO: edit button for creator; delete button for creator/admins
}

export default DebugCommentView;
