import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import TimelineMarker from './TimelineMarker';

import { Comment } from '../generated/graphql';

interface TimelineProps {
  time: number;
  duration: number;
  comments: Comment[];
}

const Timeline = ({time, duration, comments}: TimelineProps) => {
  const markers = comments.map((comment) => {
    const position = comment.timecode / duration * 100;
    return (
      <TimelineMarker position={position} key={comment.id} />
    );
  });

  return (
    <Box sx={{paddingBottom: '1rem'}}>
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
