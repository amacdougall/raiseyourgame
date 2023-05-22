import React from 'react';
import { Form } from 'react-router-dom';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import VideoService from './services/VideoService';

const HomePage = () => {
  const [videoUrl, setVideoUrl] = React.useState('');
  const [videoTitle, setVideoTitle] = React.useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const inputFieldWidth = {
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      width: '25%'
    }
  };

  return (
    <Stack spacing={2} sx={{
      maxWidth: '100vh',
      margin: 'auto',
      padding: '1rem',
    }}>
      <Typography variant={isMobile ? 'h4' : 'h2'}>
        Raise Your Game
      </Typography>

      <Typography variant='body1'>
        Comment on a YouTube video, or share the link to get feedback.
      </Typography>

      <Typography variant='h4'>
        Ready to get started?
      </Typography>

      <Typography variant='body1'>
        Paste a YouTube URL below. Add a title if you don't like the one on YouTube.
      </Typography>

      <Form name='createVideo' action='/video' method='post'>
        <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
          { /* TODO: validate URL */ }
          <TextField
            sx={{ ...inputFieldWidth }}
            label='YouTube URL'
            name='videoUrl'
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
          />
          <TextField
            sx={{ ...inputFieldWidth }}
            label='Video Title'
            name='videoTitle'
            value={videoTitle}
            placeholder='leave blank to use YouTube title'
            onChange={e => setVideoTitle(e.target.value)}
          />
          <Button variant='contained' type='submit'>Let's Go!</Button>
        </Stack>
      </Form>

      <Typography variant='h4'>
        How it works:
      </Typography>

      <Typography variant='body1'>
        Paste YouTube link, get video page, copy URL, paste on Discord
        or Reddit or whatever. Read, learn, practice, improve. No login,
        no tracking. You can delete comments if someone is being uncool.
        Videos disappear after 30 days.
      </Typography>

      <ImageList cols={isMobile ? 1 : 2}>
        <ImageListItem key='tutorial_01'>
          <img src={isMobile ? '/ryg_tutorial_mobile_01.jpg' : '/ryg_tutorial_01.jpg'} />
          <ImageListItemBar
            title='Watch'
            subtitle='See the action unfold'
            position='top' />
        </ImageListItem>
        <ImageListItem key='tutorial_02'>
          <img src={isMobile ? '/ryg_tutorial_mobile_02.jpg' : '/ryg_tutorial_02.jpg'} />
          <ImageListItemBar
            title='Comment'
            subtitle='Call out highlights, or offer advice'
            position='top' />
        </ImageListItem>
        <ImageListItem key='tutorial_03'>
          <img src={isMobile ? '/ryg_tutorial_mobile_03.jpg' : '/ryg_tutorial_03.jpg'} />
          <ImageListItemBar
            title='Review'
            subtitle='Comments appear along with the action'
            position='top' />
        </ImageListItem>
        <ImageListItem key='tutorial_04'>
          <img src={isMobile ? '/ryg_tutorial_mobile_04.jpg' : '/ryg_tutorial_04.jpg'} />
          <ImageListItemBar
            title='Look around'
            subtitle='Click the timeline or a marker to jump'
            position='top' />
        </ImageListItem>
      </ImageList>
    </Stack>
  );
};

export default HomePage;
