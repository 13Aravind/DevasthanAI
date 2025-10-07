// src/components/admin/PrescriptiveAlertsCard.tsx

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Chip,
} from '@mui/material';
import { Lightbulb, TrendingUp } from '@mui/icons-material';

interface AlertData {
  level: string;
  message: string;
  suggestion: string;
}

interface PrescriptiveAlertsCardProps {
  alert?: AlertData;
}

const PrescriptiveAlertsCard: React.FC<PrescriptiveAlertsCardProps> = ({ alert }) => {
  // Map alert levels to MUI severity colors
  const getAlertSeverity = (level: string) => {
    switch (level) {
      case 'normal': return 'success';
      case 'moderate': return 'info';
      case 'high': return 'warning';
      case 'critical': return 'error';
      case 'extreme': return 'error';
      default: return 'info';
    }
  };

  // Map alert levels to emoji icons for intuitive display
  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'normal': return '✅';
      case 'moderate': return '⚠️';
      case 'high': return '🚨';
      case 'critical': return '🔴';
      case 'extreme': return '🆘';
      default: return 'ℹ️';
    }
  };

  if (!alert) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Lightbulb sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="h2">
              Prescriptive Alerts
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Lightbulb sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="h2">
            Prescriptive Alerts
          </Typography>
        </Box>

        <Alert
          severity={getAlertSeverity(alert.level) as any}
          sx={{ mb: 2 }}
          icon={<span>{getAlertIcon(alert.level)}</span>}
        >
          <Typography variant="body2" fontWeight="bold">
            {alert.message}
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TrendingUp sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" fontWeight="bold">
            Suggestion:
          </Typography>
        </Box>

        <Typography variant="body2" color="text.primary">
          {alert.suggestion}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Chip
            label={alert.level.toUpperCase()}
            color={getAlertSeverity(alert.level) as any}
            size="small"
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default PrescriptiveAlertsCard;
