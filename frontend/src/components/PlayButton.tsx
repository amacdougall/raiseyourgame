/** @jsxImportSource @emotion/react */
import React from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { EXPAND_DURATION, EXPAND_ANIMATION_STYLE } from '../constants';
import CollapsingBox from './CollapsingBox';

interface PlayButtonProps {
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
const PlayButton = ({shown, onClick}: PlayButtonProps) => {
  return (
    <Box shown={shown} sx={{ width: "90%" }}>
      <Button
        onClick={onClick}
        variant="contained"
        sx={{ borderRadius: '0.5rem', width: "100%" }}>
        <Stack>
          <Typography variant="h5">
            PLAY
          </Typography>
        </Stack>
      </Button>
    </Box>
  );
};

export default PlayButton;
