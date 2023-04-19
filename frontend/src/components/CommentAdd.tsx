import React from 'react';
import { useState, useRef } from 'react';
import { Form, useSubmit, useLoaderData } from 'react-router-dom';

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
const CommentAdd = ({
  video, playbackTime, visible, onSubmit, onCancel
}) => {
  const [content, setContent] = useState('');
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const submit = useSubmit();

  const findCommentInput = () => {
    const textarea = inputRef.current.querySelector("textarea:not([readonly])");
    if (textarea) {
      return textarea;
    } else {
      throw new Error("Could not find raw textarea to focus");
    }
  };

  const cancelComment = () => {
    findCommentInput().blur();
    setContent('');
    onCancel();
  };

  /**
   * Perform default newline behavior if Shift, Control, or Commend is held;
   * submit comment form otherwise.
   */
  const onKeyDown = event => {
    event.stopPropagation(); // limit event to this component
    if (event.key === 'Enter') {
      console.log("CommentAdd.onKeyDown: Enter");
      if (
        event.getModifierState('Shift') ||
        event.getModifierState('Control') ||
        event.getModifierState('Meta') // MacOS command key
      ) {
        return; // permit standard carriage return behavior
      }
      event.preventDefault();
      // formRef.current.submit() would bypass react-router
      if (content !== '') {
        submit(formRef.current);
        findCommentInput().blur();
        setContent('');
        onSubmit();
      }
    } else if (event.key === 'Escape') {
      cancelComment();
    }
  };

  return (
    <Collapse
      in={visible}
      collapsedSize={0}
      sx={{ width: '90%' }}
      onEntered={() => findCommentInput().focus()}
    >
      <Card>
        <Form
          name="createComment"
          ref={formRef}
          action={`/video/${video.id}/comment`}
          method="post"
          onSubmit={event => {
            if (content === '') {
              event.preventDefault(); // cancels submit
            }
            setContent('');
            onSubmit();
          }}
        >
          <CardContent>
            <TextField
              label="Comment"
              name="content"
              ref={inputRef}
              fullWidth={true}
              multiline={true}
              minRows={2}
              maxRows={5}
              value={content}
              onKeyDown={onKeyDown}
              onChange={event => setContent(event.target.value)}
              focused
            />
            <input type="hidden" name="timecode" value={playbackTime} />
          </CardContent>
          <CardActions>
            <Button type="submit" variant="contained" size="small">
              Post (or hit Enter)
            </Button>
            <Button variant="outlined" size="small" onClick={cancelComment}>
              Cancel (or hit Esc)
            </Button>
          </CardActions>
        </Form>
      </Card>
    </Collapse>
  );
};

export default CommentAdd;
