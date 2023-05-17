import React from 'react';
import { Form } from 'react-router-dom';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import VideoService from './services/VideoService';

const HomePage = () => {
  const [videoUrl, setVideoUrl] = React.useState('');
  const [videoTitle, setVideoTitle] = React.useState('');

  return (
    <Stack spacing={2} sx={{
      maxWidth: '100vh',
      margin: 'auto',
      padding: '1rem',
    }}>
      <Typography variant="h1">
        Raise Your Game
      </Typography>

      <Typography variant="body1">
        Comment on a YouTube video, or get feedback from others.
      </Typography>

      <Typography variant="body1">
        TODO: add a few screenshots showing the process of commenting on a video.
      </Typography>

      <Typography variant="h2">
        Ready to get started?
      </Typography>

      <Typography variant="body1">
        Paste a YouTube URL below. Add a title if you don't like the one on YouTube.
      </Typography>

      <Form name="createVideo" action="/video" method="post">
        <Stack direction="row" spacing={2}>
          { /* TODO: validate URL */ }
          <TextField
            sx={{ width: '25%' }}
            label="YouTube URL"
            name="videoUrl"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
          />
          <TextField
            sx={{ width: '25%' }}
            label="Video Title"
            name="videoTitle"
            value={videoTitle}
            placeholder="leave blank to use YouTube title"
            onChange={e => setVideoTitle(e.target.value)}
          />
          <Button variant="contained" type="submit">Let's Go!</Button>
        </Stack>
      </Form>
    </Stack>
  );
};

export default HomePage;
