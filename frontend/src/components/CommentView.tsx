import React from 'react';
import { Form } from 'react-router-dom';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import BoxWithTransition from './BoxWithTransition';

import { Video, Comment } from '../generated/graphql';

interface CommentViewProps {
  video: Video;
  comment: Comment;
  editable: boolean;
  playbackTime: number;
}

const Box = BoxWithTransition({
  property: "height",
  startValue: "0rem",
  endValue: "5rem", // TODO: calculate this somehow?
  duration: "0.5s",
  animationStyle: "ease-out"
});

const DISPLAY_DURATION = 5; // TODO: base on comment length? Or just 10s?

/**
 * Comment card. Displays when the playhead reaches the comment's timecode.
 */
const CommentView = ({video, comment, editable, playbackTime}: CommentViewProps) => {
  const shown = (
    playbackTime >= comment.timecode &&
    playbackTime < comment.timecode + DISPLAY_DURATION
  );

  const paragraphs = comment.content.split(/\r?\n/).map((p, n) => {
    return (
      <Typography key={n} variant="body1" component="div">
        {p}
      </Typography>
    );
  });

  const formatTimecode = (timecode: number) => {
    const minutes = Math.floor(timecode / 60);
    const seconds = Math.floor(timecode % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Box shown={shown} sx={{width: '90%'}}>
      <Paper sx={{
        padding: '0rem 1rem',
      }}>
        <Stack direction="row" sx={{marginTop: '1rem'}}>
          <Stack>
            {paragraphs}
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              <strong>{comment.username}</strong> at {formatTimecode(comment.timecode)}
            </Typography>
          </Stack>
          { editable ?
            <Box shown={true} sx={{ marginLeft: 'auto' }}>
              <Form
                name="deleteComment"
                action={`/video/${video.id}/comment/${comment.id}`}
                method="delete"
              >
                <IconButton type="submit" size="large">
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </Form>
            </Box>
            : null
          }
        </Stack>
      </Paper>
    </Box>
  );
};

export default CommentView;
