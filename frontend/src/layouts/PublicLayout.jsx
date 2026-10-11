import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  Container,
  Grid,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ParkMitraLogo from '../components/ParkMitraLogo';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/features' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const PublicLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAuthAction = () => {
    if (user) {
      const target = user.role === 'ADMIN' ? '/dashboard' : '/vehicles';
      navigate(target);
    } else {
      navigate('/login');
    }
  };

  const drawer = (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <ParkMitraLogo size="medium" />
        <IconButton onClick={handleDrawerToggle} size="small" sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Chip
          icon={<span className="live-pulse" style={{ marginRight: 6 }} />}
          label="Smart Parking Online"
          size="small"
          sx={{
            bgcolor: 'rgba(16, 185, 129, 0.08)',
            color: '#059669',
            fontWeight: 700,
            fontSize: '0.72rem',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        />
      </Box>

      <Divider />
      <List sx={{ my: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                backgroundColor: location.pathname === item.path ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                py: 1.25,
                '&:hover': {
                  backgroundColor: 'rgba(79, 70, 229, 0.04)',
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  fontSize: '0.9rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ pt: 2, borderTop: '1px solid #f1f5f9' }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            handleDrawerToggle();
            handleAuthAction();
          }}
          endIcon={<KeyboardArrowRightIcon />}
          sx={{
            py: 1.35,
            fontWeight: 700,
          }}
        >
          {user ? 'Open Dashboard' : 'Get Started'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Floating Glassmorphic Header */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          zIndex: theme.zIndex.drawer + 1,
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.03)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 72, display: 'flex', justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <ParkMitraLogo size="medium" />
            </Box>

            {/* Desktop Nav Items */}
            {!isMobile && (
              <Stack direction="row" spacing={1} alignItems="center">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.label}
                      component={Link}
                      to={item.path}
                      sx={{
                        color: isActive ? 'primary.main' : 'text.secondary',
                        fontWeight: isActive ? 700 : 500,
                        px: 2,
                        py: 0.85,
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        backgroundColor: isActive ? 'rgba(79, 70, 229, 0.06)' : 'transparent',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(79, 70, 229, 0.06)',
                          color: 'primary.main',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Stack>
            )}

            {/* Desktop CTA Buttons & Live Indicator */}
            {!isMobile ? (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Chip
                  icon={<span className="live-pulse" style={{ marginRight: 6 }} />}
                  label="Live System"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.08)',
                    color: '#059669',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    height: 26,
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    display: { xs: 'none', lg: 'inline-flex' },
                  }}
                />

                {!user ? (
                  <>
                    <Button
                      component={Link}
                      to="/login"
                      variant="text"
                      sx={{ color: 'text.primary', fontWeight: 600, px: 2 }}
                    >
                      Sign In
                    </Button>
                    <Button
                      component={Link}
                      to="/register"
                      variant="contained"
                      sx={{ px: 2.5 }}
                    >
                      Get Started
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleAuthAction}
                    variant="contained"
                    endIcon={<KeyboardArrowRightIcon fontSize="small" />}
                    sx={{ px: 2.5 }}
                  >
                    Open Dashboard
                  </Button>
                )}
              </Stack>
            ) : (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  color: 'text.primary',
                  backgroundColor: '#f1f5f9',
                  borderRadius: 2,
                  p: 1,
                }}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 290, border: 'none' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content View */}
      <Box
        component="main"
        className="page-enter"
        sx={{
          flexGrow: 1,
          pt: '72px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </Box>

      {/* Modern High-End Footer */}
      <Box
        sx={{
          bgcolor: '#0a0f1d',
          color: '#94a3b8',
          pt: { xs: 7, md: 9 },
          pb: 5,
          borderTop: '1px solid #1e293b',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.4), rgba(20, 184, 166, 0.4), transparent)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5} sx={{ mb: 6 }}>
            <Grid item xs={12} md={4}>
              <Stack spacing={2.5}>
                <ParkMitraLogo variant="light" size="medium" />
                <Typography variant="body2" sx={{ lineHeight: 1.7, color: '#94a3b8', maxWidth: 340, fontSize: '0.875rem' }}>
                  ParkMitra is an intelligent smart parking companion for seamless real-time slot monitoring, instant vehicle allocations, and automated billing.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    icon={<span className="live-pulse" style={{ marginRight: 6 }} />}
                    label="All Systems Operational"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.12)',
                      color: '#34d399',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      height: 24,
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                    }}
                  />
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={6} md={2.5}>
              <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 800, mb: 2.25, letterSpacing: '0.04em' }}>
                Navigation
              </Typography>
              <Stack spacing={1.5}>
                {navItems.map((item) => (
                  <Typography
                    key={item.label}
                    component={Link}
                    to={item.path}
                    variant="body2"
                    sx={{
                      color: '#94a3b8',
                      transition: 'color 0.15s ease',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      '&:hover': { color: '#ffffff' },
                    }}
                  >
                    {item.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 800, mb: 2.25, letterSpacing: '0.04em' }}>
                Architecture Stack
              </Typography>
              <Stack spacing={1.25} sx={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                <Typography variant="body2">Spring Boot REST microservices</Typography>
                <Typography variant="body2">React 19 & Material UI v9</Typography>
                <Typography variant="body2">JWT & Stateless Security</Typography>
                <Typography variant="body2">MySQL Relational Storage</Typography>
                <Typography variant="body2">Automated iText PDF Generator</Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={2.5}>
              <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 800, mb: 2.25, letterSpacing: '0.04em' }}>
                Get Started
              </Typography>
              <Stack spacing={1.5}>
                <Typography
                  component={Link}
                  to="/login"
                  variant="body2"
                  sx={{ color: '#94a3b8', transition: 'color 0.15s ease', fontSize: '0.85rem', '&:hover': { color: '#ffffff' } }}
                >
                  Admin & User Portal
                </Typography>
                <Typography
                  component={Link}
                  to="/register"
                  variant="body2"
                  sx={{ color: '#94a3b8', transition: 'color 0.15s ease', fontSize: '0.85rem', '&:hover': { color: '#ffffff' } }}
                >
                  Create New Account
                </Typography>
                <Typography
                  component={Link}
                  to="/contact"
                  variant="body2"
                  sx={{ color: '#94a3b8', transition: 'color 0.15s ease', fontSize: '0.85rem', '&:hover': { color: '#ffffff' } }}
                >
                  Contact Support
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: '#1e293b', mb: 3.5 }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              &copy; {new Date().getFullYear()} ParkMitra. Your Intelligent Smart Parking Companion.
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Full-Stack Engineering Capstone Platform.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicLayout;
