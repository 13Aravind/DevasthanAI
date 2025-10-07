import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  useTheme,
  Link as MuiLink,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const PilgrimRegister: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      // In a real app, you would call your backend's registration API here.
      // For now, we'll simulate a successful registration.
      console.log('Simulating registration for:', { fullName, email });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/pilgrim/login'); // Redirect to login page after 2 seconds
      }, 2000);

    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, ${theme.palette.background.default} 100%)`,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            padding: { xs: 3, sm: 4 },
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: `0px 10px 40px -10px ${theme.palette.secondary.main}20`,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                color: 'secondary.main',
              }}
            >
              Begin Your Journey
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Create an account to plan your Yatra
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Registration successful! Redirecting to login...</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              fullWidth
              label="Full Name"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <TextField
              required
              fullWidth
              label="Email Address"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={isLoading || success}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: '1rem',
              }}
            >
              {isLoading ? 'Registering...' : 'Create Account'}
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <MuiLink component={Link} to="/pilgrim/login" fontWeight="bold">
              Sign in
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PilgrimRegister;