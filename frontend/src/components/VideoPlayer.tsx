import React from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = () => {
  // has to be included in both style and opts; not sure why
  const videoDimensions = { width: '100%', height: '100%' };

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
      />
    </div>
  );
};

export default VideoPlayer;
