import React from 'react';

import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/**
 * 
 */
const GoButton = ({visible, onClick}) => {
  return (
    <Collapse in={visible} collapsedSize={0}>
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
    </Collapse>
  );
};

export default GoButton;
