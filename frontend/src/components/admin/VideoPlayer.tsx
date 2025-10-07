// src/components/admin/VideoPlayer.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';

const VideoPlayer: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: 300,
        bgcolor: 'grey.900',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1,
        border: '2px solid',
        borderColor: 'grey.300',
      }}
    >
      <Box sx={{ textAlign: 'center', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          📹
        </Typography>
        <Typography variant="h6" gutterBottom>
          Raw Feed
        </Typography>
        <Typography variant="body2" color="grey.400">
          Live camera feed from temple premises
        </Typography>
        <Typography variant="body2" color="grey.400" sx={{ mt: 1 }}>
          (Simulated for demo)
        </Typography>
      </Box>
    </Box>
  );
};

export default VideoPlayer;
