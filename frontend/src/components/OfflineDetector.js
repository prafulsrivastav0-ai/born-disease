import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Box, Typography } from '@mui/material';
import { WifiOff, Wifi } from '@mui/icons-material';

const OfflineDetector = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: '#f44336',
        color: 'white',
        p: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1
      }}>
        <WifiOff />
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          No Internet Connection - Using cached data
        </Typography>
      </Box>
    );
  }

  return (
    <Snackbar
      open={showOfflineMessage && isOnline}
      autoHideDuration={3000}
      onClose={() => setShowOfflineMessage(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={() => setShowOfflineMessage(false)} 
        severity="success"
        icon={<Wifi />}
      >
        Connection restored!
      </Alert>
    </Snackbar>
  );
};

export default OfflineDetector;