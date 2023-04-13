import React from 'react';

// TODO: business logic to handle YouTube video player events

const VideoPlayer = () => {
  return (
    <div style={{position: 'relative', margin: 0, paddingBottom: '56.25%', height: 0}}>
      <iframe
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        src="https://www.youtube.com/embed/xSjcLZ-btfY" title="YouTube video player" 
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen>
      </iframe>
    </div>
  );
}

export default VideoPlayer;
