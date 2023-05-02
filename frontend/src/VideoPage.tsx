import React from 'react';
import { useState, useEffect } from 'react';
import { Form, useLoaderData } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ChangeUsername from './components/ChangeUsername';
import CommentAdd from './components/CommentAdd';
import CommentAddButton from './components/CommentAddButton';
import CommentView from './components/CommentView';
import DebugCommentView from './components/DebugCommentView';
import GoButton from './components/GoButton';
import Timeline from './components/Timeline';
import VideoPlayer from './components/VideoPlayer';
import { Video } from './generated/graphql';

const APPLICATION_STATE = {
  READY: 'READY',
  REVIEWING: 'REVIEWING',
  COMMENTING: 'COMMENTING',
  CHANGING_USERNAME: 'CHANGING_USERNAME',
};

/**
 * Page containing video player and comments.
 */
const VideoPage = () => {
  /* TODO: If react-router can't support types for this without blindly
   * optimistic type casting or painful workarounds like:
   * https://github.com/remix-run/react-router/discussions/9792#discussioncomment-4809811
   * ...then maybe switch off of it?
   */
  const video: Video = useLoaderData() as Video;
  const [ player, setPlayer ] = useState<YT.Player | null>(null);
  const [ playbackTime, setPlaybackTime ] = useState(0);
  const [ videoDuration, setVideoDuration ] = useState(100);
  const [ applicationState, setApplicationState ] = useState(APPLICATION_STATE.READY);
  const [ previousApplicationState, setPreviousApplicationState ] = useState(applicationState);
  const [ iframePollingInterval, setIframePollingInterval ] = useState(null);

  useEffect(() => {
    // defined within useEffect to get latest state variables
    const onKeyDown = (event: KeyboardEvent) => {
      // cancel PgDn effect of spacebar
      if (event.key === ' ') {
        event.preventDefault();
      }

      if (applicationState === APPLICATION_STATE.REVIEWING) {
        pauseForComment();
      }
    };

    document.body.addEventListener('keydown', onKeyDown);
    return () => document.body.removeEventListener('keydown', onKeyDown);

    // switch to username select if not defined (first-run experience)
    if (localStorage.getItem('username') === 'Anonymous') {
      enterApplicationState(APPLICATION_STATE.CHANGING_USERNAME);
    }
  }, [applicationState]);

  const onReady = (player: YT.Player) => {
    setPlayer(player);
    setVideoDuration(player.getDuration());
  };

  const onPlayerFocus = () => {
    // when player is focused, we can't receive keyboard input, so commenting
    // won't work; switch to READY state to display GoButton
    enterApplicationState(APPLICATION_STATE.READY);
  };

  const onGoButtonClick = () => {
    // NOTE: hidden button can retain focus and be "clicked" by Enter
    // keystroke; so limit this behavior to the READY state.
    if (applicationState == APPLICATION_STATE.READY) {
      beginReviewing();
    }
  };

  const enterApplicationState = (desiredState: string) => {
    if (player === null || applicationState === desiredState) {
      return;
    }

    // perform state-specific behaviors here
    switch (desiredState) {
      case APPLICATION_STATE.REVIEWING:
        player.playVideo();
        break;
      case APPLICATION_STATE.COMMENTING:
        player.pauseVideo();
        break;
      case APPLICATION_STATE.CHANGING_USERNAME:
        setPreviousApplicationState(applicationState);
        player.pauseVideo();
        break;
    }

    setApplicationState(desiredState);
  };

  const beginReviewing = () => enterApplicationState(APPLICATION_STATE.REVIEWING);
  const pauseForComment = () => enterApplicationState(APPLICATION_STATE.COMMENTING);
  const pauseForUsernameChange = () => enterApplicationState(APPLICATION_STATE.CHANGING_USERNAME);
  const resumePreviousState = () => enterApplicationState(previousApplicationState);

  const changeUsername = (username: string) => {
    localStorage.setItem('username', username);
    console.log("Set username to " + username);
    console.log("Resuming application state " + previousApplicationState);
    setApplicationState(previousApplicationState);
  };

  const debugComments = video.comments.map(comment => {
    const editable = [comment.sessionId, video.sessionId].some(id => {
      return id == localStorage.getItem('sessionId');
    });
    return (
      <DebugCommentView
        key={comment.id}
        comment={comment}
        editable={editable}
      />
    );
  });

  const comments = video.comments.map(comment => {
    const editable = [comment.sessionId, video.sessionId].some(id => {
      return id == localStorage.getItem('sessionId');
    });
    return (
      <CommentView
        key={comment.id}
        video={video}
        comment={comment}
        editable={editable}
        playbackTime={playbackTime}
      />
    );
  });

  return (
    <Box sx={{
      maxWidth: '100vh',
      margin: 'auto'
    }}>
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
          visible={applicationState === APPLICATION_STATE.READY}
          onClick={onGoButtonClick}
        />
        <CommentAddButton
          visible={applicationState === APPLICATION_STATE.REVIEWING}
          onClick={pauseForComment}
        />
        <CommentAdd
          key="commentAdd"
          video={video}
          playbackTime={playbackTime}
          visible={applicationState === APPLICATION_STATE.COMMENTING}
          onSubmit={beginReviewing}
          onCancel={beginReviewing}
          onNameChangeRequest={pauseForUsernameChange}
        />
        <ChangeUsername
          key="changeUsername"
          username={localStorage.getItem('username') as string}
          visible={applicationState === APPLICATION_STATE.CHANGING_USERNAME}
          onSubmit={changeUsername}
          onCancel={resumePreviousState}
        />
        {comments}
      </Stack>
      <Grid id="debugCommentGrid" container spacing={1}
        sx={{
          marginLeft: '1rem',
          width: '80vw'
        }}>
        <Grid item xs={12} sx={{marginTop: '5rem'}}>
          <hr />
          <h2>Debug: Comment State: {applicationState}</h2>
          <h2>Debug: active item: {document.activeElement?.tagName}</h2>
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

export default VideoPage;
