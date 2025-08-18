// --- File: client/src/components/CommentSection.js ---
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import { Box, TextField, Button, Typography, Avatar, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';

const CommentSection = ({ postId, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { apiUrl } = useContext(AuthContext);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`${apiUrl}/posts/${postId}/comments`);
                setComments(res.data.comments);
            } catch (error) {
                console.error("Failed to fetch comments");
            }
        };
        fetchComments();
    }, [postId, apiUrl]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await axios.post(`${apiUrl}/posts/${postId}/comments`, { content: newComment });
            setComments([...comments, res.data.comment]);
            setNewComment('');
            toast.success("Comment added!");
        } catch (error) {
            toast.error("Failed to add comment.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`${apiUrl}/comments/${commentId}`);
            setComments(comments.filter(c => c._id !== commentId));
            toast.success("Comment deleted!");
        } catch (error) {
            toast.error("Failed to delete comment.");
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box component="form" onSubmit={handleAddComment} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField size="small" fullWidth variant="outlined" placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                <Button type="submit" variant="contained">Post</Button>
            </Box>
            <Divider />
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {comments.map(comment => (
                    <Box key={comment._id} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Avatar src={comment.author.profilePic} sx={{ width: 32, height: 32 }}/>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2">
                                <strong>{comment.author.username}</strong> {comment.content}
                            </Typography>
                        </Box>
                        {currentUser._id === comment.author._id && (
                            <IconButton size="small" onClick={() => handleDeleteComment(comment._id)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CommentSection;