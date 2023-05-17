import React from 'react';
import { useState } from 'react';
import useInterval from '../hooks/useInterval';

import Box from '@mui/material/Box';
import YouTube from 'react-youtube';

import { Video } from '../generated/graphql';

interface OnProgressArguments {
  time: number;
  duration: number;
}

interface VideoPlayerProps {
  video: Video;
  onReady?: (player: YT.Player) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  onProgress?: ({time, duration}: OnProgressArguments) => void;
  onPlayerFocus?: () => void;
  onPlayerFocusOut?: () => void;
}

// NOTE: I tried installing @types/youtube and referencing it in tsconfig.json,
// but it didn't supply the YT.PlayerState enum; I tapped out for now.
const PlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5
};

/**
 * VideoPlayer for YouTube videos. Accepts YouTube video ID.

 * Currently uses YouTube IFrame API, but we might move to an HTML5 player with
 * an iframe fallback. We're hiding implementation details; you might notice
 * that the YouTube API has no onProgress event, for instance. We're polling
 * during playback to generate this event.
 *
 * @param {string} video: YouTube video ID
 * @param {function} onReady: receives kwarg 'duration'
 * @param {function} onPlay: no args
 * @param {function} onPause: no args
 * @param {function} onEnd: no args
 * @param {function} onProgress: receives kwargs 'time', 'duration'
 * @param {function} onPlayerFocus: no args
 * @param {function} onPlayerFocusOut: no args
 */
const VideoPlayer = ({
  video, onReady, onPlay, onPause, onEnd, onProgress,
  onPlayerFocus, onPlayerFocusOut
}: VideoPlayerProps) => {
  const [ player, setPlayer ] = useState<YT.Player | null>(null);
  const [ activeElement, setActiveElement ] = useState<Element | null>(null);
  const [ playerState, setPlayerState ] = useState<YT.PlayerState>(PlayerState.UNSTARTED);
  const [ progressInterval, setProgressInterval ] = useState(null);

  useInterval(() => {
    if (player === null) {
      return;
    };
    player && onProgress && onProgress({
      time: player.getCurrentTime(),
      duration: player.getDuration()
    });
  }, playerState === PlayerState.PLAYING ? 200 : null);

  useInterval(() => {
    if (activeElement !== window.document.activeElement) {
      const playerFrame = document.getElementById('video-player');
      if (activeElement === playerFrame) {
        onPlayerFocusOut && onPlayerFocusOut();
      } else if (window.document.activeElement === playerFrame) {
        onPlayerFocus && onPlayerFocus();
      }
      setActiveElement(window.document.activeElement);
    }
  }, player ? 1000 : null); // TODO: a bit faster

  const onStateChange = (event: YT.OnStateChangeEvent) => setPlayerState(event.data);

  // has to be included in both style and opts; not sure why
  const videoDimensions = { width: '100%', height: '100%' };

  return (
    <Box style={{position: 'relative', margin: 0, paddingBottom: '56.25%', height: 0}}>
      <YouTube
        id='video-player'
        videoId={video.youTubeId}
        style={{
          ...videoDimensions,
          position: 'absolute',
          top: 0,
          left: 0
        }}
        opts={{
          ...videoDimensions,
          frameBorder: 0
        }}
        onReady={event => {
          setPlayer(event.target);
          onReady && onReady(event.target);
        }}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={onEnd}
        onStateChange={onStateChange}
      />
    </Box>
  );
};

export default VideoPlayer;
