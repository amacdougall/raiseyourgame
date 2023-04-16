import React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

const TimelineMarker = ({position}) => {
  const theme = useTheme();
  const width = 10;
  const height = 15;

  const points = [
    [width / 2, 0], // upper tip
    [width, height / 3], // NE
    [width, height], // SE
    [0, height], // SW
    [0, height / 3], // NW
    [width / 2, 0] // upper tip
  ];

  const pointString = points
    .map(([x, y]) => parseInt(x) + ',' + parseInt(y))
    .join(' ');

  return (
    <Box sx={{
      position: 'absolute',
      left: position + '%',
      marginLeft: -(width / 2) + 'px',
    }}>
      <svg
        version='1.1'
        width={width}
        height={height}
        xmlns='http://www.w3.org/2000/svg'>
        <polyline
          points={pointString}
          fill={theme.palette.primary.main}
        />
      </svg>
    </Box>
  );
};

export default TimelineMarker;
