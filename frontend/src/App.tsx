import React from 'react';
import Container from '@mui/material/Container';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Home from './Home';
import VideoPage from './VideoPage';
import VideoService from './services/VideoService';

if (localStorage.getItem('sessionId') === null) {
  localStorage.setItem('sessionId', uuidv4());
}

if (localStorage.getItem('token') === null) {
  localStorage.setItem('token', uuidv4());
}

if (localStorage.getItem('username') === null) {
  localStorage.setItem('username', 'Anonymous');
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/video',
    element: <Home />,
    action: async ({ request }) => {
      const formData = await request.formData();
      const videoUrl = formData.get('videoUrl') as string;
      const videoTitle = formData.get('videoTitle') as string;

      if (videoUrl !== null && videoTitle !== null) {
        const { data } = await VideoService.createVideo({
          url: videoUrl,
          title: videoTitle
        });

        return redirect(`/video/${data.createVideo.id}`);
      }
    }
  },
  {
    path: '/video/:videoId',
    element: <VideoPage />,
    loader: async ({ params }) => {
      const { data } = await VideoService.getVideo(params.videoId);
      return { video: data.video };
    }
  },
  {
    path: '/video/:videoId/comment',
    element: <VideoPage />,
    action: async ({ params, request }) => {
      const formData = await request.formData();
      const timecode = parseFloat(formData.get('timecode'));
      const content = formData.get('content');

      const { data } = await VideoService.addComment(
        params.videoId,
        {
          timecode,
          content,
          sessionId: localStorage.getItem('sessionId'),
          token: localStorage.getItem('token'),
          username: localStorage.getItem('username')
        }
      );

      // don't actually go to this POST url
      return redirect(`/video/${params.videoId}`);
    }
  }
]);

function App() {
  return (
    <Container disableGutters maxWidth={false} sx={{
      margin: 0
    }}>
      <RouterProvider router={router} />
    </Container>
  );
}

export default App;
