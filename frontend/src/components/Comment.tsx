import React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { Comment } from '../generated/graphql';

interface CommentViewProps {
  comment: Comment;
  editable: boolean;
}

/**
 * Comment card. Displays when the playhead reaches the comment's timecode.
 */
const CommentView = ({comment, editable}: CommentViewProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {comment.content}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <strong>{comment.username}</strong> at {comment.createdAt}
        </Typography>
        { editable ? <p>can edit!</p> : <p>cannot edit</p> }
      </CardContent>
      { editable ?
          <CardActions>
            <Button size="small">Edit</Button>
            <Button size="small">Delete</Button>
          </CardActions>
        : null
      }
    </Card>
  );
};
