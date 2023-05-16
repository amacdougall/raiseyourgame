import React from 'react';
import { Form } from 'react-router-dom';

import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CollapsingBox from './CollapsingBox';

import {
  COMMENT_DISPLAY_DURATION,
  EXPAND_DURATION,
  EXPAND_ANIMATION_STYLE
} from '../constants';
import { Video, Comment } from '../generated/graphql';

interface CommentViewProps {
  video: Video;
  comment: Comment;
  editable: boolean;
  playbackTime: number;
}

const Frame = CollapsingBox({
  duration: EXPAND_DURATION,
  animationStyle: EXPAND_ANIMATION_STYLE
});

/**
 * Comment card. Displays when the playhead reaches the comment's timecode.
 */
const CommentView = ({video, comment, editable, playbackTime}: CommentViewProps) => {
  const shown = (
    playbackTime >= comment.timecode &&
    playbackTime < comment.timecode + COMMENT_DISPLAY_DURATION
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
    <Frame shown={shown} sx={{
      marginTop: '0.5rem',
      width: '90%',
      backgroundColor: 'rgb(167, 202, 237)',
      borderRadius: '0.5rem',
    }}>
      <Box sx={{
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
      </Box>
    </Frame>
  );
};

export default CommentView;
