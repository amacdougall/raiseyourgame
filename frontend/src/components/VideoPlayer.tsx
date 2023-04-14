import React from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = ({
  onReady, onPlay, onPause, onEnd, onProgress
}) => {
  // has to be included in both style and opts; not sure why
  const videoDimensions = { width: '100%', height: '100%' };

  let progressInterval = null;

  const startReportingProgress = (event) => {
    // event.target is the YT.Player instance
    progressInterval = setInterval(() => {
      onProgress({
        time: event.target.getCurrentTime(),
        duration: event.target.getDuration()
      });
    }, 1000); // TODO: faster, of course
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

  return (
    <div style={{position: 'relative', margin: 0, paddingBottom: '56.25%', height: 0}}>
      <YouTube
        videoId="xSjcLZ-btfY"
        // no frame border
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
        onReady={onReady}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={onEnd}
        onStateChange={onStateChange}
      />
    </div>
  );
};

export default VideoPlayer;
