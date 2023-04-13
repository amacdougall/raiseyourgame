import React from 'react';
import { Form, useLoaderData } from 'react-router-dom';
import CommentView from './components/CommentView';

const Video = () => {
  const { video } = useLoaderData();

  const comments = video.comments.map((comment) => {
    const editable = comment.sessionId === localStorage.getItem('sessionId');
    return (
      <CommentView
        key={comment.id}
        comment={comment}
        editable={editable}
      />
    );
  });

  return (
    <div>
      <h1>Title: {video.title}</h1>
      <p>URL: {video.url}</p>
      <h2>Comments</h2>
      <div>{comments}</div>
      <h2>Add a comment</h2>
      <Form name="createComment" action={`/video/${video.id}/comment`} method="post">
        <div>
        <label>Timecode:
          <input type="text" name="commentTimecode" id="commentTimecode" />
        </label>
        </div>
        <div>
          <label htmlFor="commentContent">Comment:</label>
          <textarea name="commentContent" id="commentContent"></textarea>
        </div>
        <button type="submit">Post</button>
      </Form>
    </div>
  );
};

export default Video;
