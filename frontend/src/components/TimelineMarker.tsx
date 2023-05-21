import React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { css } from '@emotion/react';

interface TimelineMarkerProps {
  position: number;
  active: boolean;
  onClick: () => void;
}

const TimelineMarker = ({position, active, onClick}: TimelineMarkerProps) => {
  const theme = useTheme();
  const width = 10;
  const height = 15;

  const points: Array<[number, number]> = [
    [width / 2, 0], // upper tip
    [width, height / 3], // NE
    [width, height], // SE
    [0, height], // SW
    [0, height / 3], // NW
    [width / 2, 0] // upper tip
  ];

  const pointString = points
    .map(([x, y]) => Math.round(x) + ',' + Math.round(y))
    .join(' ');

  {/* Could probably figure out how to apply these styles with
      emotion, but it just didn't seem like it was worth it. */}
  const inactiveStyle = {
    transition: 'transform 0.5s ease-out',
  };

  const activeStyle = {
    transition: 'transform 0.5s ease-out',
    transform: 'scale(1.25)'
  };

  return (
    <Box 
      sx={{
        cursor: 'pointer',
        position: 'absolute',
        left: position + '%',
        marginLeft: -(width / 2) + 'px',
      }}
      onClick={onClick}
    >
      <svg
        style={active ? activeStyle : inactiveStyle}
        version='1.1'
        width={width}
        height={height}
        xmlns='http://www.w3.org/2000/svg'>
        <polyline
          points={pointString}
          fill={
            active ?
              theme.palette.primary.main :
              theme.palette.primary.light
          }
        />
      </svg>
    </Box>
  );
};

export default TimelineMarker;
