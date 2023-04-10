import React from 'react';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';

const Video = () => {
  return (
    <Container sx={{
      margin: 'auto',
      width: '100%'
    }}>
      <h1>Video page</h1>
      <Link to={'/'}>Link to home page</Link>
    </Container>
  );
};

export default Video;
