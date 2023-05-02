import React from 'react';
import { useState, useRef } from 'react';
import { Form, useSubmit } from 'react-router-dom';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Video } from '../generated/graphql';

const DISPLAY_DURATION = 5;

interface CommentAddProps {
  video: Video;
  playbackTime: number;
  visible: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * Comment-add card. Displays when user wishes to add a comment.
 */
const CommentAdd = ({
  video, playbackTime, visible, onSubmit, onCancel
}: CommentAddProps) => {
  const [content, setContent] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const submit = useSubmit();

  const findCommentInput = (): HTMLTextAreaElement => {
    const textarea = inputRef.current?.querySelector("textarea:not([readonly])") as HTMLTextAreaElement;
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
   * Perform default newline behavior if Shift, Control, or Command is held;
   * submit comment form otherwise.
   */
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation(); // limit event to this component
    if (event.key === 'Enter') {
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
