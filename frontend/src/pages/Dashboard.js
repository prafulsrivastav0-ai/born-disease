import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Card, CardContent,
  LinearProgress, Chip, Alert, useMediaQuery, useTheme
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiService } from '../services/api';
import SensorStatus from '../components/SensorStatus';
import ShareButton from '../components/ShareButton';

const dashboardStyles = {
  background: 'linear-gradient(135deg, #2E8B57 0%, #228B22 100%)',
  minHeight: '100vh',
  backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(46, 139, 87, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(34, 139, 34, 0.2) 0%, transparent 50%)',
  position: 'relative',
  backgroundAttachment: 'fixed',
  '@media (max-width: 768px)': {
    backgroundAttachment: 'scroll'
  }
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchDashboardData();
    fetchSensorData();
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchSensorData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiService.getDashboardData();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSensorData = async () => {
    try {
      const response = await apiService.getSensorStatus();
      setSensorData(response.data);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  if (loading) return <LinearProgress />;
  if (!dashboardData) return <Alert severity="error">Failed to load dashboard data</Alert>;

  const { stats, alerts = [], waterData, healthCases, weather } = dashboardData;

  return (
    <Box sx={dashboardStyles}>
    <Container 
      maxWidth="xl" 
      sx={{ 
        pt: { xs: 2, sm: 3, md: 4 }, 
        pb: { xs: 2, sm: 3, md: 4 }, 
        px: { xs: 1, sm: 2, md: 3 },
        position: 'relative', 
        zIndex: 1 
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'center', sm: 'flex-start' },
        mb: { xs: 2, sm: 3, md: 4 },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: 'white', 
            fontWeight: 'bold', 
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            textAlign: { xs: 'center', sm: 'left' },
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
            lineHeight: { xs: 1.2, sm: 1.167, md: 1.167 }
          }}
        >
          Health Monitoring Dashboard
        </Typography>
        
        <ShareButton 
          sensorData={sensorData}
          alerts={alerts || []}
          variant="contained"
        />
      </Box>

      {/* Sensor Status */}
      <SensorStatus />

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} sx={{ mb: { xs: 2, sm: 3, md: 3 } }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
            color: 'white', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            height: '100%'
          }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, textAlign: 'center' }}>
              <Typography sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }} gutterBottom>
                Active Sensors
              </Typography>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}>
                {stats.activeSensors}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
            color: 'white', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            height: '100%'
          }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, textAlign: 'center' }}>
              <Typography sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }} gutterBottom>
                Cases (7 days)
              </Typography>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}>
                {stats.totalCases}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 
            color: 'white', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            height: '100%'
          }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, textAlign: 'center' }}>
              <Typography sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }} gutterBottom>
                Active Alerts
              </Typography>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}>
                {stats.activeAlerts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', 
            color: '#333', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            height: '100%'
          }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, textAlign: 'center' }}>
              <Typography sx={{ 
                color: 'rgba(0,0,0,0.7)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }} gutterBottom>
                Weather
              </Typography>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}>
                {weather.temperature.toFixed(1)}°C
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {weather.forecast}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
        {/* Water Quality Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ 
            p: { xs: 2, sm: 2, md: 3 }, 
            background: 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(10px)', 
            borderRadius: 3, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            mb: { xs: 2, lg: 0 }
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
              Water Quality Trends
            </Typography>
            <ResponsiveContainer width="100%" height={{ xs: 250, sm: 300, md: 350 }}>
              <LineChart data={waterData.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                <YAxis />
                <Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} />
                <Line type="monotone" dataKey="pH" stroke="#8884d8" name="pH" />
                <Line type="monotone" dataKey="turbidity" stroke="#82ca9d" name="Turbidity" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ 
            p: { xs: 2, sm: 2, md: 3 }, 
            background: 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(10px)', 
            borderRadius: 3, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
              Recent Alerts
            </Typography>
            <Box sx={{ 
              maxHeight: { xs: 250, sm: 300, lg: 300 }, 
              overflow: 'auto',
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '3px' }
            }}>
              {alerts.map((alert, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Chip
                    label={alert.severity}
                    color={alert.severity === 'critical' ? 'error' : alert.severity === 'high' ? 'warning' : 'info'}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2">
                    {alert.message}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(alert.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Health Cases */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: { xs: 2, sm: 2, md: 3 }, 
            background: 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(10px)', 
            borderRadius: 3, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            mt: { xs: 2, sm: 2, md: 0 }
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
              Recent Health Cases
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 0.5, sm: 1 },
              maxHeight: { xs: 200, sm: 'none' },
              overflow: { xs: 'auto', sm: 'visible' }
            }}>
              {healthCases.slice(0, 10).map((case_, index) => (
                <Chip
                  key={index}
                  label={`${case_.location}: ${case_.disease} (${case_.severity})`}
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.8125rem' } }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Footer */}
      <Box sx={{ 
        mt: { xs: 3, sm: 4 }, 
        py: { xs: 2, sm: 3 }, 
        px: { xs: 1, sm: 2 },
        textAlign: 'center', 
        background: 'rgba(255,255,255,0.1)', 
        backdropFilter: 'blur(10px)', 
        borderRadius: 2, 
        border: '1px solid rgba(255,255,255,0.2)' 
      }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'black', 
            fontWeight: 'bold',
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            lineHeight: 1.4
          }}
        >
          Smart Community Health Monitoring System | Developed by{' '}
          <span style={{
            background: 'linear-gradient(45deg, #FFD700, #FF6B6B)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            fontWeight: 'bold', 
            fontSize: isMobile ? '1em' : '1.2em'
          }}>
            AquaRakshak
          </span>
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'black',
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            display: 'block',
            mt: 0.5
          }}
        >
          Protecting rural communities through intelligent health monitoring
        </Typography>
      </Box>
    </Container>
    </Box>
  );
};

export default Dashboard;