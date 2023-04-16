import React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

const DISPLAY_DURATION = 5;

/**
 * Comment card. Displays when the playhead reaches the comment's timecode.
 */
const CommentView = ({comment, editable, playbackTime}) => {
  const visible = (
    playbackTime >= comment.timecode &&
    playbackTime < comment.timecode + DISPLAY_DURATION
  );

  return (
    <Collapse in={visible} collapsedSize={0} sx={{ width: '90%' }} >
      <Card>
        <CardContent>
          <Typography variant="body" component="div">
            {comment.content}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            <strong>{comment.username}</strong> at {comment.createdAt}
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
