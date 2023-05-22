import React from 'react';
import Container from '@mui/material/Container';
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import HomePage from './HomePage';
import VideoPage from './VideoPage';
import VideoPageErrorBoundary from './VideoPageErrorBoundary';
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
    element: <HomePage />,
  },
  {
    path: '/video',
    element: <HomePage />,
    action: async ({ request }) => {
      const formData = await request.formData();
      const videoUrl = formData.get('videoUrl') as string;
      const videoTitle = formData.get('videoTitle') as string;

      if (videoUrl !== null && videoTitle !== null) {
        const video = await VideoService.createVideo({
          input: {
            url: videoUrl,
            title: videoTitle,
            sessionId: localStorage.getItem('sessionId') as string,
            token: localStorage.getItem('token') as string
          }
        });

        return redirect(`/video/${video.id}`);
      }
    }
  },
  {
    path: '/video/:videoId',
    element: <VideoPage />,
    loader: async ({ params }) => {
      if (params.videoId === undefined) {
        throw new Error('/video/:videoId: videoId is undefined');
      }
      return await VideoService.getVideo({videoId: params.videoId});
    },
    errorElement: <VideoPageErrorBoundary />
  },
  {
    path: '/video/:videoId/comment',
    element: <VideoPage />,
    action: async ({ params, request }) => {
      if (params.videoId === undefined) {
        throw new Error('/video/:videoId/comment: videoId is undefined');
      }
      const formData = await request.formData();
      const timecode = parseFloat(formData.get('timecode') as string); // not UGC
      const content = formData.get('content') as string; // validated in VideoPage

      const video = await VideoService.addComment({
        videoId: params.videoId,
        input: {
          timecode,
          content,
          sessionId: localStorage.getItem('sessionId') as string,
          token: localStorage.getItem('token') as string,
          username: localStorage.getItem('username') as string
        }
      });

      /* Don't actually go to this POST url; instead, reload video page. The
       * Apollo client cache ensures that the /video/:videoId page loader will
       * return instantly.
       */
      return redirect(`/video/${video.id}`);
    }
  },
  {
    path: '/video/:videoId/comment/:commentId',
    element: <VideoPage />,
    action: async ({ params, request }) => {
      if (params.videoId === undefined) {
        throw new Error('/video/:videoId/comment/:commentId: videoId is undefined');
      } else if (params.commentId === undefined) {
        throw new Error('/video/:videoId/comment/:commentId: commentId is undefined');
      }

      if (request.method === 'DELETE') {
        const video = await VideoService.deleteComment({
          videoId: params.videoId,
          commentId: params.commentId,
          input: {
            token: localStorage.getItem('token') as string
          }
        });
      }

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
