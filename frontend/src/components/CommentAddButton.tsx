import React from 'react';

import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface CommentAddButtonProps {
  visible: boolean;
  onClick: () => void;
}

/**
 * 
 */
const CommentAddButton = ({visible, onClick}: CommentAddButtonProps) => {
  return (
    <Collapse in={visible} collapsedSize={0}>
      <Button onClick={onClick} variant="contained">
        <Stack>
          <Typography variant="h1">
            ADD COMMENT
          </Typography>
          <Typography variant="body1" sx={{marginTop: '1rem'}}>
            (Or hit a key!)
          </Typography>
        </Stack>
      </Button>
    </Collapse>
  );
};

export default CommentAddButton;
