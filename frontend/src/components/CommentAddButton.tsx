import React from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import BoxWithTransition from './BoxWithTransition';

interface CommentAddButtonProps {
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
const CommentAddButton = ({shown, onClick}: CommentAddButtonProps) => {
  return (
    <Box shown={shown}>
      <Button onClick={onClick} variant="contained">
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
