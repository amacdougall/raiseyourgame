import React from 'react';
import Container from '@mui/material/Container';
import { Form } from 'react-router-dom';
import VideoService from './services/VideoService';

const Home = () => {
  const [videoUrl, setVideoUrl] = React.useState('');
  const [videoTitle, setVideoTitle] = React.useState('');

  return (
    <div>
      <h1>Raise Your Game</h1>
      <p>Comment on a YouTube video, or get feedback from others.</p>
      <h2>Select a video</h2>
      { /* TODO: layout/style with Material UI */ }
      <Form name="createVideo" action="/video" method="post">
        <div>
          { /* TODO: validate URL */ }
          <label>Youtube video URL:
            <input
              type="text"
              name="videoUrl"
              id="videoUrl"
              onChange={e => setVideoUrl(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>Video Title:
            <input
              type="text"
              name="videoTitle"
              id="videoTitle"
              placeholder="leave blank to use YouTube title"
              onChange={e => setVideoTitle(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Get Started!</button>
      </Form>
    </div>
  );
};

export default Home;
