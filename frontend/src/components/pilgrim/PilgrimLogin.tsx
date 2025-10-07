import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  Tabs,
  Tab,
  useTheme,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 }, pt: 3 }}>{children}</Box>}
    </div>
  );
}

const PilgrimLogin: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', username: '', full_name: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
    setSuccessMessage('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const success = await login(loginData.username, loginData.password, false);
      if (success) {
        navigate('/pilgrim/home');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccessMessage('Registration successful! Please sign in.');
      setTabValue(0);
    } catch {
      setError('An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e: React.MouseEvent) => e.preventDefault();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, ${theme.palette.background.default} 100%)`,
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            mt: '48px',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: `0px 10px 40px -10px ${theme.palette.primary.main}20`,
          }}
        >
          {/* Professional Home Icon Button at top right */}
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <Tooltip title="Back to Home Page" arrow>
              <IconButton
                onClick={() => navigate('/')}
                size="large"
                sx={{
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                  },
                }}
                aria-label="Back to Home Page"
              >
                <HomeIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'secondary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid',
              borderColor: theme.palette.background.default,
            }}
          >
            <Typography variant="h3" sx={{ color: 'white', lineHeight: 1 }}>
              🛕
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', pt: '56px', pb: 2 }}>
            <Typography component="h1" variant="h4" sx={{ fontFamily: 'Merriweather, serif', fontWeight: 700, color: 'primary.main' }}>
              DevasthanAI
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: 'secondary.main', fontWeight: 'bold' }}>
              Pilgrim Portal
            </Typography>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
              <Tab label="Sign In" sx={{ fontWeight: 'bold', '&:hover': { color: 'secondary.main', opacity: 1 } }} />
              <Tab label="Create Account" sx={{ fontWeight: 'bold', '&:hover': { color: 'secondary.main', opacity: 1 } }} />
            </Tabs>
          </Box>

          {(error || successMessage) && (
            <Alert severity={error ? 'error' : 'success'} sx={{ m: 0, borderRadius: 0 }}>
              {error || successMessage}
            </Alert>
          )}

          <TabPanel value={tabValue} index={0}>
            <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Username" value={loginData.username} onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} required fullWidth autoFocus />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'secondary.main',
                    transform: 'scale(1.02)',
                  },
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Full Name" value={registerData.full_name} onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })} required fullWidth />
              <TextField label="Email Address" type="email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required fullWidth />
              <TextField label="Username" value={registerData.username} onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} required fullWidth />
              <TextField label="Password" type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required fullWidth />
              <TextField label="Confirm Password" type="password" value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} required fullWidth />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'secondary.main',
                    transform: 'scale(1.02)',
                  },
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default PilgrimLogin;
