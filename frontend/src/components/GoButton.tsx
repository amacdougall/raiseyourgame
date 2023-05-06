/** @jsxImportSource @emotion/react */
import React from 'react';
import { css, keyframes } from '@emotion/react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import BoxWithTransition from './BoxWithTransition';

interface GoButtonProps {
  shown: boolean;
  onClick: () => void;
}

const Box = BoxWithTransition({
  property: "height",
  startValue: "0rem",
  endValue: "11rem",
  duration: "0.5s",
  animationStyle: "ease-out"
});

/**
 * 
 */
const GoButton = ({shown, onClick}: GoButtonProps) => {
  return (
    <Box shown={shown} >
      <Button onClick={onClick} variant="contained">
        <Stack>
          <Typography variant="h1">
            BEGIN
          </Typography>
          <Typography variant="body1" sx={{marginTop: '1rem'}}>
            (Seriously, click this button to start commenting.)
          </Typography>
        </Stack>
      </Button>
    </Box>
  );
};

export default GoButton;
