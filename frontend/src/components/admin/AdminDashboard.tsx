import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAuth } from '../../contexts/AuthContext'; 
import Sidebar from './Sidebar';  // Ensure Sidebar accepts sx or wrap in Box
import LiveDashboard from './LiveDashboard';
import AnalyticsPage from './AnalyticsPage';
import EmergencyPage from './EmergencyPage';
import DigitalTwinPage from './DigitalTwinPage';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Wrap Sidebar in Box if sx not supported */}
      <Box
        sx={{
          width: 260,
          bgcolor: theme.palette.primary.main,
          color: 'white',
          flexShrink: 0,
        }}
      >
        <Sidebar />
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <AppBar
          position="fixed"
          elevation={3}
          sx={{
            width: `calc(100% - 260px)`,
            ml: `260px`,
            bgcolor: theme.palette.common.white,
            borderBottom: `2px solid ${theme.palette.secondary.main}`,
            color: theme.palette.text.primary,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                letterSpacing: 1.2,
                color: theme.palette.primary.dark,
                userSelect: 'none',
              }}
            >
              Divya Drishti - Admin Dashboard 🛕
            </Typography>

            <Typography
              variant="body1"
              sx={{ mr: 3, color: theme.palette.text.secondary }}
            >
              Welcome, {user?.full_name ?? 'Admin'}
            </Typography>

            <IconButton
              onClick={logout}
              aria-label="Logout"
              size="large"
              sx={{
                bgcolor: 'rgba(255, 153, 51, 0.15)',
                color: theme.palette.primary.dark,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.common.white,
                  boxShadow: '0 0 8px 2px rgba(255,153,51,0.7)',
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, mt: '64px' }}>
          <Routes>
            <Route path="dashboard" element={<LiveDashboard />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="emergency" element={<EmergencyPage />} />
            <Route path="digital-twin" element={<DigitalTwinPage />} />
            <Route path="/" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
