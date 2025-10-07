import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Grid,
  Chip,
  Alert,
  IconButton,
} from '@mui/material';
import { AccessTime, People, Security, Info, Logout } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PilgrimLogin from './PilgrimLogin';

interface LiveData {
  current_count: number;
  timestamp: string;
  location_id: string;
}

const PilgrimHome: React.FC = () => {
  const { user, logout } = useAuth();
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/live_data');
      if (response.ok) {
        const data = await response.json();
        setLiveData(data);
      }
    } catch (error) {
      console.error('Error fetching live data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPeaceOfMindLevel = (count: number) => {
    if (count <= 50) return { level: 100, color: 'success', label: 'Very Peaceful' };
    if (count <= 150) return { level: 75, color: 'info', label: 'Peaceful' };
    if (count <= 300) return { level: 50, color: 'warning', label: 'Moderate' };
    if (count <= 500) return { level: 25, color: 'error', label: 'Busy' };
    return { level: 10, color: 'error', label: 'Very Busy' };
  };

  const getEstimatedWaitTime = (count: number) => {
    if (count <= 50) return '5-10 minutes';
    if (count <= 150) return '15-20 minutes';
    if (count <= 300) return '30-45 minutes';
    if (count <= 500) return '1-2 hours';
    return '2+ hours';
  };

  if (!user) {
    return <PilgrimLogin />;
  }

  const greetingName =
    user.full_name && !['system administrator', 'admin', 'administrator'].includes(user.full_name.toLowerCase())
      ? user.full_name
      : 'Pilgrim';

  const peaceOfMind = getPeaceOfMindLevel(liveData?.current_count ?? 0);

  const handleLogout = () => {
    logout();
    navigate('/pilgrim/login');
  };

  return (
    <Box sx={{ p: 2, position: 'relative' }}>
      {/* Logout Button Top Right */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton onClick={handleLogout} color="primary" title="Logout">
          <Logout />
        </IconButton>
      </Box>

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontFamily: 'Noto Serif, serif',
            fontWeight: 700,
            color: '#283593', // Indigo
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          🛕 Yatra Sahayak
        </Typography>
        <Typography variant="h6" sx={{ color: '#283593' }}>
          Welcome, {greetingName}
        </Typography>
      </Box>

      {/* Peace of Mind Meter */}
      <Card sx={{ mb: 3, borderColor: '#283593', borderWidth: 2, borderStyle: 'solid' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Security sx={{ mr: 1, color: '#283593' }} />
            <Typography variant="h6">Peace-of-Mind Meter</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Current Status
              </Typography>
              <Chip label={peaceOfMind.label} color={peaceOfMind.color as any} size="small" />
            </Box>
            <LinearProgress
              variant="determinate"
              value={peaceOfMind.level}
              color={peaceOfMind.color as any}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {peaceOfMind.level}% Peaceful
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: '#FF9933', mb: 1 }} />
              <Typography variant="h5">{isLoading ? '...' : liveData?.current_count ?? 0}</Typography>
              <Typography variant="body2" color="text.secondary">Pilgrims Present</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccessTime sx={{ fontSize: 40, color: '#FF9933', mb: 1 }} />
              <Typography variant="h5">{getEstimatedWaitTime(liveData?.current_count ?? 0)}</Typography>
              <Typography variant="body2" color="text.secondary">Estimated Wait</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: '#283593', fontWeight: 700 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  bgcolor: '#283593', // Indigo
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#FF9933', // Saffron Orange
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 20px rgba(255, 153, 51, 0.4)',
                  },
                }}
                onClick={() => navigate('/pilgrim/book-darshan')}
              >
                Book Darshan
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  bgcolor: '#283593', // Indigo
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#FF9933',
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 20px rgba(255, 153, 51, 0.4)',
                  },
                }}
                onClick={() => navigate('/pilgrim/map')}
              >
                View Map
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Information */}
      <Alert severity="info" icon={<Info />} sx={{ borderColor: '#283593', color: '#283593' }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Visit during early morning (6-8 AM) or late evening (7-9 PM) for shorter wait times.
        </Typography>
      </Alert>
    </Box>
  );
};

export default PilgrimHome;
