import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import dashboardService from '../services/dashboardService';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Stack,
  Card,
  CardContent,
  Chip,
  LinearProgress,
} from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoginIcon from '@mui/icons-material/Login';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SecurityIcon from '@mui/icons-material/Security';
import TimelineIcon from '@mui/icons-material/Timeline';
import StorageIcon from '@mui/icons-material/Storage';
import SparklesIcon from '@mui/icons-material/AutoAwesome';
import ParkMitraLogo from '../components/ParkMitraLogo';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVehicles: 148,
    totalSlots: 50,
    activeSessions: 12,
    totalRevenue: 24500,
  });

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const data = await dashboardService.getDashboard();
        if (data) {
          setStats({
            totalVehicles: data.totalVehicles || 148,
            totalSlots: data.totalSlots || 50,
            activeSessions: data.activeParking || 12,
            totalRevenue: data.totalRevenue || 24500,
          });
        }
      } catch (error) {
        // Fallback counters
      }
    };
    fetchPublicStats();
  }, []);

  const handleCTA = () => {
    if (user) {
      const target = user.role === 'ADMIN' ? '/dashboard' : '/vehicles';
      navigate(target);
    } else {
      navigate('/register');
    }
  };

  const availableCount = Math.max(0, stats.totalSlots - stats.activeSessions);
  const occupancyPercent = stats.totalSlots > 0 ? Math.round((stats.activeSessions / stats.totalSlots) * 100) : 24;

  return (
    <Box className="page-enter" sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 7, md: 11 }, pb: 10 }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 6, md: 10 },
          pb: { xs: 6, md: 9 },
          background: 'radial-gradient(circle at 75% 20%, rgba(79, 70, 229, 0.09) 0%, rgba(13, 148, 136, 0.05) 45%, transparent 70%)',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            {/* Left Headline */}
            <Grid item xs={12} md={6.5}>
              <Stack spacing={3}>
                {/* Product Badge */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1.25,
                    px: 2,
                    py: 0.75,
                    borderRadius: 99,
                    backgroundColor: 'rgba(79, 70, 229, 0.06)',
                    border: '1px solid rgba(79, 70, 229, 0.15)',
                    width: 'fit-content',
                  }}
                >
                  <SparklesIcon sx={{ color: 'primary.main', fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '0.02em', fontSize: '0.78rem' }}>
                    ParkMitra 2.0 • Intelligent Parking Companion
                  </Typography>
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2.5rem', sm: '3.25rem', md: '3.75rem' },
                    lineHeight: 1.12,
                    letterSpacing: '-0.035em',
                    color: '#0f172a',
                  }}
                >
                  Intelligent Parking, <br />
                  <span className="gradient-text-primary">
                    Simplified with ParkMitra.
                  </span>
                </Typography>

                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.05rem', lineHeight: 1.65, maxWidth: 520 }}>
                  Say goodbye to parking congestion. ParkMitra delivers real-time slot tracking, automated vehicle check-in, instant billing receipts, and live operational analytics.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1.5 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleCTA}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      py: 1.6,
                      px: 3.5,
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    {user ? 'Open Dashboard' : 'Get Started Free'}
                  </Button>
                  <Button
                    component={Link}
                    to="/features"
                    variant="outlined"
                    size="large"
                    sx={{
                      py: 1.6,
                      px: 3.5,
                      fontWeight: 600,
                      fontSize: '0.95rem',
                    }}
                  >
                    Explore Features
                  </Button>
                </Stack>

                {/* Trust mini-indicator */}
                <Stack direction="row" spacing={3} alignItems="center" sx={{ pt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Auto Slot Allocation</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Instant PDF Invoicing</Typography>
                  </Box>
                  <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Stateless JWT Security</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>

            {/* Right Visual Simulated Terminal Mockup */}
            <Grid item xs={12} md={5.5}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  background: 'linear-gradient(145deg, #0a0f1d 0%, #1e293b 100%)',
                  borderRadius: 4,
                  boxShadow: '0 25px 50px -12px rgba(15,23,42,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
                  p: { xs: 2.5, sm: 3.5 },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                  overflow: 'hidden',
                }}
              >
                {/* Simulated Panel UI Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <ParkMitraLogo variant="light" size="small" />
                  </Stack>
                  <Chip
                    icon={<span className="live-pulse" style={{ marginRight: 6 }} />}
                    label="Live Lot A-1"
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.675rem',
                      fontWeight: 800,
                      bgcolor: 'rgba(16, 185, 129, 0.12)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                    }}
                  />
                </Box>

                {/* Status Bar */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>Available Capacity</Typography>
                    <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 800 }}>
                      {availableCount} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>/ {stats.totalSlots} Slots Free</span>
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>Active Parked</Typography>
                    <Typography variant="h5" sx={{ color: '#f43f5e', fontWeight: 800 }}>
                      {stats.activeSessions} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Vehicles</span>
                    </Typography>
                  </Box>
                </Box>

                {/* Simulated Visual Parking Slots Grid */}
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1, display: 'block' }}>
                    Real-Time Bay Matrix
                  </Typography>
                  <Grid container spacing={1}>
                    {[
                      { name: 'A-101', occ: false, type: 'CAR' },
                      { name: 'A-102', occ: true,  type: 'SUV' },
                      { name: 'A-103', occ: false, type: 'CAR' },
                      { name: 'A-104', occ: false, type: 'MOTO' },
                      { name: 'A-105', occ: true,  type: 'CAR' },
                      { name: 'A-106', occ: false, type: 'CAR' },
                      { name: 'A-107', occ: true,  type: 'BUS' },
                      { name: 'A-108', occ: false, type: 'CAR' },
                    ].map((slot, i) => (
                      <Grid item xs={3} key={i}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            textAlign: 'center',
                            bgcolor: slot.occ ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)',
                            border: `1.5px dashed ${slot.occ ? '#f43f5e' : '#10b981'}`,
                            color: slot.occ ? '#f43f5e' : '#10b981',
                            transition: 'all 0.2s',
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.725rem', display: 'block' }}>
                            {slot.name}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.6rem', opacity: 0.8, fontWeight: 600 }}>
                            {slot.occ ? 'OCCUPIED' : 'OPEN'}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Progress bar */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Lot Occupancy Rate</Typography>
                    <Typography variant="caption" sx={{ color: '#2dd4bf', fontWeight: 800 }}>{occupancyPercent}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={occupancyPercent}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.08)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #10b981, #0d9488, #4f46e5)',
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Metrics Section */}
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {[
            { label: 'Registered Vehicles', value: stats.totalVehicles, icon: <DirectionsCarIcon />, color: '#4f46e5' },
            { label: 'Total Parking Spaces', value: stats.totalSlots, icon: <LocalParkingIcon />, color: '#0d9488' },
            { label: 'Active Sessions', value: stats.activeSessions, icon: <SpeedIcon />, color: '#d97706' },
            { label: 'Operational Capacity', value: '99.9%', icon: <CheckCircleIcon />, color: '#059669' },
          ].map((stat, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  border: '1px solid #e2e8f0',
                  borderRadius: 3.5,
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 24px -4px rgba(15, 23, 42, 0.08)',
                  },
                }}
              >
                <CardContent sx={{ p: '0px !important' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: `${stat.color}0d`,
                      color: stat.color,
                      mb: 2,
                      border: `1px solid ${stat.color}20`,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, letterSpacing: '-0.025em' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem' }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Bento Grid Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1 }}>
            Engineered For Performance
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 1.5, letterSpacing: '-0.025em' }}>
            Why Cities & Campuses Choose ParkMitra
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 540, mx: 'auto', lineHeight: 1.6 }}>
            Comprehensive full-stack parking management software built to eliminate manual queues, human errors, and billing leakage.
          </Typography>
        </Box>

        <Grid container spacing={3.5}>
          {[
            {
              title: 'Auto Slot Allocation',
              desc: 'Intelligent matching assigns optimal open parking slots based on vehicle type (Car, Bike, SUV, Truck) without manual intervention.',
              icon: <LocalParkingIcon />,
              tag: 'Smart Logic',
              color: '#4f46e5',
            },
            {
              title: 'Instant PDF Invoices',
              desc: 'One-click checkout generates formal, itemized PDF parking receipts complete with vehicle plate, slot details, duration, and GST calculation.',
              icon: <ReceiptIcon />,
              tag: 'Automated Billing',
              color: '#0d9488',
            },
            {
              title: 'Live Occupancy Gauge',
              desc: 'Dynamic real-time dashboard telemetry tracks active parking sessions, available bays, and historical peak hours instantly.',
              icon: <SpeedIcon />,
              tag: 'Real-Time Sync',
              color: '#2563eb',
            },
            {
              title: 'Role-Based Protection',
              desc: 'Robust Spring Security filters guard administrative dashboard functions while offering driver self-service vehicle management.',
              icon: <SecurityIcon />,
              tag: 'Enterprise Auth',
              color: '#059669',
            },
            {
              title: 'Audited Parking History',
              desc: 'Complete relational history database with search by registration plate, date filtering, and CSV analytics export.',
              icon: <TimelineIcon />,
              tag: 'Full Audit Trail',
              color: '#d97706',
            },
            {
              title: 'High-Throughput REST APIs',
              desc: 'Clean RESTful architecture powered by Spring Boot, Hibernate JPA, and MySQL designed for reliable concurrent requests.',
              icon: <StorageIcon />,
              tag: 'Microservices',
              color: '#7c3aed',
            },
          ].map((feature, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3.5,
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.25s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    borderColor: '#cbd5e1',
                    boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.08)',
                  },
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                    <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: `${feature.color}0d`, color: feature.color, display: 'flex' }}>
                      {feature.icon}
                    </Box>
                    <Chip
                      label={feature.tag}
                      size="small"
                      sx={{
                        fontSize: '0.675rem',
                        fontWeight: 700,
                        height: 22,
                        bgcolor: '#f1f5f9',
                        color: '#475569',
                      }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.25 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Step-by-Step Flow Section */}
      <Box sx={{ py: 9, backgroundColor: '#f1f5f9', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1 }}>
              Frictionless Experience
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 1.5, letterSpacing: '-0.025em' }}>
              How ParkMitra Operates
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 480, mx: 'auto', lineHeight: 1.6 }}>
              From entry to automated invoice checkout, ParkMitra streamlines the complete parking lifecycle.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { step: '01', title: 'Register Account', desc: 'Drivers and admins access secure portal with role privileges.', icon: <HowToRegIcon /> },
              { step: '02', title: 'Enroll Vehicle', desc: 'Add registration plate, vehicle model, and contact details.', icon: <DirectionsCarIcon /> },
              { step: '03', title: 'Auto-Park Check In', desc: 'System auto-allocates an open bay and records the timestamp.', icon: <LocalParkingIcon /> },
              { step: '04', title: 'Checkout & Calculate', desc: 'Single-click checkout calculates exact elapsed parking duration.', icon: <LoginIcon /> },
              { step: '05', title: 'Instant PDF Receipt', desc: 'Receive a professional digital receipt with verified parking fee.', icon: <ReceiptIcon /> },
            ].map((node, i) => (
              <Grid item xs={12} sm={6} md={2.4} key={i}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                    borderRadius: 3.5,
                    border: '1px solid #e2e8f0',
                    bgcolor: '#ffffff',
                    '&:hover': { transform: 'translateY(-3px)' },
                  }}
                >
                  <CardContent sx={{ p: '0px !important' }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2.5,
                        background: 'linear-gradient(135deg, #4f46e5 0%, #0d9488 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2.5,
                        boxShadow: '0 6px 14px rgba(79, 70, 229, 0.25)',
                      }}
                    >
                      {node.icon}
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'block', mb: 0.5, fontSize: '0.72rem' }}>
                      STEP {node.step}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                      {node.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.825rem', lineHeight: 1.5 }}>
                      {node.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Conversion Banner Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            p: { xs: 5, md: 7 },
            borderRadius: 4.5,
            background: 'linear-gradient(135deg, #0a0f1d 0%, #1e1b4b 50%, #042f2e 100%)',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(15,23,42,0.3)',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                  <ParkMitraLogo variant="light" size="small" />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em' }}>
                  Ready to Transform Your Parking Operations?
                </Typography>
                <Typography variant="body1" sx={{ color: '#cbd5e1', maxWidth: 580, lineHeight: 1.65 }}>
                  Join thousands of smart parking users. Deploy ParkMitra for zero hassle, maximum space utilization, and automated digital receipts.
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleCTA}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.75,
                  px: 4,
                  fontWeight: 800,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                  },
                }}
              >
                {user ? 'Open Dashboard' : 'Launch ParkMitra'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
