import React from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { EXPAND_DURATION, EXPAND_ANIMATION_STYLE } from '../constants';
import CollapsingBox from './CollapsingBox';

interface CommentAddButtonProps {
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
const CommentAddButton = ({shown, onClick}: CommentAddButtonProps) => {
  return (
    <Box shown={shown}>
      <Button
        onClick={onClick}
        variant="contained"
        sx={{
          borderRadius: '0.5rem',
        }}>
        <Stack>
          <Typography variant="h1">
            ADD COMMENT
          </Typography>
          <Typography variant="body1" sx={{marginTop: '1rem'}}>
            (Or just start typing!)
          </Typography>
        </Stack>
      </Button>
    </Box>
  );
};

export default CommentAddButton;
