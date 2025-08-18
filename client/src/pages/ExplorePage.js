// --- File: client/src/pages/ExplorePage.js ---
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import PostCard from '../components/PostCard';
import { Container, Typography, Box, CircularProgress, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import toast from 'react-hot-toast';

const ExplorePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, apiUrl } = useContext(AuthContext);

    useEffect(() => {
        const fetchTrendingPosts = async () => {
            try {
                const response = await axios.get(`${apiUrl}/posts/trending`);
                setPosts(response.data.posts);
            } catch (error) {
                toast.error("Could not fetch trending posts.");
            } finally {
                setLoading(false);
            }
        };
        fetchTrendingPosts();
    }, [apiUrl]);

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>Explore</Typography>
             <TextField fullWidth variant="outlined" placeholder="Search..." InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),}} sx={{ mb: 4 }} />
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {posts.map(post => <PostCard key={post._id} post={post} currentUser={user} />)}
                </Box>
            )}
        </Container>
    );
};

export default ExplorePage;