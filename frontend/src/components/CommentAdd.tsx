import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Form, useSubmit } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { EXPAND_DURATION, EXPAND_ANIMATION_STYLE } from '../constants';
import CollapsingBox from './CollapsingBox';

import { Video } from '../generated/graphql';

const DISPLAY_DURATION = 5;

interface CommentAddProps {
  video: Video;
  playbackTime: number;
  shown: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onNameChangeRequest: () => void;
}

const Box = CollapsingBox({
  duration: EXPAND_DURATION,
  animationStyle: EXPAND_ANIMATION_STYLE
});

/**
 * Comment-add card. Displays when user wishes to add a comment.
 */
const CommentAdd = ({
  video, playbackTime, shown, onSubmit, onCancel, onNameChangeRequest
}: CommentAddProps) => {
  const [content, setContent] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const submit = useSubmit();
  const theme = useTheme();

  const hideOnMobile = { [theme.breakpoints.down('sm')]: { display: 'none' } };

  // safe to cast, because App.tsx has already executed and ensured username is set
  const username: string = localStorage.getItem('username') as string;

  const findCommentInput = (): HTMLTextAreaElement => {
    const textarea = inputRef.current?.querySelector('textarea:not([readonly])') as HTMLTextAreaElement;
    if (textarea) {
      return textarea;
    } else {
      throw new Error('Could not find raw textarea to focus');
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

  useEffect(() => {
    if (shown) {
      findCommentInput().focus();
    }
  }, [shown]);

  return (
    <Box shown={shown} sx={{width: '90%'}}>
      <Card elevation={0}>
        <Form
          name='createComment'
          ref={formRef}
          action={`/video/${video.id}/comment`}
          method='post'
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
              label={'Posting as: ' + username}
              name='content'
              ref={inputRef}
              fullWidth={true}
              multiline={true}
              rows={3}
              value={content}
              onKeyDown={onKeyDown}
              onChange={event => setContent(event.target.value)}
              focused
            />
            <input type='hidden' name='timecode' value={playbackTime} />
          </CardContent>
          {/* CardActions 8px padding + 8px marginleft == CardContent 16px padding */}
          <CardActions sx={{ marginLeft: '8px' }}>
            <Button type='submit' variant='contained' size='small'>
              <Typography variant='button'>
                Post
              </Typography>
              <Typography variant='button' sx={hideOnMobile}>
                &nbsp;(or hit Enter)
              </Typography>
            </Button>
            <Button variant='outlined' size='small' onClick={onNameChangeRequest}>
              <Typography variant='button'>
                Change name?
              </Typography>
            </Button>
            <Button variant='outlined' color='secondary' size='small' onClick={cancelComment}>
              <Typography variant='button'>
                Cancel
              </Typography>
              <Typography variant='button' sx={hideOnMobile}>
                &nbsp;(or hit Esc)
              </Typography>
            </Button>
          </CardActions>
        </Form>
      </Card>
    </Box>
  );
};

export default CommentAdd;
