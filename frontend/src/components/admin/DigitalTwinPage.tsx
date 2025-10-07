// src/components/admin/DigitalTwinPage.tsx

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
} from '@mui/material';

const DigitalTwinPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Digital Twin
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Temple Digital Twin
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Experience the temple in a virtual 3D environment with real-time data overlay.
          </Typography>
          
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Box
              sx={{
                width: '100%',
                height: 500,
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
                <Typography variant="h2" gutterBottom>
                  🛕
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Digital Twin Demo
                </Typography>
                <Typography variant="body1" color="grey.400" paragraph>
                  Interactive 3D model of the temple with real-time crowd data visualization
                </Typography>
                <Typography variant="body2" color="grey.400">
                  (Placeholder for digital_twin_demo.mp4)
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" paragraph>
                Real-time crowd density visualization
              </Typography>
              <Typography component="li" variant="body2" paragraph>
                Interactive navigation through temple premises
              </Typography>
              <Typography component="li" variant="body2" paragraph>
                Historical data playback
              </Typography>
              <Typography component="li" variant="body2" paragraph>
                Emergency response simulation
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DigitalTwinPage;
