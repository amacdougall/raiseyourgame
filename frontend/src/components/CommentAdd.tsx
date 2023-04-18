import React from 'react';
import { useState } from 'react';
import { Form, useLoaderData } from 'react-router-dom';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const DISPLAY_DURATION = 5;

/**
 * Comment card. Displays when the playhead reaches the comment's timecode.
 */
const CommentAdd = ({video, playbackTime, visible}) => {
  const [content, setContent] = useState('');

  return (
    <Collapse in={visible} collapsedSize={0} sx={{ width: '90%' }} >
      <Card>
        <Form
          name="createComment"
          action={`/video/${video.id}/comment`}
          method="post"
          onSubmit={e => {
            if (content === '') {
              e.preventDefault(); // cancels submit
            }
            setContent('');
          }}
        >
          <CardContent>
            <TextField
              label="Comment"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              focused
            />
            <input type="hidden" name="timecode" value={playbackTime} />
          </CardContent>
          <CardActions disableSpacing>
            <Button
              type="submit"
              variant="contained"
              size="small"
            >
              Post (TODO: submit on Enter)
            </Button>
          </CardActions>
        </Form>
      </Card>
    </Collapse>
  );
};

export default CommentAdd;
