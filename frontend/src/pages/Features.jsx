import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SparklesIcon from '@mui/icons-material/AutoAwesome';

const featuresList = [
  {
    title: 'Auto Slot Allocation',
    desc: 'ParkMitra uses an optimized matching algorithm that dynamically links incoming vehicles with open bays based on specific vehicle classification (CAR, BIKE, SUV, TRUCK).',
    icon: <LocalParkingIcon />,
    tag: 'Automated Logic',
    color: '#4f46e5',
  },
  {
    title: 'Fleet & Vehicle Enrollment',
    desc: 'Easily register personal and commercial vehicles with valid registration plates and mobile contact info. Instant uniqueness validation safeguards against duplicate fleet entries.',
    icon: <DirectionsCarIcon />,
    tag: 'Fleet Management',
    color: '#0d9488',
  },
  {
    title: 'Automated Check-Out & Billing',
    desc: 'Timestamped check-in and checkout calculations compute exact parking duration and determine tariffs per minute or hour with full accounting precision.',
    icon: <SpeedIcon />,
    tag: 'Real-Time Tariffs',
    color: '#2563eb',
  },
  {
    title: 'Instant Verified PDF Receipts',
    desc: 'Every completed parking session automatically creates a downloadable, printable PDF tax invoice receipt generated on the server using iText PDF engine.',
    icon: <ReceiptIcon />,
    tag: 'Printable Billing',
    color: '#10b981',
  },
  {
    title: 'Stateless Security & Protection',
    desc: 'All admin endpoints are secured with Spring Security and cryptographic JWT filters. Sensitive passwords are automatically encrypted via BCrypt hashing.',
    icon: <SecurityIcon />,
    tag: 'Enterprise Auth',
    color: '#7c3aed',
  },
  {
    title: 'CSV Audit & Operational Reports',
    desc: 'Generate complete transaction audit exports in standard CSV format for offline reporting, parking lot capacity audits, and monthly revenue compliance.',
    icon: <FileDownloadIcon />,
    tag: 'Data Export',
    color: '#f59e0b',
  },
];

const Features = () => {
  return (
    <Box className="page-enter" sx={{ py: { xs: 8, md: 11 }, background: 'radial-gradient(circle at 10% 80%, rgba(20, 184, 166, 0.08) 0%, transparent 50%)' }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 7, md: 9 } }}>
          <Chip
            icon={<SparklesIcon sx={{ fontSize: '14px !important', color: '#4f46e5 !important' }} />}
            label="ParkMitra Capabilities"
            size="small"
            sx={{
              fontWeight: 800,
              bgcolor: 'rgba(79, 70, 229, 0.08)',
              color: 'primary.main',
              letterSpacing: '0.04em',
              mb: 2,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-0.03em',
              mb: 2,
              color: '#0f172a',
            }}
          >
            Engineered For Seamless Parking
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 640, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.65 }}>
            Explore the core engineering functionalities that make ParkMitra an intelligent, production-ready smart parking solution.
          </Typography>
        </Box>

        {/* Feature Grid */}
        <Grid container spacing={3.5}>
          {featuresList.map((feat, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #e2e8f0',
                  borderRadius: 4,
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: '#cbd5e1',
                    boxShadow: '0 16px 32px -4px rgba(15, 23, 42, 0.08)',
                  },
                }}
              >
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 1.5,
                        borderRadius: 2.5,
                        bgcolor: `${feat.color}10`,
                        color: feat.color,
                      }}
                    >
                      {React.cloneElement(feat.icon, { sx: { fontSize: 26 } })}
                    </Box>
                    <Chip
                      label={feat.tag}
                      size="small"
                      sx={{
                        fontSize: '0.675rem',
                        fontWeight: 800,
                        bgcolor: '#f8fafc',
                        color: '#475569',
                        border: '1px solid #e2e8f0',
                      }}
                    />
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
                    {feat.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65, fontSize: '0.875rem' }}>
                    {feat.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;
