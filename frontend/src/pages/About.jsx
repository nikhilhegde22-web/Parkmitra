import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ParkMitraLogo from '../components/ParkMitraLogo';

const About = () => {
  return (
    <Box className="page-enter" sx={{ py: { xs: 8, md: 11 }, background: 'radial-gradient(circle at 85% 10%, rgba(79, 70, 229, 0.08) 0%, transparent 40%)' }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 7, md: 9 } }}>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: '14px !important', color: '#4f46e5 !important' }} />}
            label="Engineering Vision"
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
            About <span className="gradient-text-primary">ParkMitra</span>
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 680, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.65 }}>
            A comprehensive, high-throughput smart parking platform engineered to resolve dense urban transit congestion through automated slot allocation, relational persistence, and stateless security.
          </Typography>
        </Box>

        {/* Problem Statement & Solution */}
        <Grid container spacing={4} sx={{ mb: 10 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(225, 29, 72, 0.1)', color: 'error.main', display: 'flex' }}>
                    <InfoOutlinedIcon />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'error.main' }}>
                    The Challenge
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.925rem' }}>
                  Modern urban environments and commercial hubs face acute congestion due to inefficient manual parking systems. Drivers spend up to 20 minutes circling for vacant spots, burning excess fuel, causing localized bottleneck delays, and creating revenue leakage for operators lacking real-time occupancy telemetry.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(5, 150, 105, 0.1)', color: 'success.main', display: 'flex' }}>
                    <CheckCircleIcon />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.main' }}>
                    The ParkMitra Solution
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.925rem' }}>
                  ParkMitra introduces an automated Single Page Application paired directly with a microservice REST endpoint. It automatically schedules vehicle entry times and auto-assigns open parking bays matching vehicle categories, eliminating human error while providing real-time logging, instant PDF billing, and transactional exports.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pillars Section */}
        <Box sx={{ mb: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1 }}>
              Core Architecture
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900 }}>
              Pillars of the ParkMitra Platform
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                title: 'Relational Isolation & JPA',
                desc: 'Utilizes a relational MySQL schema managed by Hibernate JPA to map parking logs, vehicle records, and accounts independently, avoiding overlapping states or dirty read anomalies.',
                icon: <CloudQueueIcon />,
                color: '#4f46e5',
              },
              {
                title: 'Stateless JWT & BCrypt',
                desc: 'Defends sensitive API endpoints using Spring Security and stateless JSON Web Tokens. All user passwords are encrypted using one-way BCrypt hashing algorithms upon registration.',
                icon: <SecurityIcon />,
                color: '#0d9488',
              },
              {
                title: 'High-Concurrency Scaling',
                desc: 'The Spring Boot controller architecture handles simultaneous check-in spikes seamlessly. Low latency DB lookups are achieved via indexed slot numbers and fast foreign-key associations.',
                icon: <SpeedIcon />,
                color: '#f59e0b',
              },
            ].map((pillar, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card sx={{ height: '100%', borderRadius: 3.5, border: '1px solid #e2e8f0', p: 1 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: 2.5, bgcolor: `${pillar.color}12`, color: pillar.color, width: 'fit-content' }}>
                        {pillar.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {pillar.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                        {pillar.desc}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ mb: 9 }} />

        {/* Capstone Card */}
        <Card sx={{ background: 'linear-gradient(135deg, #0a0f1d 0%, #1e1b4b 60%, #042f2e 100%)', color: '#ffffff', borderRadius: 4.5, border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent sx={{ p: { xs: 4, sm: 6 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 2 }}>
                  <ParkMitraLogo variant="light" size="small" />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5, color: '#ffffff' }}>
                  Engineering Capstone Focus & Quality
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7, maxWidth: 680, fontSize: '0.925rem' }}>
                  ParkMitra was developed to represent the apex of full-stack engineering capstone implementations. The complete separation of the React client side and Spring Boot REST side guarantees decoupling, maintainability, and enterprise readability. Production concepts including JWT verification interceptors, database seed scripts, and automated PDF receipt streams demonstrate production readiness.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#2dd4bf' }}>100%</Typography>
                    <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>Open Source Stack</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default About;
