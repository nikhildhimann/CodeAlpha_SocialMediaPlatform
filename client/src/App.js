import React, { useState, useEffect, createContext, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage';
import Navbar from './components/Navbar';
import axios from 'axios';

export const AuthContext = createContext();
export const ThemeContext = createContext();
const API_URL = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'dark');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                primary: { main: '#90caf9' },
                secondary: { main: '#f48fb1' },
                background: { default: '#121212', paper: '#1e1e1e' },
              }
            : {
                primary: { main: '#1976d2' },
                secondary: { main: '#dc004e' },
                background: { default: '#f5f5f5', paper: '#ffffff' },
              }),
        },
      }),
    [mode],
  );

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const handleSetToken = (newToken) => {
    setToken(newToken);
    if (newToken) localStorage.setItem('token', newToken);
    else localStorage.removeItem('token');
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await axios.get(`${API_URL}/users/me`);
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          handleSetToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const handleLogout = () => {
    handleSetToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#121212' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken: handleSetToken, apiUrl: API_URL }}>
      <ThemeContext.Provider value={{ mode, toggleTheme }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toaster position="top-center" reverseOrder={false} />
          <Router>
            {user && <Navbar onLogout={handleLogout} />}
            <main style={{ paddingTop: user ? '64px' : '0' }}>
              <Routes>
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />
                <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="/profile/:username" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
                <Route path="/explore" element={user ? <ExplorePage /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
              </Routes>
            </main>
          </Router>
        </ThemeProvider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;