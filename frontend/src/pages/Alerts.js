import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Card, CardContent,
  Chip, Button, Alert, LinearProgress, useMediaQuery, useTheme
} from '@mui/material';
import { Warning, Refresh, Psychology } from '@mui/icons-material';
import { apiService } from '../services/api';
import ShareButton from '../components/ShareButton';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [message, setMessage] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const [alertsResponse, sensorResponse] = await Promise.all([
        apiService.getAlerts(),
        apiService.getSensorStatus()
      ]);
      setAlerts(alertsResponse.data.data);
      setSensorData(sensorResponse.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerPrediction = async () => {
    setPredicting(true);
    try {
      const response = await apiService.triggerPrediction({ location: 'Guwahati' });
      setMessage(`Prediction completed: ${response.data.prediction.risk_category} risk`);
      fetchAlerts(); // Refresh alerts after prediction
    } catch (error) {
      setMessage('Error running prediction');
    } finally {
      setPredicting(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'outbreak': return '🦠';
      case 'water_quality': return '💧';
      case 'weather': return '🌧️';
      default: return '⚠️';
    }
  };

  if (loading) return <LinearProgress />;

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: { xs: 2, sm: 3, md: 4 }, 
        mb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: { xs: 2, sm: 3 },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography 
          variant="h4"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Alerts & Predictions
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 2 }
        }}>
          <ShareButton 
            sensorData={sensorData}
            alerts={alerts}
            variant="contained"
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAlerts}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Psychology />}
            onClick={triggerPrediction}
            disabled={predicting}
            sx={{ backgroundColor: '#9c27b0', '&:hover': { backgroundColor: '#7b1fa2' } }}
          >
            {predicting ? 'Predicting...' : 'Run Prediction'}
          </Button>
        </Box>
      </Box>

      {message && (
        <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
        {alerts.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Warning sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No active alerts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The system is monitoring for potential health risks
              </Typography>
            </Paper>
          </Grid>
        ) : (
          alerts.map((alert, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ 
                  flex: 1,
                  p: { xs: 2, sm: 2, md: 3 }
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">
                        {getTypeIcon(alert.type)}
                      </Typography>
                      <Typography variant="h6">
                        {alert.type.replace('_', ' ').toUpperCase()}
                      </Typography>
                    </Box>
                    <Chip
                      label={alert.severity}
                      color={getSeverityColor(alert.severity)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {alert.message}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      📍 {alert.location}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(alert.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  
                  {alert.prediction && (
                    <Box sx={{ 
                      mt: 2, 
                      p: { xs: 1.5, sm: 2 }, 
                      bgcolor: 'grey.100', 
                      borderRadius: 1 
                    }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Prediction Details:
                      </Typography>
                      <Typography variant="body2">
                        Risk Level: {(alert.prediction.risk_level * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2">
                        Category: {alert.prediction.risk_category}
                      </Typography>
                      {alert.prediction.factors && alert.prediction.factors.length > 0 && (
                        <Box sx={{ 
                          mt: 1,
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.5
                        }}>
                          <Typography variant="caption">Risk Factors:</Typography>
                          {alert.prediction.factors.map((factor, i) => (
                            <Chip 
                              key={i} 
                              label={factor} 
                              size="small" 
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Alerts;