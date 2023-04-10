import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './Home';
import Video from './Video';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/video/:videoId',
    element: <Video />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
