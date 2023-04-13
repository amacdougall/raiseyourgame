import React from 'react';
import { Form, useLoaderData } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

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
    <Grid container spacing={0} sx={{margin: 0}}>
      <Grid item xs={12}>
        {/* TODO: separate component */}
        <div style={{position: 'relative', margin: 0, paddingBottom: '56.25%', height: 0}}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            src="https://www.youtube.com/embed/xSjcLZ-btfY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      </Grid>
      <Grid item xs={12}>
        <h1>Title: {video.title}</h1>
      </Grid>
      <Grid item xs={12}>
        <h2>Comments</h2>
        <div>{comments}</div>
        <h2>Add a comment</h2>
        <Form name="createComment" action={`/video/${video.id}/comment`} method="post">
          <div>
          <label>Timecode:
            <input type="text" name="commentTimecode" id="commentTimecode" />
          </label>
          </div>
          {/* TODO: make a separate component for comment input */}
          <div>
            <label htmlFor="commentContent">Comment:</label>
            <textarea name="commentContent" id="commentContent"></textarea>
          </div>
          <Button type="submit">Post</Button>
        </Form>
      </Grid>
    </Grid>
  );
};

export default Video;
