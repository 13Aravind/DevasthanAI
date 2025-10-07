// src/components/pilgrim/MyYatraPlan.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { QrCode, CalendarToday, AccessTime } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock AuthContext to keep component standalone
const AuthContext = React.createContext<{ user: any; token: string | null }>({ 
  user: { full_name: 'Pilgrim User' },
  token: 'mock-token'
});
const useAuth = () => React.useContext(AuthContext);

interface Ticket {
  id: number;
  slot_timestamp: string;
  qr_code_hash: string;
  status: string;
  created_at: string;
}

const MyYatraPlan: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const fetchTickets = useCallback(async () => {
    try {
      if (!token) return;
      const response = await fetch('http://localhost:8000/api/v1/my_tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      fetchTickets();
    } else {
      navigate('/pilgrim/home');
    }
  }, [user, navigate, fetchTickets]);

  const handleShowQR = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setQrDialogOpen(true);
  };

  const handleCloseQR = () => {
    setQrDialogOpen(false);
    setSelectedTicket(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'primary';
      case 'checked_in': return 'success';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'booked': return 'Booked';
      case 'checked_in': return 'Checked In';
      case 'expired': return 'Expired';
      default: return status;
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  if (!user) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        My Yatra Plan
      </Typography>

      {isLoading ? (
        <Typography>Loading your bookings...</Typography>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              No bookings found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              You haven't booked any darshan slots yet.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/pilgrim/book')}>
              Book Your First Darshan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Tip:</strong> Arrive 15 minutes before your scheduled time and show your QR code at the entrance.
            </Typography>
          </Alert>

          <List>
            {tickets.map((ticket) => {
              const { date, time } = formatDateTime(ticket.slot_timestamp);
              const isUpcoming = new Date(ticket.slot_timestamp) > new Date();

              return (
                <Card key={ticket.id} sx={{ mb: 2 }}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleShowQR(ticket)}
                        disabled={!isUpcoming && ticket.status === 'booked'}
                      >
                        <QrCode />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 20, color: 'primary.main' }} />
                          <Typography variant="h6">Darshan Slot</Typography>
                          <Chip
                            label={getStatusLabel(ticket.status)}
                            color={getStatusColor(ticket.status) as any}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <AccessTime sx={{ fontSize: 16 }} />
                            {date} at {time}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Booked on: {formatDateTime(ticket.created_at).date}
                          </Typography>
                          {!isUpcoming && ticket.status === 'booked' && (
                            <Alert severity="warning" sx={{ mt: 1, py: 0 }}>
                              This slot has passed
                            </Alert>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                </Card>
              );
            })}
          </List>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="outlined" onClick={() => navigate('/pilgrim/book')}>
              Book Another Slot
            </Button>
          </Box>
        </>
      )}

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onClose={handleCloseQR} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <QrCode sx={{ mr: 1, color: 'primary.main' }} />
            Your Darshan QR Code
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" gutterBottom>
                {formatDateTime(selectedTicket.slot_timestamp).date} at {formatDateTime(selectedTicket.slot_timestamp).time}
              </Typography>

              <Box
                sx={{
                  width: 250,
                  height: 250,
                  border: '2px solid',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  my: 2,
                  bgcolor: 'grey.50',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <QrCode sx={{ fontSize: 80, color: 'primary.main', mb: 1 }} />
                  <Typography variant="caption" display="block">
                    QR Code
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedTicket.qr_code_hash.substring(0, 12)}...
                  </Typography>
                </Box>
              </Box>

              <Alert severity="info">
                <Typography variant="body2">
                  Show this QR code at the temple entrance. Please arrive 15 minutes before your scheduled time.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQR} variant="contained" fullWidth>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyYatraPlan;
