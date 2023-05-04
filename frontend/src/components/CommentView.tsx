import React from 'react';
import { Form } from 'react-router-dom';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Video, Comment } from '../generated/graphql';

interface CommentViewProps {
  video: Video;
  comment: Comment;
  editable: boolean;
  playbackTime: number;
}

const DISPLAY_DURATION = 5;

/**
 * Comment card. Displays when the playhead reaches the comment's timecode.
 */
const CommentView = ({video, comment, editable, playbackTime}: CommentViewProps) => {
  const visible = (
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
    <Collapse in={visible} collapsedSize={0} sx={{ width: '90%' }} >
      <Paper sx={{
        marginTop: '1rem',
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
            <Box sx={{ marginLeft: 'auto' }}>
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
    </Collapse>
  );
};

export default CommentView;
