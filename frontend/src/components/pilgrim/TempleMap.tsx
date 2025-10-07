// src/components/pilgrim/TempleMap.tsx

import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Grid,
} from '@mui/material';
import {
  LocationOn,
  Restaurant,
  LocalParking,
  Wc,
  LocalHospital,
  Security,
} from '@mui/icons-material';

// Facilities data source
const templeFacilities = [
  {
    id: 'main_entrance',
    name: 'Main Entrance',
    lat: 21.1702,
    lon: 72.8311,
    icon: <LocationOn color="primary" />,
    emoji: '🏛️',
    description: 'Main temple entrance',
    status: 'Open',
  },
  {
    id: 'sanctum_sanctorum',
    name: 'Sanctum Sanctorum',
    lat: 21.1704,
    lon: 72.8313,
    icon: <Typography fontSize="24px">🕉️</Typography>,
    emoji: '🕉️',
    description: 'Main prayer hall',
    status: 'Open',
  },
  {
    id: 'prasadam_hall',
    name: 'Prasadam Hall',
    lat: 21.1705,
    lon: 72.8315,
    icon: <Restaurant />,
    emoji: '🍽️',
    description: 'Free meal service (12 PM - 2 PM)',
    status: 'Open',
  },
  {
    id: 'parking_area',
    name: 'Parking Area',
    lat: 21.1695,
    lon: 72.8305,
    icon: <LocalParking />,
    emoji: '🚗',
    description: '24/7 vehicle parking',
    status: 'Available',
  },
  {
    id: 'restrooms',
    name: 'Restrooms',
    lat: 21.1698,
    lon: 72.8308,
    icon: <Wc />,
    emoji: '🚻',
    description: 'Public restrooms',
    status: 'Open',
  },
  {
    id: 'medical_center',
    name: 'Medical Center',
    lat: 21.1700,
    lon: 72.8313,
    icon: <LocalHospital />,
    emoji: '🏥',
    description: 'First aid and medical assistance',
    status: 'Open',
  },
  {
    id: 'security_office',
    name: 'Security Office',
    lat: 21.1703,
    lon: 72.8309,
    icon: <Security />,
    emoji: '🛡️',
    description: 'Security and help desk',
    status: 'Open',
  },
];

const TempleMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Map initialization disabled for preview environment.
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div style="
          display:flex;
          align-items:center;
          justify-content:center;
          height:100%;
          background-color:#f0f0f0;
          color:#999;
          font-family: sans-serif;
          text-align: center;
        ">
          Map Preview Unavailable<br/>
          <small>(Requires 'leaflet' and '@types/leaflet' packages to be installed)</small>
        </div>
      `;
    }
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Temple Map
      </Typography>

      <Grid container spacing={3}>
        {/* Map Panel */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interactive Map
              </Typography>
              <Box
                ref={mapRef}
                id="map"
                sx={{
                  width: '100%',
                  height: { xs: 300, md: 500 },
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid #ddd',
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Facilities List Panel */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Facilities
              </Typography>
              <List>
                {templeFacilities.map((facility) => (
                  <ListItem key={facility.id} divider>
                    <ListItemIcon>{facility.icon}</ListItemIcon>
                    <ListItemText
                      primary={facility.name}
                      secondary={
                        <Chip
                          label={facility.status}
                          color={
                            facility.status === 'Open' || facility.status === 'Available'
                              ? 'success'
                              : 'warning'
                          }
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TempleMap;
