import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import PostCard from '../components/PostCard';
import { Container, Box, Typography, Avatar, Button, CircularProgress, Paper, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user, setUser, apiUrl } = useContext(AuthContext);

  // State for the Edit Profile Modal
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ displayName: '', bio: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileRes = await axios.get(`${apiUrl}/users/profile/${username}`);
        setProfile(profileRes.data.user);
        setPosts(profileRes.data.posts);
        setIsFollowing(profileRes.data.user.followers.includes(user._id));
        setFormData({
            displayName: profileRes.data.user.displayName,
            bio: profileRes.data.user.bio || ''
        });
      } catch (error) {
        toast.error("Could not fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username, user._id, apiUrl]);

  const handleFollow = async () => {
    try {
      await axios.post(`${apiUrl}/users/${profile._id}/follow`);
      setIsFollowing(true);
      setProfile(prev => ({ ...prev, followers: [...prev.followers, user._id] }));
      toast.success(`Followed @${profile.username}`);
    } catch (error) { toast.error('Could not follow user.'); }
  };

  const handleUnfollow = async () => {
    try {
      await axios.delete(`${apiUrl}/users/${profile._id}/follow`);
      setIsFollowing(false);
      setProfile(prev => ({ ...prev, followers: prev.followers.filter(id => id !== user._id) }));
      toast.success(`Unfollowed @${profile.username}`);
    } catch (error) { toast.error('Could not unfollow user.'); }
  };

  // Edit Profile Modal Functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleProfileUpdate = async () => {
    const loadingToast = toast.loading('Updating profile...');
    try {
        const res = await axios.put(`${apiUrl}/users/profile`, formData);
        setProfile(res.data.user);
        setUser(res.data.user);
        toast.dismiss(loadingToast);
        toast.success('Profile updated successfully!');
        handleClose();
    } catch (error) {
        toast.dismiss(loadingToast);
        toast.error('Could not update profile.');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (!profile) return <Typography sx={{ textAlign: 'center', mt: 4 }}>User not found.</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar src={profile.profilePic} sx={{ width: 120, height: 120 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h4">{profile.displayName}</Typography>
            <Typography variant="body1" color="text.secondary">@{profile.username}</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>{profile.bio || 'No bio yet.'}</Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 3 }}>
              <Typography><strong>{posts.length}</strong> Posts</Typography>
              <Typography><strong>{profile.followers.length}</strong> Followers</Typography>
              <Typography><strong>{profile.following.length}</strong> Following</Typography>
            </Box>
            {user._id === profile._id ? (
              <Button variant="outlined" startIcon={<EditIcon />} sx={{ mt: 2 }} onClick={handleOpen}>Edit Profile</Button>
            ) : (
              isFollowing ? (
                <Button variant="contained" onClick={handleUnfollow} sx={{ mt: 2 }}>Unfollow</Button>
              ) : (
                <Button variant="outlined" onClick={handleFollow} sx={{ mt: 2 }}>Follow</Button>
              )
            )}
          </Grid>
        </Grid>
      </Paper>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Your Profile</DialogTitle>
        <DialogContent>
            <TextField autoFocus margin="dense" name="displayName" label="Display Name" type="text" fullWidth variant="standard" value={formData.displayName} onChange={handleChange} />
            <TextField margin="dense" name="bio" label="Bio" type="text" fullWidth multiline rows={4} variant="standard" value={formData.bio} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleProfileUpdate}>Save</Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h5" gutterBottom>Posts</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {posts.length > 0 ? posts.map(post => <PostCard key={post._id} post={post} currentUser={user} />) : <Typography>No posts yet.</Typography>}
      </Box>
    </Container>
  );
};

export default ProfilePage;
  