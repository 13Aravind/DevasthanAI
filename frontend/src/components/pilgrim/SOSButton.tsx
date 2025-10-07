import React, { useState, useEffect } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { Sms } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const SOSButton: React.FC = () => {
  const { user, token } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSOSClick = () => {
    console.log('SOS button clicked');
    console.log('Current user:', user);
    if (!user) {
      alert('Please login to use SOS feature');
      return;
    }
    setDialogOpen(true);
  };

  const handleSendSOS = async () => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      // Simulated location near temple coordinates
      const location = {
        lat: 21.1702 + (Math.random() - 0.5) * 0.001,
        lon: 72.8311 + (Math.random() - 0.5) * 0.001,
      };

      const response = await fetch('http://localhost:8000/api/v1/sos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          location_lat: location.lat,
          location_lon: location.lon,
          description: 'Emergency assistance required',
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setDialogOpen(false);
          setSuccess(false);
        }, 3000);
      } else {
        alert('Failed to send SOS alert. Please try again.');
      }
    } catch (error) {
      console.error('Error sending SOS:', error);
      alert('Error sending SOS alert. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSuccess(false);
  };

  return (
    <>
      <Fab
        aria-label="SOS"
        onClick={handleSOSClick}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          zIndex: 1000,
          bgcolor: '#006699', // Deep blue base
          color: '#fff',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: '#FF9933', // Saffron orange on hover
            boxShadow: '0 0 10px 3px #FF9933',
          },
        }}
      >
        <Sms />
      </Fab>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Sms sx={{ mr: 1, color: '#FF9933' /* saffron */ }} />
            Emergency SOS
          </Box>
        </DialogTitle>
        <DialogContent>
          {success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                SOS Alert Sent Successfully!
              </Typography>
              <Typography variant="body2">
                Your emergency alert has been sent to the temple security team. Help is on the way. Please stay calm and wait for assistance.
              </Typography>
            </Alert>
          ) : (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Emergency Alert
                </Typography>
                <Typography variant="body2">
                  This will send an immediate SOS alert to the temple security team with your current location. Use only in case of genuine emergency.
                </Typography>
              </Alert>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>What happens when you send SOS:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                <Typography component="li" variant="body2">
                  Your location is automatically shared with security
                </Typography>
                <Typography component="li" variant="body2">
                  Security team is immediately notified
                </Typography>
                <Typography component="li" variant="body2">
                  Emergency response team is dispatched
                </Typography>
                <Typography component="li" variant="body2">
                  You will receive confirmation of response
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {!success && (
            <>
              <Button onClick={handleCloseDialog} color="inherit">
                Cancel
              </Button>
              <Button
                onClick={handleSendSOS}
                sx={{
                  bgcolor: '#FF9933',
                  '&:hover': { bgcolor: '#B26A00' },
                  color: 'white',
                  fontWeight: 'bold',
                }}
                variant="contained"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send SOS Alert'}
              </Button>
            </>
          )}
          {success && (
            <Button onClick={handleCloseDialog} variant="contained" fullWidth>
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SOSButton;
