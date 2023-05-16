/** @jsxImportSource @emotion/react */
import React from 'react';
import { css, keyframes } from '@emotion/react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { EXPAND_DURATION, EXPAND_ANIMATION_STYLE } from '../constants';
import CollapsingBox from './CollapsingBox';

interface GoButtonProps {
  shown: boolean;
  onClick: () => void;
}

const Box = CollapsingBox({
  duration: EXPAND_DURATION,
  animationStyle: EXPAND_ANIMATION_STYLE
});

/**
 * 
 */
const GoButton = ({shown, onClick}: GoButtonProps) => {
  return (
    <Box shown={shown} >
      <Button
        onClick={onClick}
        variant="contained"
        sx={{
          borderRadius: '0.5rem',
        }}>
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
