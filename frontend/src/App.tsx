import React from 'react';
import Container from '@mui/material/Container';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Home from './Home';
import Video from './Video';
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
      const videoUrl = formData.get('videoUrl');
      const videoTitle = formData.get('videoTitle');

      const { data } = await VideoService.createVideo({
        url: videoUrl,
        title: videoTitle
      });

      return redirect(`/video/${data.createVideo.id}`);
    }
  },
  {
    path: '/video/:videoId',
    element: <Video />,
    loader: async ({ params }) => {
      const { data } = await VideoService.getVideo(params.videoId);
      return { video: data.video };
    }
  },
  {
    path: '/video/:videoId/comment',
    element: <Video />,
    action: async ({ params, request }) => {
      const formData = await request.formData();
      const commentTimecode = parseFloat(formData.get('commentTimecode'));
      const commentContent = formData.get('commentContent');

      const { data } = await VideoService.addComment(
        params.videoId,
        {
          timecode: commentTimecode,
          content: commentContent,
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
    <Container sx={{
      margin: 'auto',
      width: '100%'
    }}>
      <RouterProvider router={router} />
    </Container>
  );
}

export default App;
