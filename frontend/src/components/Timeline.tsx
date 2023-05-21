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

  return (
    <Box sx={{paddingBottom: '1rem'}}>
      {/* handle click on LinearProgress with seek */}
      <LinearProgress
        sx={{height: 10}}
        variant="determinate"
        value={time / duration * 100}
      />
      <Box sx={{position: 'relative', marginTop: '-1px', zIndex: '10'}}>
        {markers}
      </Box>
    </Box>
  );
};

export default Timeline;
