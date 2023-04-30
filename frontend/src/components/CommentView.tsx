import React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

import { Comment } from '../generated/graphql';

interface CommentViewProps {
  comment: Comment;
  editable: boolean;
  playbackTime: number;
}

const DISPLAY_DURATION = 5;

/**
 * Comment card. Displays when the playhead reaches the comment's timecode.
 */
const CommentView = ({comment, editable, playbackTime}: CommentViewProps) => {
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
      <Card sx={{marginTop: '1rem'}}>
        <CardContent>
          {paragraphs}
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            <strong>{comment.username}</strong> at {formatTimecode(comment.timecode)}
          </Typography>
        </CardContent>
        { editable ?
          <CardActions disableSpacing>
            <Button size="small">Edit</Button>
            <Button size="small">Delete</Button>
          </CardActions>
          : null
        }
      </Card>
    </Collapse>
  );
};

export default CommentView;
