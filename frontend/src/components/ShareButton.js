import React, { useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, IconButton, Snackbar, Alert, useMediaQuery, useTheme
} from '@mui/material';
import {
  Share, WhatsApp, Email, ContentCopy, Close
} from '@mui/icons-material';

const ShareButton = ({ sensorData, alerts = [], variant = 'contained' }) => {
  const [shareDialog, setShareDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const generateShareMessage = () => {
    const projectName = "Smart Health Monitor by AquaRakshak";
    const currentTime = new Date().toLocaleString();
    
    let message = `🏥 ${projectName}\n📅 ${currentTime}\n\n`;
    
    // Water meter status
    if (sensorData) {
      if (sensorData.connected && sensorData.currentReading) {
        message += `💧 Water Meter: Connected ✅\n`;
        message += `📊 Current Readings:\n`;
        message += `• pH: ${sensorData.currentReading.pH?.toFixed(1)}\n`;
        message += `• Turbidity: ${sensorData.currentReading.turbidity?.toFixed(1)} NTU\n`;
        message += `• Contamination: ${sensorData.currentReading.contaminationLevel?.toFixed(1)} ppm\n`;
        message += `📍 Location: ${sensorData.currentReading.location}\n\n`;
      } else {
        message += `⚠️ Water Meter: Not Connected ❌\n`;
        message += `🔧 Please check sensor connection\n\n`;
      }
    }
    
    // Active alerts
    if (alerts.length > 0) {
      message += `🚨 Active Alerts (${alerts.length}):\n`;
      alerts.slice(0, 3).forEach((alert, index) => {
        const severityIcon = alert.severity === 'critical' ? '🔴' : 
                           alert.severity === 'high' ? '🟠' : 
                           alert.severity === 'medium' ? '🟡' : '🟢';
        message += `${severityIcon} ${alert.message}\n`;
        message += `📍 ${alert.location}\n`;
        if (index < Math.min(alerts.length, 3) - 1) message += `\n`;
      });
      if (alerts.length > 3) {
        message += `\n... and ${alerts.length - 3} more alerts`;
      }
    } else {
      message += `✅ No active alerts - System monitoring normally`;
    }
    
    message += `\n\n🌐 Access Dashboard: ${window.location.origin}`;
    message += `\n\n#WaterQuality #HealthMonitoring #AquaRakshak`;
    
    return message;
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: 'Smart Health Monitor - Water Quality Update',
      text: generateShareMessage(),
      url: window.location.origin
    };

    try {
      // Check for Web Share API support
      if (navigator.share && typeof navigator.share === 'function') {
        // Additional check for canShare if available
        if (!navigator.canShare || navigator.canShare(shareData)) {
          await navigator.share(shareData);
          setSnackbar({ open: true, message: 'Shared successfully!', severity: 'success' });
          return;
        }
      }
      // Fallback to custom dialog
      setShareDialog(true);
    } catch (error) {
      // User cancelled or error occurred
      if (error.name !== 'AbortError') {
        console.log('Share failed, showing dialog:', error.message);
        setShareDialog(true);
      }
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(generateShareMessage());
    const url = `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
    setShareDialog(false);
    setSnackbar({ open: true, message: 'Opening WhatsApp...', severity: 'success' });
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Smart Health Monitor - Water Quality Alert');
    const body = encodeURIComponent(generateShareMessage());
    const url = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = url;
    setShareDialog(false);
    setSnackbar({ open: true, message: 'Opening email client...', severity: 'success' });
  };

  const handleCopyLink = async () => {
    const message = generateShareMessage();
    try {
      // Modern clipboard API
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(message);
        setSnackbar({ open: true, message: 'Message copied to clipboard!', severity: 'success' });
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = message;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setSnackbar({ open: true, message: 'Message copied to clipboard!', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: 'Copy failed - please copy manually', severity: 'warning' });
        }
      }
    } catch (error) {
      console.error('Copy failed:', error);
      setSnackbar({ open: true, message: 'Copy failed - please copy manually', severity: 'warning' });
    }
    setShareDialog(false);
  };

  return (
    <>
      <Button
        variant={variant}
        startIcon={<Share />}
        onClick={handleNativeShare}
        sx={{
          backgroundColor: variant === 'contained' ? '#1976d2' : 'transparent',
          color: variant === 'contained' ? 'white' : '#1976d2',
          border: variant === 'outlined' ? '1px solid #1976d2' : 'none',
          '&:hover': {
            backgroundColor: variant === 'contained' ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
          },
          fontSize: { xs: '0.8rem', sm: '0.875rem' },
          px: { xs: 2, sm: 3 },
          py: { xs: 1, sm: 1.5 }
        }}
      >
        Share Status
      </Button>

      {/* Share Dialog for Desktop */}
      <Dialog 
        open={shareDialog} 
        onClose={() => setShareDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Share Water Quality Status
          </Typography>
          <IconButton onClick={() => setShareDialog(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Share current water quality status and alerts with your team
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<WhatsApp />}
              onClick={handleWhatsAppShare}
              sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                color: '#25d366',
                borderColor: '#25d366',
                '&:hover': {
                  backgroundColor: 'rgba(37, 211, 102, 0.04)',
                  borderColor: '#25d366'
                }
              }}
            >
              Share via WhatsApp
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Email />}
              onClick={handleEmailShare}
              sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                color: '#1976d2',
                borderColor: '#1976d2'
              }}
            >
              Share via Email
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={handleCopyLink}
              sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                color: '#666',
                borderColor: '#666'
              }}
            >
              Copy Message to Clipboard
            </Button>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ pt: 2, px: 3, pb: 3 }}>
          <Button onClick={() => setShareDialog(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareButton;