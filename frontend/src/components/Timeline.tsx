import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import TimelineMarker from './TimelineMarker';

import { Comment } from '../generated/graphql';
import { COMMENT_DISPLAY_DURATION } from '../constants';

interface TimelineProps {
  time: number;
  duration: number;
  comments: Comment[];
  seek: (time: number) => void;
}

const Timeline = ({time, duration, comments, seek}: TimelineProps) => {
  const markers = comments.map((comment) => {
    const position = comment.timecode / duration * 100;
    return (
      <TimelineMarker
        position={position}
        active={
          time >= comment.timecode &&
          time < comment.timecode + COMMENT_DISPLAY_DURATION
        }
        key={comment.id}
        onClick={() => seek(comment.timecode)}
      />
    );
  });

  // Thanks, Github Copilot!
  // Ironically, one of the suggested completions for the preceding comment was
  // " (not)". Guess it doesn't meet with universal acclaim.
  const onClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const playbackRatio = x / rect.width; // 0.0 to 1.0
    const time = duration * playbackRatio;
    seek(time);
  };

  return (
    <Box sx={{paddingBottom: "1rem"}}>
      <LinearProgress
        sx={{ height: 10, cursor: "pointer" }}
        variant="determinate"
        value={time / duration * 100}
        onClick={onClick}
      />
      <Box sx={{position: 'relative', marginTop: '-1px', zIndex: '10'}}>
        {markers}
      </Box>
    </Box>
  );
};

export default Timeline;
