// src/components/Sidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Toolbar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import EmergencyIcon from '@mui/icons-material/Sos';
import DigitalTwinIcon from '@mui/icons-material/Public';

const drawerWidth = 260;

// Navigation menu items for admin routes with icons
const menuItems = [
  { text: 'Live Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/admin/analytics' },
  { text: 'Emergency', icon: <EmergencyIcon />, path: '/admin/emergency' },
  { text: 'Digital Twin', icon: <DigitalTwinIcon />, path: '/admin/digital-twin' },
];

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2,
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5" color="primary" sx={{ userSelect: 'none' }}>
          🛕 DevasthanAI
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ userSelect: 'none' }}>
          Divya Drishti
        </Typography>
      </Toolbar>

      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                borderRadius: '8px',
                py: 1.2,
                '&.active': {
                  backgroundColor: 'secondary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': { color: 'white' },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 153, 51, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main', minWidth: 48 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 500, color: 'text.primary' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
