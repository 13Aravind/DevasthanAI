// src/components/admin/LiveCountCard.tsx

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { People, LocationOn, AccessTime } from '@mui/icons-material';

interface LiveCountCardProps {
  count: number;
  timestamp?: string;
  location?: string;
}

const LiveCountCard: React.FC<LiveCountCardProps> = ({ count, timestamp, location }) => {
  // Determine color based on crowd level
  const getCountColor = (count: number) => {
    if (count <= 50) return 'success';
    if (count <= 150) return 'info';
    if (count <= 300) return 'warning';
    if (count <= 500) return 'error';
    return 'error';
  };

  // Determine label based on crowd level
  const getCountLabel = (count: number) => {
    if (count <= 50) return 'Normal';
    if (count <= 150) return 'Moderate';
    if (count <= 300) return 'High';
    if (count <= 500) return 'Critical';
    return 'Extreme';
  };

  // Format timestamp to local time or fallback text
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'No data';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        {/* Header with icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <People sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="h2">
            Live Pilgrim Count
          </Typography>
        </Box>

        {/* Count large number and status chip */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography
            variant="h2"
            component="div"
            color="primary"
            fontWeight="bold"
          >
            {count}
          </Typography>
          <Chip
            label={getCountLabel(count)}
            color={getCountColor(count)}
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>

        {/* Location and Last Update details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Location: {location || 'Unknown'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Last Update: {formatTimestamp(timestamp)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LiveCountCard;
