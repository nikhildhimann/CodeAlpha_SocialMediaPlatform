// --- File: client/src/components/Navbar.js ---
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext, ThemeContext } from '../App';
import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = ({ onLogout }) => {
  const { user } = useContext(AuthContext);
  const { mode, toggleTheme } = useContext(ThemeContext);

  const navLinkStyle = { color: 'inherit', textDecoration: 'none', '&.active': { color: 'secondary.main' } };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component={NavLink} to="/" sx={{ flexGrow: 1, ...navLinkStyle }}>SocialSphere</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Home"><IconButton component={NavLink} to="/" sx={navLinkStyle}><HomeIcon /></IconButton></Tooltip>
          <Tooltip title="Explore"><IconButton component={NavLink} to="/explore" sx={navLinkStyle}><ExploreIcon /></IconButton></Tooltip>
          <Tooltip title="Profile"><IconButton component={NavLink} to={`/profile/${user.username}`} sx={navLinkStyle}><AccountCircleIcon /></IconButton></Tooltip>
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout"><IconButton color="inherit" onClick={onLogout}><LogoutIcon /></IconButton></Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;