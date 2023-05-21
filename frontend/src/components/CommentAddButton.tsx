import React from 'react';
import { useTheme } from '@mui/material/styles';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { EXPAND_DURATION, EXPAND_ANIMATION_STYLE } from '../constants';
import CollapsingBox from './CollapsingBox';

interface CommentAddButtonProps {
  shown: boolean;
  showKeyboardHints: boolean;
  onClick: () => void;
}

const Box = CollapsingBox({
  duration: EXPAND_DURATION,
  animationStyle: EXPAND_ANIMATION_STYLE
});

/**
 * 
 */
const CommentAddButton = ({shown, showKeyboardHints, onClick}: CommentAddButtonProps) => {
  const theme = useTheme();
  const hideOnMobile = {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  };

  return (
    <Box shown={shown} sx={{width: "90%"}}>
      <Button
        onClick={onClick}
        variant="contained"
        sx={{
          borderRadius: '0.5rem', width: "100%"
        }}>
          <Typography variant="h5">
            ADD COMMENT
          </Typography>
          {showKeyboardHints ?
            <Typography variant="h5" sx={{ ...hideOnMobile }}>
              &nbsp;(or start typing)
            </Typography>
            : null
          }
      </Button>
    </Box>
  );
};

export default CommentAddButton;
