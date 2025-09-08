import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Paper, Grid, useMediaQuery, useTheme } from '@mui/material';
import { Sensors, SensorsOff, CheckCircle, Error } from '@mui/icons-material';
import { apiService } from '../services/api';
import ShareButton from './ShareButton';

const SensorStatus = () => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchSensorStatus = async () => {
    try {
      const response = await apiService.getSensorStatus();
      setSensorData(response.data);
    } catch (error) {
      console.error('Error fetching sensor status:', error);
      setSensorData({ connected: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorStatus();
    const interval = setInterval(fetchSensorStatus, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  const { connected, currentReading, lastUpdate } = sensorData;

  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: { xs: 2, sm: 3 },
        mb: { xs: 2, sm: 3 },
        background: connected 
          ? 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)'
          : 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
        border: `2px solid ${connected ? '#4caf50' : '#f44336'}`,
        borderRadius: 3
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'center', sm: 'flex-start' },
        gap: { xs: 2, sm: 3 }
      }}>
        {/* Status Indicator */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          minWidth: { xs: 'auto', sm: 200 }
        }}>
          {connected ? (
            <>
              <Sensors sx={{ color: '#4caf50', fontSize: { xs: 24, sm: 28 } }} />
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#2e7d32', 
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  Water Meter: Connected ✅
                </Typography>
                {lastUpdate && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#388e3c',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}
                  >
                    Last update: {new Date(lastUpdate).toLocaleTimeString()}
                  </Typography>
                )}
              </Box>
            </>
          ) : (
            <>
              <SensorsOff sx={{ color: '#f44336', fontSize: { xs: 24, sm: 28 } }} />
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#d32f2f', 
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  Water Meter: Not Connected
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#c62828',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                >
                  Check sensor connection
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {/* Sensor Readings */}
        {connected && currentReading && (
          <Box sx={{ flex: 1, width: '100%' }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1, 
                color: '#2e7d32', 
                fontWeight: 'bold',
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              Current Readings:
            </Typography>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              <Grid item xs={6} sm={3}>
                <Chip
                  icon={<CheckCircle />}
                  label={`pH: ${currentReading.pH?.toFixed(1)}`}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ 
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    fontWeight: 'bold',
                    width: '100%',
                    fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Chip
                  icon={<CheckCircle />}
                  label={`Turbidity: ${currentReading.turbidity?.toFixed(1)}`}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ 
                    backgroundColor: '#e3f2fd',
                    color: '#1565c0',
                    fontWeight: 'bold',
                    width: '100%',
                    fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Chip
                  icon={<CheckCircle />}
                  label={`Contamination: ${currentReading.contaminationLevel?.toFixed(1)}`}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ 
                    backgroundColor: '#fff3e0',
                    color: '#ef6c00',
                    fontWeight: 'bold',
                    width: '100%',
                    fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Chip
                  label={currentReading.location}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ 
                    backgroundColor: '#f3e5f5',
                    color: '#7b1fa2',
                    fontWeight: 'bold',
                    width: '100%',
                    fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Disconnected Message */}
        {!connected && (
          <Box sx={{ 
            flex: 1, 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            width: '100%'
          }}>
            <Chip
              icon={<Error />}
              label="No sensor data available"
              size={isMobile ? 'small' : 'medium'}
              sx={{ 
                backgroundColor: '#ffebee',
                color: '#d32f2f',
                fontWeight: 'bold',
                fontSize: { xs: '0.7rem', sm: '0.8125rem' }
              }}
            />
            <ShareButton 
              sensorData={sensorData}
              alerts={[]}
              variant="outlined"
            />
          </Box>
        )}
        
        {/* Quick Share for Connected State */}
        {connected && (
          <Box sx={{ 
            display: { xs: 'flex', sm: 'none' },
            justifyContent: 'center',
            mt: 2,
            width: '100%'
          }}>
            <ShareButton 
              sensorData={sensorData}
              alerts={[]}
              variant="outlined"
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default SensorStatus;