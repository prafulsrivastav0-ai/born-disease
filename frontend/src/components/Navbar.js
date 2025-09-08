import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Dashboard, DataUsage, Warning, Menu, Close } from '@mui/icons-material';

const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/data-entry', label: 'Data Entry', icon: <DataUsage /> },
    { path: '/alerts', label: 'Alerts', icon: <Warning /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              backgroundColor: location.pathname === item.path ? 'rgba(25, 118, 210, 0.12)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
            <Typography 
              variant={isMobile ? 'h6' : 'h5'} 
              component="div" 
              sx={{ 
                flexShrink: 1,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                lineHeight: 1.2
              }}
            >
              Health Monitoring System
            </Typography>
            {!isMobile && (
              <Typography 
                variant="body2" 
                sx={{ 
                  ml: 2, 
                  fontWeight: 'bold', 
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent', 
                  fontSize: { sm: '0.875rem', md: '1rem' },
                  whiteSpace: 'nowrap'
                }}
              >
                by AquaRakshak
              </Typography>
            )}
          </Box>
          
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <Menu />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: { sm: 0.5, md: 1 } }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  variant={location.pathname === item.path ? 'outlined' : 'text'}
                  sx={{
                    minWidth: { sm: 'auto', md: 120 },
                    px: { sm: 1, md: 2 },
                    fontSize: { sm: '0.75rem', md: '0.875rem' }
                  }}
                >
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {item.label}
                  </Box>
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;