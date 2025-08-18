// --- File: client/src/components/CreatePost.js ---
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import { Card, CardContent, TextField, Button, Box } from '@mui/material';
import toast from 'react-hot-toast';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const { apiUrl } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const loadingToast = toast.loading('Posting...');
    try {
      const response = await axios.post(`${apiUrl}/posts`, { content });
      toast.dismiss(loadingToast);
      toast.success('Post created!');
      onPostCreated(response.data.post);
      setContent('');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Failed to create post.');
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth multiline rows={3} variant="outlined" placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button type="submit" variant="contained">Post</Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;