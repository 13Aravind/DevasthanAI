// src/components/admin/AnalyticsPage.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PredictionData {
  timestamp: string;
  predicted_count: number;
  confidence: number;
}

interface HistoricalData {
  timestamp: string;
  person_count: number;
}

const AnalyticsPage: React.FC = () => {
  const [predictionData, setPredictionData] = useState<PredictionData[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  useEffect(() => {
    fetchPredictionData();
    fetchHistoricalData();
  }, []);

  const fetchPredictionData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/prediction_data');
      if (response.ok) {
        const data = await response.json();
        setPredictionData(data.predictions || []);
      }
    } catch (error) {
      console.error('Error fetching prediction data:', error);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/crowd_data/history?limit=50');
      if (response.ok) {
        const data = await response.json();
        setHistoricalData(data || []);
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  // Prepare chart data for historical - reverse to show oldest first
  const historicalChartData = {
    labels: historicalData
      .map(item => new Date(item.timestamp).toLocaleTimeString())
      .reverse(),
    datasets: [
      {
        label: 'Historical Crowd Count',
        data: historicalData
          .map(item => item.person_count)
          .reverse(),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  // Prepare chart data for predictions
  const predictionChartData = {
    labels: predictionData.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Predicted Count',
        data: predictionData.map(item => item.predicted_count),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
        yAxisID: 'y',
      },
      {
        label: 'Confidence (%)',
        data: predictionData.map(item => item.confidence * 100),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.1,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Person Count',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Confidence (%)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Calculate summary analytics safely
  const averageCount = historicalData.length
    ? Math.round(historicalData.reduce((sum, item) => sum + item.person_count, 0) / historicalData.length)
    : 0;

  const peakCount = historicalData.length
    ? Math.max(...historicalData.map(item => item.person_count))
    : 0;

  const averageConfidence = predictionData.length
    ? Math.round((predictionData.reduce((sum, item) => sum + item.confidence, 0) / predictionData.length) * 100)
    : 0;

  const predictedPeak = predictionData.length
    ? Math.max(...predictionData.map(item => item.predicted_count))
    : 0;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Analytics & Forecasting
      </Typography>

      <Grid container spacing={3}>
        {/* Historical Data Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Historical Crowd Data
              </Typography>
              <Box sx={{ height: 300, position: 'relative' }}>
                <Line data={historicalChartData} options={chartOptions as any} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Prediction Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                12-Hour Forecast
              </Typography>
              <Box sx={{ height: 300, position: 'relative' }}>
                <Line data={predictionChartData} options={chartOptions as any} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Analytics Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Analytics Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {averageCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Count
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {peakCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Peak Count
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {averageConfidence}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Confidence
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {predictedPeak}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Predicted Peak
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage;