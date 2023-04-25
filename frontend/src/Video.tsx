import React from 'react';
import { useState, useEffect } from 'react';
import { Form, useLoaderData } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CommentAdd from './components/CommentAdd';
import CommentAddButton from './components/CommentAddButton';
import CommentView from './components/CommentView';
import DebugCommentView from './components/DebugCommentView';
import GoButton from './components/GoButton';
import Timeline from './components/Timeline';
import VideoPlayer from './components/VideoPlayer';

const COMMENT_STATE = {
  READY: 'READY',
  REVIEWING: 'REVIEWING',
  COMMENTING: 'COMMENTING'
};

/**
 * Page containing video player and comments.
 */
const Video = () => {
  const { video } = useLoaderData();
  const [ player, setPlayer ] = useState(null);
  const [ playbackTime, setPlaybackTime ] = useState(0);
  const [ videoDuration, setVideoDuration ] = useState(100);
  const [ commentState, setCommentState ] = useState(COMMENT_STATE.READY);
  const [ iframePollingInterval, setIframePollingInterval ] = useState(null);

  useEffect(() => {
    // defined within useEffect to get latest state variables
    const onKeyDown = event => {
      // cancel PgDn effect of spacebar
      if (event.key === ' ') {
        event.preventDefault();
      }

      if (commentState === COMMENT_STATE.REVIEWING) {
        pauseForComment();
      }
    };

    document.body.addEventListener('keydown', onKeyDown);
    return () => document.body.removeEventListener('keydown', onKeyDown);
  }, [commentState]);

  const onReady = ({player}) => {
    setPlayer(player);
    setVideoDuration(player.getDuration());
  };

  const onPlayerFocus = () => {
    // when player is focused, we can't receive keyboard input, so commenting
    // won't work; switch to READY state to display GoButton
    setCommentState(COMMENT_STATE.READY);
  };

  const onGoButtonClick = () => {
    // NOTE: hidden button can retain focus and be "clicked" by Enter
    // keystroke; so limit this behavior to the READY state.
    if (commentState == COMMENT_STATE.READY) {
      beginReviewing();
    }
  };

  const beginReviewing = () => {
    if (player === null) {
      return;
    }
    player.playVideo();
    setCommentState(COMMENT_STATE.REVIEWING);
  };

  const pauseForComment = () => {
    if (player === null) {
      return;
    }
    player.pauseVideo();
    setCommentState(COMMENT_STATE.COMMENTING);
  };

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
  }).reverse();

  return (
    <Box>
      <VideoPlayer
        video={video}
        onReady={onReady}
        onPlay={() => console.log('video play')}
        onPause={() => console.log('video pause')}
        onEnd={() => console.log('video end')}
        onProgress={({time, duration}) => {
          setPlaybackTime(time);
          setVideoDuration(duration);
        }}
        onPlayerFocus={onPlayerFocus}
        onPlayerFocusOut={() => console.log('player focusOut')}
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
        <GoButton
          visible={commentState === COMMENT_STATE.READY}
          onClick={onGoButtonClick}
        />
        <CommentAddButton
          visible={commentState === COMMENT_STATE.REVIEWING}
          onClick={pauseForComment}
        />
        <CommentAdd
          key="commentAdd"
          video={video}
          playbackTime={playbackTime}
          visible={commentState === COMMENT_STATE.COMMENTING}
          onSubmit={beginReviewing}
          onCancel={beginReviewing}
        />
        {comments}
      </Stack>
      <Grid id="debugCommentGrid" container spacing={1} sx={{marginLeft: '1rem'}}>
        <Grid item xs={12} sx={{marginTop: '5rem'}}>
          <hr />
          <h2>Debug: Comment State: {commentState}</h2>
          <h2>Debug: active item: {document.activeElement.tagName}</h2>
          <h2>Debug: All Comments</h2>
          <div>{debugComments}</div>
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
            <Button type="submit">Post</Button>
          </Form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Video;
