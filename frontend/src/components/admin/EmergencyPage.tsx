// src/components/admin/EmergencyPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { LocationOn, CheckCircle, Cancel } from '@mui/icons-material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SOSAlert {
  id: number;
  timestamp: string;
  location_lat: number;
  location_lon: number;
  status: 'new' | 'acknowledged' | 'resolved' | string;
  description?: string;
  user_id?: number;
}

const EmergencyPage: React.FC = () => {
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    fetchSOSAlerts();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current).setView([20.8880, 70.4013], 16);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    sosAlerts.forEach((alert) => {
      const marker = L.marker([alert.location_lat, alert.location_lon]).addTo(map);
      const statusColor =
        alert.status === 'new' ? 'red' :
        alert.status === 'acknowledged' ? 'orange' :
        'green';

      marker.setIcon(
        L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color:${statusColor};width:20px;height:20px;border-radius:50%;border:2px solid white;box-shadow:0 0 10px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })
      );
      marker.bindPopup(
        `<strong>SOS Alert #${alert.id}</strong><br/>Status: ${alert.status}<br/>Time: ${new Date(alert.timestamp).toLocaleString()}`
      );
    });
  }, [sosAlerts]);

  const fetchSOSAlerts = async () => {
    const mockData: SOSAlert[] = [
      { id: 1, timestamp: new Date().toISOString(), location_lat: 20.8880, location_lon: 70.4013, status: 'new', description: 'Medical assistance needed near Main Temple Entrance.' },
      { id: 2, timestamp: new Date().toISOString(), location_lat: 20.8845, location_lon: 70.4085, status: 'acknowledged', description: 'Crowd control requested at Triveni Sangam Ghat.' },
      { id: 3, timestamp: new Date().toISOString(), location_lat: 20.8885, location_lon: 70.4008, status: 'new', description: 'Suspicious activity reported near west gate.' },
    ];
    setSosAlerts(mockData);
  };

  const handleAcknowledge = async (alertId: number) => {
    setSosAlerts(currentAlerts =>
      currentAlerts.map(alert =>
        alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
      )
    );
  };

  const handleResolve = async (alertId: number) => {
    setSosAlerts(currentAlerts =>
      currentAlerts.map(alert =>
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'error';
      case 'acknowledged': return 'warning';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const activeAlerts = sosAlerts.filter(alert => alert.status !== 'resolved');

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Emergency Management
      </Typography>

      {activeAlerts.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {activeAlerts.length} active SOS alert(s) require attention
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Active SOS Alerts</Typography>
              {activeAlerts.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No active alerts
                </Typography>
              ) : (
                <List sx={{ p: 0 }}>
                  {activeAlerts.map((alert) => (
                    <ListItem key={alert.id} divider sx={{ alignItems: 'flex-start', py: 2 }}>
                      {/* FIX: Moved actions inside the primary prop for better alignment */}
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {`SOS Alert #${alert.id}`}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip label={alert.status} color={getStatusColor(alert.status) as any} size="small" />
                              {alert.status === 'new' && (
                                <IconButton title="Acknowledge" size="small" onClick={() => handleAcknowledge(alert.id)} color="primary">
                                  <CheckCircle />
                                </IconButton>
                              )}
                              {alert.status === 'acknowledged' && (
                                <IconButton title="Resolve" size="small" onClick={() => handleResolve(alert.id)} color="success">
                                  <Cancel />
                                </IconButton>
                              )}
                            </Box>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {new Date(alert.timestamp).toLocaleString()}
                            </Typography>
                            <Typography component="span" variant="body2" color="text.secondary">
                                {alert.description && ` — ${alert.description}`}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Emergency Map</Typography>
              <Box
                ref={mapContainerRef}
                sx={{
                  width: '100%',
                  height: 400,
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Emergency Actions</Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant="contained" color="error" startIcon={<LocationOn />}>
                    Contact Emergency Services
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    Send Mass Notification
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="secondary">
                    Activate Emergency Protocol
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmergencyPage;