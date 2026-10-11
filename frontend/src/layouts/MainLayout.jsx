import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Tooltip,
  Button,
  useTheme,
  useMediaQuery,
  Stack,
  Breadcrumbs,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import ParkMitraLogo from '../components/ParkMitraLogo';

const DRAWER_OPEN_WIDTH = 250;
const DRAWER_COLLAPSED_WIDTH = 76;

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  // Sidebar states
  const [openMobile, setOpenMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isTablet);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Notification menu states
  const [notiAnchorEl, setNotiAnchorEl] = useState(null);
  const isNotiOpen = Boolean(notiAnchorEl);

  const handleNotiClick = (event) => setNotiAnchorEl(event.currentTarget);
  const handleNotiClose = () => setNotiAnchorEl(null);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard',       icon: <DashboardIcon />,   path: '/dashboard', roles: ['ADMIN'] },
    { text: 'Vehicles',        icon: <DirectionsCarIcon />, path: '/vehicles',  roles: ['ADMIN', 'USER'] },
    { text: 'Parking Slots',   icon: <LocalParkingIcon />, path: '/slots',     roles: ['ADMIN'] },
    { text: 'Park Vehicle',    icon: <PlayForWorkIcon sx={{ transform: 'rotate(90deg)' }} />, path: '/park', roles: ['ADMIN', 'USER'] },
    { text: 'Exit Vehicle',    icon: <ExitToAppIcon />,    path: '/exit',     roles: ['ADMIN', 'USER'] },
    { text: 'Parking History', icon: <HistoryIcon />,     path: '/history',  roles: ['ADMIN', 'USER'] },
    { text: 'Inquiries',       icon: <MarkEmailReadIcon />, path: '/inquiries', roles: ['ADMIN'] },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const currentPage = filteredMenuItems.find((item) => item.path === location.pathname);
  const currentPageTitle = currentPage?.text || 'ParkMitra';

  const drawerWidth = isMobile
    ? DRAWER_OPEN_WIDTH
    : isCollapsed
    ? DRAWER_COLLAPSED_WIDTH
    : DRAWER_OPEN_WIDTH;

  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#0a0f1d', // Obsidian slate background
        color: '#f8fafc',
        borderRight: '1px solid #1e293b',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          height: 68,
          px: isCollapsed && !isMobile ? 1.5 : 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed && !isMobile ? 'center' : 'space-between',
          borderBottom: '1px solid #1e293b',
        }}
      >
        {(!isCollapsed || isMobile) ? (
          <ParkMitraLogo variant="light" size="small" />
        ) : (
          <Tooltip title="ParkMitra" placement="right">
            <Box
              sx={{
                p: 0.75,
                borderRadius: 1.5,
                background: 'linear-gradient(135deg, #4f46e5 0%, #0d9488 100%)',
                display: 'flex',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
              }}
            >
              <LocalParkingIcon sx={{ fontSize: 20, color: '#fff' }} />
            </Box>
          </Tooltip>
        )}

        {isMobile && (
          <IconButton onClick={() => setOpenMobile(false)} sx={{ color: '#94a3b8' }} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2, px: 1.5 }}>
        <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {filteredMenuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <Tooltip title={isCollapsed && !isMobile ? item.text : ''} placement="right" arrow>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={() => isMobile && setOpenMobile(false)}
                    sx={{
                      borderRadius: 2,
                      py: 1.25,
                      px: isCollapsed && !isMobile ? 0 : 1.75,
                      justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                      transition: 'all 0.15s ease',
                      backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.14)' : 'transparent',
                      color: isSelected ? '#a5b4fc' : '#94a3b8',
                      position: 'relative',
                      border: isSelected ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff',
                        '& .MuiListItemIcon-root': {
                          color: '#ffffff',
                        },
                      },
                      '& .MuiListItemIcon-root': {
                        color: isSelected ? '#a5b4fc' : '#64748b',
                        minWidth: isCollapsed && !isMobile ? 0 : 36,
                        justifyContent: 'center',
                        transition: 'color 0.15s ease',
                      },
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    {(!isCollapsed || isMobile) && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: isSelected ? 700 : 500,
                          letterSpacing: '0.01em',
                        }}
                      />
                    )}
                    {isSelected && !isCollapsed && (
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 10,
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#14b8a6',
                          boxShadow: '0 0 6px #14b8a6',
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Sidebar Footer Profile */}
      <Box sx={{ borderTop: '1px solid #1e293b', p: 2 }}>
        {(!isCollapsed || isMobile) ? (
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Avatar
                sx={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #14b8a6 100%)',
                  width: 36,
                  height: 36,
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
                }}
              >
                {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#f8fafc',
                    fontWeight: 700,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '0.85rem',
                  }}
                >
                  {user?.fullName || user?.email?.split('@')[0] || 'User'}
                </Typography>
                <Chip
                  label={user?.role}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    mt: 0.25,
                    backgroundColor: user?.role === 'ADMIN' ? 'rgba(79, 70, 229, 0.25)' : 'rgba(13, 148, 136, 0.2)',
                    color: user?.role === 'ADMIN' ? '#c7d2fe' : '#5eead4',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </Box>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              size="small"
              onClick={handleLogout}
              startIcon={<LogoutIcon fontSize="small" />}
              sx={{
                py: 0.85,
                borderRadius: 2,
                borderColor: 'rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                fontSize: '0.8rem',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                },
              }}
            >
              Sign Out
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Tooltip title={user?.fullName || user?.email || 'User'} placement="right" arrow>
              <Avatar
                sx={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #14b8a6 100%)',
                  width: 36,
                  height: 36,
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </Tooltip>
            <Tooltip title="Sign Out" placement="right" arrow>
              <IconButton onClick={handleLogout} sx={{ color: '#f87171', p: 1, '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.08)' } }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
          ml: isMobile ? 0 : `${drawerWidth}px`,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          zIndex: theme.zIndex.drawer - 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter,
          }),
        }}
      >
        <Toolbar sx={{ px: 3, height: 68, display: 'flex', justifyContent: 'space-between' }}>
          {/* Left Block: Hamburger & Breadcrumbs */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
            <IconButton
              aria-label="toggle sidebar"
              onClick={handleDrawerToggle}
              sx={{
                color: '#475569',
                backgroundColor: '#f1f5f9',
                borderRadius: 2,
                p: 1,
                '&:hover': {
                  backgroundColor: '#e2e8f0',
                },
              }}
            >
              {isMobile ? <MenuIcon /> : isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>

            {/* Breadcrumb Navigation */}
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiBreadcrumbs-separator': { color: '#cbd5e1' },
              }}
            >
              <Link to="/" style={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
                <HomeIcon sx={{ mr: 0.5, fontSize: 17 }} />
              </Link>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>
                {currentPageTitle}
              </Typography>
            </Breadcrumbs>
          </Stack>

          {/* Right Block: Live Status, Notifications, User */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Live Status Badge */}
            <Chip
              icon={<span className="live-pulse" style={{ marginRight: 6 }} />}
              label="Live Sync"
              size="small"
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.08)',
                color: '#059669',
                fontWeight: 700,
                fontSize: '0.72rem',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                display: { xs: 'none', md: 'inline-flex' },
              }}
            />

            {/* Notifications Dropdown */}
            <Tooltip title="System Notifications">
              <IconButton
                size="small"
                onClick={handleNotiClick}
                sx={{
                  color: '#64748b',
                  bgcolor: '#f8fafc',
                  p: 1,
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                }}
              >
                <Badge badgeContent={2} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.625rem', height: 16, minWidth: 16 } }}>
                  <NotificationsIcon sx={{ fontSize: 18 }} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={notiAnchorEl}
              open={isNotiOpen}
              onClose={handleNotiClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  width: 300,
                  maxHeight: 380,
                  mt: 1.5,
                  borderRadius: 3,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e2e8f0',
                  p: 0.5,
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>ParkMitra Alerts</Typography>
                <Typography variant="caption" color="text.secondary">Real-time smart parking telemetry</Typography>
              </Box>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleNotiClose} sx={{ py: 1.25, borderRadius: 1.5 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>ParkMitra Gateway Online</Typography>
                  <Typography variant="caption" color="text.secondary">Stateless JWT session authentication active</Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleNotiClose} sx={{ py: 1.25, borderRadius: 1.5 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>Auto Slot Allocation Ready</Typography>
                  <Typography variant="caption" color="text.secondary">Live metrics and slot status synchronizing</Typography>
                </Box>
              </MenuItem>
            </Menu>

            {/* Profile Avatar / Quick Details */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <Avatar
                sx={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #14b8a6 100%)',
                  width: 34,
                  height: 34,
                  fontSize: '0.8rem',
                  fontWeight: 800,
                }}
              >
                {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Box sx={{ lineHeight: 1.2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: 'text.primary' }}>
                  {user?.fullName || user?.email?.split('@')[0]}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.675rem', fontWeight: 600 }}>
                  {user?.role}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{
          width: isMobile ? 0 : drawerWidth,
          flexShrink: 0,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter,
          }),
        }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={openMobile}
            onClose={() => setOpenMobile(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_OPEN_WIDTH, border: 'none' },
            }}
          >
            {sidebarContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                border: 'none',
                boxShadow: '4px 0 24px rgba(0,0,0,0.03)',
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.shorter,
                }),
                overflowX: 'hidden',
              },
            }}
          >
            {sidebarContent}
          </Drawer>
        )}
      </Box>

      {/* Main Content Layout Block */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          pt: '68px',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter,
          }),
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          className="page-enter"
          sx={{
            flexGrow: 1,
            width: '100%',
            py: { xs: 3, sm: 4 },
            px: { xs: 2.5, sm: 4, lg: 5 },
          }}
        >
          <Outlet />
        </Box>
        
        {/* Unified Layout Footer */}
        <Box
          component="footer"
          sx={{
            py: 2.5,
            px: { xs: 2.5, sm: 4, lg: 5 },
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            &copy; {new Date().getFullYear()} ParkMitra Management Platform.
          </Typography>
          <Stack direction="row" spacing={2.5}>
            <Link to="/about" style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>About ParkMitra</Link>
            <Link to="/contact" style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Contact Support</Link>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
