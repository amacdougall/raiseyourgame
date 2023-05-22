import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ApolloError } from '@apollo/client';

const VideoPageErrorBoundary = () => {
  const error = useRouteError();

  const messages = [];

  if (isRouteErrorResponse(error)) {
    messages.push('Error: ' + error.status);
  } else if (error instanceof ApolloError) {
    if (error.graphQLErrors.length > 0) {
      error.graphQLErrors.forEach((graphQLError) => {
        if (graphQLError.message.match(/Cast to ObjectId failed/)) {
          messages.push('This is not a valid video URL.');
        } else if (graphQLError.extensions.code == 'VIDEO_NOT_FOUND') {
          messages.push('This video does not exist. Note that all videos are deleted after thirty days.');
        } else {
          messages.push(graphQLError.message);
        }
      });
    }
  }

  if (messages.length === 0) {
    messages.push('An unknown error occurred.');
  }

  const content = messages.map(message => {
    return <Typography key={message} variant='body1'>{message}</Typography>;
  });

  return (
    <Box sx={{
      maxWidth: '100vh',
      margin: 'auto',
      padding: '1rem',
    }}>
      <Typography variant='h4'>
        Video Not Found
      </Typography>
      {content}
    </Box>
  );
};

export default VideoPageErrorBoundary;
