import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { CalendarToday, QrCode } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock AuthContext for standalone use
const AuthContext = React.createContext<{ user: { full_name: string } | null; token: string | null }>({
  user: { full_name: 'Pilgrim User' },
  token: 'mock-token',
});
const useAuth = () => React.useContext(AuthContext);

const BookDarshan: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string>('');

  const timeSlots = [
    '06:00','06:30','07:00','07:30','08:00','08:30',
    '09:00','09:30','10:00','10:30','11:00','11:30',
    '12:00','12:30','13:00','13:30','14:00','14:30',
    '15:00','15:30','16:00','16:30','17:00','17:30',
    '18:00','18:30','19:00','19:30','20:00','20:30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!token) {
      setError('You are not logged in.');
      return;
    }
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }
    setIsLoading(true);
    try {
      const slotDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
      const response = await fetch('http://localhost:8000/api/v1/tickets/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ slot_timestamp: slotDateTime.toISOString() }),
      });
      if (response.ok) {
        const ticket = await response.json();
        setQrCode(ticket.qr_code_hash);
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Booking failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
    navigate('/pilgrim/my-yatra');
  };

  if (!user) {
    navigate('/pilgrim/home');
    return null;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ color: '#283593', fontWeight: 700, fontFamily: 'Noto Serif, serif' }}>
        Book Darshan Slot
      </Typography>
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Select Date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ color: '#283593', fontWeight: 600 }}>
                  Available Time Slots
                </Typography>
                <Grid container spacing={1}>
                  {timeSlots.map((time) => (
                    <Grid item xs={4} sm={3} md={2} key={time}>
                      <Chip
                        label={time}
                        variant={selectedTime === time ? 'filled' : 'outlined'}
                        color={selectedTime === time ? 'primary' : 'default'}
                        onClick={() => setSelectedTime(time)}
                        sx={{
                          width: '100%',
                          bgcolor: selectedTime === time ? '#283593' : undefined,
                          color: selectedTime === time ? '#fff' : undefined,
                          '&:hover': {
                            bgcolor: '#FF9933',
                            color: 'white',
                            cursor: 'pointer'
                          }
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isLoading || !selectedDate || !selectedTime}
                  startIcon={<CalendarToday />}
                  sx={{
                    bgcolor: '#283593',
                    '&:hover': {
                      bgcolor: '#FF9933',
                    },
                    transition: 'all 0.3s ease',
                    fontWeight: 700,
                  }}
                >
                  {isLoading ? 'Booking...' : 'Book Darshan Slot'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      {/* Success Modal with QR code */}
      <Dialog open={success} onClose={handleCloseSuccess} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#4caf50' /* success.main */ }}>
            <QrCode sx={{ mr: 1 }} />
            Booking Successful!
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Darshan slot has been booked
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Date: {selectedDate} at {selectedTime}
            </Typography>
            <Box
              sx={{
                width: 200,
                height: 200,
                border: '2px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                bgcolor: 'grey.50',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <QrCode sx={{ fontSize: 60, color: '#283593', mb: 1 }} />
                <Typography variant="caption" display="block">
                  QR Code
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {qrCode.substring(0, 8)}...
                </Typography>
              </Box>
            </Box>
            <Alert severity="info">
              <Typography variant="body2">
                Please arrive 15 minutes before your scheduled time. Show this QR code at the entrance.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccess} variant="contained" fullWidth sx={{ bgcolor: '#283593', '&:hover': { bgcolor: '#FF9933' }, fontWeight: 700 }}>
            View My Bookings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookDarshan;
