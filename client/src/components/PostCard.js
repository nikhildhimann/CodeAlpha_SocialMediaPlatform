// --- File: client/src/components/PostCard.js ---
import React, { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography, Menu, MenuItem, TextField, Button, Box, Link, Collapse, Divider } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import toast from 'react-hot-toast';
import CommentSection from './CommentSection';

const PostCard = ({ post, currentUser, onPostDeleted, onPostUpdated }) => {
  const { apiUrl } = useContext(AuthContext);
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser._id));
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [showComments, setShowComments] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLike = async () => {
    try {
      await axios.post(`${apiUrl}/posts/${post._id}/like`);
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
    } catch (error) { toast.error("Couldn't like post."); }
  };

  const handleDelete = async () => {
    handleMenuClose();
    try {
      await axios.delete(`${apiUrl}/posts/${post._id}`);
      if (onPostDeleted) onPostDeleted(post._id);
      toast.success('Post deleted');
    } catch (error) { toast.error('Could not delete post.'); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Updating...');
    try {
      const res = await axios.put(`${apiUrl}/posts/${post._id}`, { content: editedContent });
      if (onPostUpdated) onPostUpdated(res.data.post);
      setIsEditing(false);
      toast.dismiss(loadingToast);
      toast.success('Post updated!');
    } catch (error) { 
        toast.dismiss(loadingToast);
        toast.error('Could not update post.');
    }
  };

  return (
    <Card>
      <CardHeader
        avatar={<Avatar component={RouterLink} to={`/profile/${post.author.username}`} src={post.author.profilePic} />}
        action={
          currentUser._id === post.author._id && (
            <>
              <IconButton onClick={handleMenuOpen}><MoreVertIcon /></IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { setIsEditing(true); handleMenuClose(); }}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )
        }
        title={<Link component={RouterLink} to={`/profile/${post.author.username}`} underline="hover" color="inherit" sx={{ fontWeight: 'bold' }}>{post.author.displayName}</Link>}
        subheader={`@${post.author.username} · ${new Date(post.createdAt).toLocaleString()}`}
      />
      <CardContent>
        {isEditing ? (
          <Box component="form" onSubmit={handleUpdate}>
            <TextField fullWidth multiline rows={3} value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
              <Button size="small" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button size="small" variant="contained" type="submit">Save</Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{post.content}</Typography>
        )}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLike}>
          {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography>{likes}</Typography>
        <IconButton onClick={() => setShowComments(!showComments)}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography>{post.comments.length || 0}</Typography>
      </CardActions>
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Divider />
        <CommentSection postId={post._id} currentUser={currentUser} />
      </Collapse>
    </Card>
  );
};

export default PostCard;