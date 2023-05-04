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

interface ChangeUsernameProps {
  username: string;
  visible: boolean;
  onSubmit: (username: string) => void;
  onCancel: () => void;
}

/**
 * Username-chooser card. Displays when username is Anonymous, or when user has
 * requested a change.
 */
const ChangeUsername = ({
  username,
  visible,
  onSubmit,
  onCancel
}: ChangeUsernameProps) => {
  const [content, setContent] = useState(username);
  const inputRef = useRef<HTMLDivElement>(null);

  const invalidName:boolean = content === 'Anonymous';

  const findCommentInput = (): HTMLInputElement => {
    const textInput = inputRef.current?.querySelector("input:not([readonly])") as HTMLInputElement;
    if (textInput) {
      return textInput;
    } else {
      throw new Error("Could not find raw textarea to focus");
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
          name="chooseUsername"
          onSubmit={event => {
            event.preventDefault();
            onSubmit(content);
          }}
        >
          <CardContent>
            <TextField
              label={invalidName ?
                'Choose a username (other than "Anonymous")' :
                'Choose a username'}
              name="content"
              ref={inputRef}
              fullWidth={true}
              value={content}
              onChange={event => setContent(event.target.value)}
              error={invalidName}
              focused
            />
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={invalidName}
            >
              Change username
            </Button>
            <Button variant="outlined" color="secondary" size="small" onClick={onCancel}>
              Cancel
            </Button>
          </CardActions>
        </Form>
      </Card>
    </Collapse>
  );
};

export default ChangeUsername;
