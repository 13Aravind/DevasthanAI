// src/components/admin/AdminDarshanDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  PeopleAlt,
  AccessTime,
  Assessment,
  Videocam,
} from '@mui/icons-material';

// --- MOCK DATA ---
interface Booking {
  id: string;
  pilgrimName: string;
  date: string;    // ISO date string yyyy-mm-dd
  time: string;    // HH:mm string
  status: string;  // 'Confirmed' | 'Checked-In' | 'No-Show' etc.
}

const mockBookings: Booking[] = [
  { id: 'BK123', pilgrimName: 'Rohan Sharma', date: '2025-10-27', time: '09:00', status: 'Confirmed' },
  { id: 'BK124', pilgrimName: 'Priya Verma', date: '2025-10-27', time: '09:00', status: 'Checked-In' },
  { id: 'BK125', pilgrimName: 'Amit Singh', date: '2025-10-27', time: '10:00', status: 'Confirmed' },
  { id: 'BK126', pilgrimName: 'Sunita Devi', date: '2025-10-27', time: '11:00', status: 'Confirmed' },
  { id: 'BK127', pilgrimName: 'Karan Mehta', date: '2025-10-28', time: '14:00', status: 'Confirmed' },
  { id: 'BK128', pilgrimName: 'Anjali Gupta', date: '2025-10-28', time: '15:00', status: 'No-Show' },
];

// Get today's date in yyyy-mm-dd format (IST assumption)
const getTodayString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Mock camera feed locations
const cameraFeeds = [
  { id: 1, location: 'Main Entrance' },
  { id: 2, location: 'Queue Complex Hall 1' },
  { id: 3, location: 'Garbhagriha Exit' },
  { id: 4, location: 'Prasadam Counter' },
];

const AdminDarshanDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch bookings initially for today (simulate async)
  useEffect(() => {
    setIsLoading(true);
    setError('');
    const timer = setTimeout(() => {
      try {
        const today = getTodayString();
        const relevantBookings = mockBookings.filter(b => b.date === today);
        setBookings(relevantBookings);
        setFilteredBookings(relevantBookings);
      } catch (err) {
        setError('Failed to fetch booking data.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Update filtered bookings when selectedDate changes
  useEffect(() => {
    const filtered = mockBookings.filter(b => b.date === selectedDate);
    setFilteredBookings(filtered);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const totalBookings = filteredBookings.length;
  const checkedInCount = filteredBookings.filter(b => b.status === 'Checked-In').length;

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Merriweather, serif', fontWeight: 700, mb: 3 }}>
        Admin: Live Darshan Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* FILTERS AND STATS */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="View Bookings for Date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>Total Bookings</Typography>
                <Typography variant="h4">{isLoading ? '...' : totalBookings}</Typography>
              </Box>
              <PeopleAlt color="primary" sx={{ fontSize: 40 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>Checked-In</Typography>
                <Typography variant="h4">{isLoading ? '...' : checkedInCount}</Typography>
              </Box>
              <Assessment color="secondary" sx={{ fontSize: 40 }} />
            </CardContent>
          </Card>
        </Grid>

        {/* LIVE CCTV FEEDS */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Live CCTV Feeds 🎥
          </Typography>
          <Grid container spacing={2}>
            {cameraFeeds.map(feed => (
              <Grid item xs={12} sm={6} md={3} key={feed.id}>
                <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      bgcolor: 'common.black',
                      aspectRatio: '16 / 9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'common.white',
                      flexDirection: 'column',
                    }}
                  >
                    <Videocam sx={{ fontSize: '3rem', opacity: 0.5 }} />
                    <Typography variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
                      Live Feed Unavailable
                    </Typography>
                  </Box>
                  <Typography sx={{ p: 1, textAlign: 'center', fontWeight: 'bold', bgcolor: 'grey.100' }}>
                    {feed.location}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* BOOKINGS TABLE */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
            Daily Bookings Log
          </Typography>
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Pilgrim Name</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Booking ID</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Time Slot</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                        <CircularProgress />
                        <Typography>Loading Bookings...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                        <Typography>No bookings found for {selectedDate}.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id} hover>
                        <TableCell>{booking.pilgrimName}</TableCell>
                        <TableCell>{booking.id}</TableCell>
                        <TableCell>
                          <Chip
                            icon={<AccessTime />}
                            label={booking.time}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={booking.status}
                            color={
                              booking.status === 'Checked-In' ? 'success' :
                              booking.status === 'Confirmed' ? 'primary' : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDarshanDashboard;
