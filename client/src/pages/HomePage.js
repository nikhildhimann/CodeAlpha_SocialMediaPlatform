// --- File: client/src/pages/HomePage.js ---
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, apiUrl } = useContext(AuthContext);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios.get(`${apiUrl}/posts/feed`);
        setPosts(response.data.posts);
      } catch (error) {
        toast.error('Could not fetch feed.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [apiUrl]);

  const handlePostCreated = (newPost) => setPosts([newPost, ...posts]);
  const handlePostDeleted = (postId) => setPosts(posts.filter(post => post._id !== postId));
  const handlePostUpdated = (updatedPost) => setPosts(posts.map(post => post._id === updatedPost._id ? updatedPost : post));

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Home Feed</Typography>
      <CreatePost onPostCreated={handlePostCreated} />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post._id} post={post} currentUser={user} onPostDeleted={handlePostDeleted} onPostUpdated={handlePostUpdated} />
            ))
          ) : (
            <Typography>Your feed is empty. Follow some users to see their posts!</Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default HomePage;