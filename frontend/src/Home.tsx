import React from 'react';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container sx={{
      margin: 'auto',
      width: '100%'
    }}>
      <h1>Home page</h1>
      <Link to={'/video/1'}>Link to video page</Link>
    </Container>
  );
};

export default Home;
