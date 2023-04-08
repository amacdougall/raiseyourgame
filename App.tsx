import React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

function App() {
  return (
    <Container sx={{
      margin: 'auto',
      width: '100%'
    }}>
      <h1>Video</h1>
      <Box sx={{
          width: '720px',
            height: '480px',
            backgroundColor: 'primary.dark'
        }}>
      </Box>
      <h2>Comments</h2>
      <div>
        <p>Comments will go here.</p>
      </div>
      <Button variant='contained'>Add comment</Button>
    </Container>
  );
}

export default App;
