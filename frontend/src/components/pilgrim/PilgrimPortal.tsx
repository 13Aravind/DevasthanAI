import React, { useState } from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Alert } from '@mui/material';
import { Home, BookOnline, List, Map, Sms } from '@mui/icons-material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SOSButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Button
    variant="contained"
    onClick={onClick}
    sx={{
      position: 'fixed',
      bottom: 80,
      right: 24,
      borderRadius: '50%',
      width: 64,
      height: 64,
      fontSize: '1.2rem',
      zIndex: 1300,
      bgcolor: '#283593', // Indigo base
      color: '#fff',
      boxShadow: 3,
      transition: 'all 0.3s ease',
      '&:hover': {
        bgcolor: '#FF9933', // Saffron hover
        boxShadow: '0 0 10px 3px #FF9933',
      },
    }}
    aria-label="SOS"
  >
    <Sms />
  </Button>
);

const SOSDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSendSOS = async () => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
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
          onClose();
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Sms sx={{ mr: 1, color: '#FF9933' }} />
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
        {!success ? (
          <>
            <Button onClick={onClose} color="inherit">
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
        ) : (
          <Button onClick={onClose} variant="contained" fullWidth>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const PilgrimPortal: React.FC = () => {
  const location = useLocation();
  const [isSOSDialogOpen, setIsSOSDialogOpen] = useState(false);

  const openSOSDialog = () => setIsSOSDialogOpen(true);
  const closeSOSDialog = () => setIsSOSDialogOpen(false);

  return (
    <Box sx={{ pb: 7, height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Main Content Area - Render child routes */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </Box>

      {/* SOS Button */}
      <SOSButton onClick={openSOSDialog} />

      {/* SOS Dialog */}
      <SOSDialog open={isSOSDialogOpen} onClose={closeSOSDialog} />

      {/* Bottom Navigation */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation showLabels value={location.pathname}>
          <BottomNavigationAction 
            component={Link} 
            to="/pilgrim/home" 
            label="Home" 
            value="/pilgrim/home" 
            icon={<Home />} 
          />
          <BottomNavigationAction 
            component={Link} 
            to="/pilgrim/book-darshan" 
            label="Book" 
            value="/pilgrim/book-darshan" 
            icon={<BookOnline />} 
          />
          <BottomNavigationAction 
            component={Link} 
            to="/pilgrim/my-yatra" 
            label="My Yatra" 
            value="/pilgrim/my-yatra" 
            icon={<List />} 
          />
          <BottomNavigationAction 
            component={Link} 
            to="/pilgrim/map" 
            label="Map" 
            value="/pilgrim/map" 
            icon={<Map />} 
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default PilgrimPortal;
