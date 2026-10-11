import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import { toast } from 'react-toastify';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Skeleton,
  Chip,
  Button,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HistoryIcon from '@mui/icons-material/History';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import { PageContainer, PageHeader, KpiCard, GRID_SPACING } from '../components/layout';

const POLLING_INTERVAL = 15000;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const fetchDashboardData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);

    try {
      const [statsData, analyticsData] = await Promise.all([
        dashboardService.getDashboard(),
        dashboardService.getAnalytics(),
      ]);
      setStats(statsData);
      setAnalytics(analyticsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard info:', error);
      if (!isSilent) toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    intervalRef.current = setInterval(() => {
      fetchDashboardData(true);
    }, POLLING_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (loading && !stats) {
    return (
      <PageContainer>
        <Box>
          <Skeleton variant="text" width={260} height={36} />
          <Skeleton variant="text" width={320} height={20} sx={{ mt: 0.5 }} />
        </Box>
        <Grid container spacing={GRID_SPACING}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rounded" height={110} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={GRID_SPACING}>
          {[1, 2].map((i) => (
            <Grid item xs={12} lg={6} key={i}>
              <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </PageContainer>
    );
  }

  const pieData = stats && stats.totalSlots > 0
    ? [
        { name: 'Available', value: Number(stats.availableSlots) },
        { name: 'Occupied', value: Number(stats.occupiedSlots) },
      ]
    : [];

  const PIE_COLORS = ['#10b981', '#f43f5e'];

  const barData = analytics
    ? [
        { name: 'Today', Revenue: analytics.todayRevenue || 0 },
        { name: 'This Month', Revenue: analytics.monthlyRevenue || 0 },
      ]
    : [];

  const statCards = stats
    ? [
        {
          title: 'Total Spaces',
          value: stats.totalSlots,
          icon: <LocalParkingIcon />,
          color: '#4f46e5',
          subtitle: 'Configured parking bays',
        },
        {
          title: 'Available Slots',
          value: stats.availableSlots,
          icon: <CheckCircleIcon />,
          color: '#10b981',
          subtitle: 'Ready for allocation',
        },
        {
          title: 'Occupied Bays',
          value: stats.occupiedSlots,
          icon: <DirectionsCarIcon />,
          color: '#f43f5e',
          subtitle: 'Currently parked',
        },
        {
          title: 'Enrolled Fleet',
          value: stats.totalVehicles,
          icon: <DirectionsCarIcon />,
          color: '#0284c7',
          subtitle: 'Registered vehicles',
        },
        {
          title: 'Active Sessions',
          value: stats.activeParking,
          icon: <SpeedIcon />,
          color: '#f59e0b',
          subtitle: 'Vehicles on premises',
        },
        {
          title: 'Total Revenue',
          value: `₹${Number(stats.totalRevenue || 0).toLocaleString('en-IN')}`,
          icon: <MonetizationOnIcon />,
          color: '#8b5cf6',
          subtitle: 'Cumulative earnings',
        },
      ]
    : [];

  return (
    <PageContainer>
      <PageHeader
        title="ParkMitra Operations Command"
        subtitle="Real-time automated lot tracking, space analytics & revenue streams"
        badge={
          lastUpdated && (
            <Chip
              icon={<FiberManualRecordIcon sx={{ fontSize: '10px !important', color: '#10b981 !important' }} />}
              label={`Telemetry Sync: ${lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.72rem', height: 24, borderColor: '#e2e8f0', bgcolor: '#ffffff', fontWeight: 600 }}
            />
          )
        }
      />

      {/* Quick Action Navigation Bar */}
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: '#ffffff',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mr: 1, fontSize: '0.85rem' }}>
            Quick Actions:
          </Typography>
          <Button
            size="small"
            variant="contained"
            startIcon={<PlayForWorkIcon sx={{ transform: 'rotate(90deg)' }} />}
            onClick={() => navigate('/park')}
            sx={{ px: 2, py: 0.75, fontWeight: 700 }}
          >
            Park Vehicle
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ExitToAppIcon />}
            onClick={() => navigate('/exit')}
            sx={{ px: 2, py: 0.75, fontWeight: 600 }}
          >
            Process Exit
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<LocalParkingIcon />}
            onClick={() => navigate('/slots')}
            sx={{ px: 2, py: 0.75, fontWeight: 600 }}
          >
            Parking Bays
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/history')}
            sx={{ px: 2, py: 0.75, fontWeight: 600, display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Audit History
          </Button>
        </Stack>

        <Chip
          icon={<SecurityIcon sx={{ fontSize: '14px !important', color: '#4f46e5 !important' }} />}
          label="JWT Protected Session"
          size="small"
          sx={{ bgcolor: 'rgba(79, 70, 229, 0.08)', color: '#4f46e5', fontWeight: 700, fontSize: '0.72rem' }}
        />
      </Box>

      {/* Primary KPI Grid */}
      <Grid container spacing={GRID_SPACING}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={idx}>
            <KpiCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Analytics Highlights */}
      {analytics && (
        <Grid container spacing={GRID_SPACING}>
          <Grid item xs={12} sm={6}>
            <KpiCard
              title="Most Popular Bay"
              value={analytics.mostUsedSlot || 'N/A'}
              icon={<TrendingUpIcon />}
              color="#4f46e5"
              subtitle={
                analytics.mostUsedCount > 0
                  ? `${analytics.mostUsedCount} total sessions logged`
                  : 'No usage recorded yet'
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <KpiCard
              title="Lot Utilization Rate"
              value={`${analytics.occupancyPercentage?.toFixed(1) || '0.0'}%`}
              icon={<LocalParkingIcon />}
              color="#0d9488"
              subtitle="Active bays vs. total registered bays"
            />
          </Grid>
        </Grid>
      )}

      {/* Visual Charts */}
      <Grid container spacing={GRID_SPACING}>
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%', borderRadius: 3.5 }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem' }}>
                    Slot Distribution
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Real-time available vs. occupied parking spaces
                  </Typography>
                </Box>
                <Chip
                  label="Live"
                  size="small"
                  sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontWeight: 800, fontSize: '0.675rem', height: 20 }}
                />
              </Box>

              <Box sx={{ width: '100%', height: 300, mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stats && stats.totalSlots > 0 ? (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={72}
                        outerRadius={108}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip formatter={(value) => [`${value} Slots`]} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <LocalParkingIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      No slots registered yet
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Card sx={{ height: '100%', borderRadius: 3.5 }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem' }}>
                    Revenue Stream
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Automated fee collection (Today vs. Current Month in INR ₹)
                  </Typography>
                </Box>
                <Chip
                  label="INR (₹)"
                  size="small"
                  sx={{ bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', fontWeight: 800, fontSize: '0.675rem', height: 20 }}
                />
              </Box>

              <Box sx={{ width: '100%', height: 300, mt: 1 }}>
                <ResponsiveContainer>
                  <BarChart data={barData} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="parkmitraRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#0d9488" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 13, fontWeight: 700 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12, fontWeight: 600 }} tickFormatter={(v) => `₹${v}`} />
                    <ChartTooltip
                      formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Collected Revenue']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="Revenue" fill="url(#parkmitraRevGrad)" radius={[10, 10, 0, 0]} maxBarSize={90} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Dashboard;
