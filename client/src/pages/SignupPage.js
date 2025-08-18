// --- File: client/src/pages/SignupPage.js ---
import React, { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { Container, Box, TextField, Button, Typography, Link, Avatar } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, apiUrl } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    const loadingToast = toast.loading('Creating account...');
    try {
      const response = await axios.post(`${apiUrl}/auth/signup`, { username, displayName, email, password });
      toast.dismiss(loadingToast);
      toast.success('Account created successfully!');
      setToken(response.data.token);
      navigate('/');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}><PersonAddIcon /></Avatar>
        <Typography component="h1" variant="h5">Sign Up</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField margin="normal" required fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
          <Link component={RouterLink} to="/login" variant="body2">{"Already have an account? Sign In"}</Link>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;