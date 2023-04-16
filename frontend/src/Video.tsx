import React from 'react';
import { useState } from 'react';
import { Form, useLoaderData } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CommentAdd from './components/CommentAdd';
import CommentView from './components/CommentView';
import DebugCommentView from './components/DebugCommentView';
import Timeline from './components/Timeline';
import VideoPlayer from './components/VideoPlayer';

/**
 * Page containing video player, comments, and replies.
 */
const Video = () => {
  const { video } = useLoaderData();
  const [ playbackTime, setPlaybackTime ] = useState(0);
  const [ videoDuration, setVideoDuration ] = useState(100);

  const debugComments = video.comments.map(comment => {
    const editable = comment.sessionId === localStorage.getItem('sessionId');
    return (
      <DebugCommentView
        key={comment.id}
        comment={comment}
        editable={editable}
      />
    );
  });

  const comments = video.comments.map(comment => {
    const editable = comment.sessionId === localStorage.getItem('sessionId');
    return (
      <CommentView
        key={comment.id}
        comment={comment}
        editable={editable}
        playbackTime={playbackTime}
      />
    );
  });

  comments.push(
    // TODO: hide CommandAdd until activated
    <CommentAdd
      key="commentAdd"
      video={video}
      playbackTime={playbackTime}
      visible={true}
    />
  );

  return (
    <React.Fragment>
      <VideoPlayer
        video={video}
        onReady={({duration}) => setVideoDuration(duration)}
        onPlay={() => console.log('video play')}
        onPause={() => console.log('video pause')}
        onEnd={() => console.log('video end')}
        onProgress={({time, duration}) => {
          setPlaybackTime(time);
          setVideoDuration(duration);
        }}
      />
      <Timeline
        time={playbackTime}
        duration={videoDuration}
        comments={video.comments}
      />
      <Stack
        spacing={0}
        justifyContent="center"
        alignItems="center"
        sx={{marginTop: '1rem'}}
      >
        {comments}
      </Stack>
      <Grid id="debugCommentGrid" container spacing={1} sx={{marginLeft: '1rem'}}>
        <Grid item xs={12} sx={{marginTop: '5rem'}}>
          <hr />
          <h2>Debug: All Comments</h2>
          <div>{debugComments}</div>
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
    </React.Fragment>
  );
};

export default Video;
