import React from 'react';
import YouTube from 'react-youtube';

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
 */
const VideoPlayer = ({
  video, onReady, onPlay, onPause, onEnd, onProgress
}) => {
  let progressInterval = null;

  const startReportingProgress = (event) => {
    // event.target is the YT.Player instance
    progressInterval = setInterval(() => {
      onProgress({
        time: event.target.getCurrentTime(),
        duration: event.target.getDuration()
      });
    }, 200);
  };

  const stopReportingProgress = () => clearInterval(progressInterval);

  const onStateChange = (event) => {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        startReportingProgress(event);
        break;
      case YT.PlayerState.PAUSED:
      case YT.PlayerState.ENDED:
      case YT.PlayerState.BUFFERING:
        stopReportingProgress();
        break;
    }
  };

  // has to be included in both style and opts; not sure why
  const videoDimensions = { width: '100%', height: '100%' };

  return (
    <div style={{position: 'relative', margin: 0, paddingBottom: '56.25%', height: 0}}>
      <YouTube
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
        onReady={event => onReady({duration: event.target.getDuration()})}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={onEnd}
        onStateChange={onStateChange}
      />
    </div>
  );
};

export default VideoPlayer;
