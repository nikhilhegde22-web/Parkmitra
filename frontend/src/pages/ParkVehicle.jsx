import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import parkingService from '../services/parkingService';
import slotService from '../services/slotService';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Stack,
  Alert,
  Chip,
  Skeleton,
  LinearProgress,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddIcon from '@mui/icons-material/Add';
import { PageContainer, PageHeader, GRID_SPACING } from '../components/layout';

const getVehicleTypeIcon = (type) => {
  switch (type) {
    case 'MOTORCYCLE':
      return <TwoWheelerIcon sx={{ fontSize: 20 }} />;
    case 'SUV':
      return <AirportShuttleIcon sx={{ fontSize: 20 }} />;
    case 'TRUCK':
    case 'BUS':
      return <LocalShippingIcon sx={{ fontSize: 20 }} />;
    default:
      return <DirectionsCarIcon sx={{ fontSize: 20 }} />;
  }
};

const ParkVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [totalSlots, setTotalSlots] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allVehicles, allRecords, availSlotsData] = await Promise.all([
        vehicleService.getAllVehicles(),
        parkingService.getAllRecords().catch(() => []),
        slotService.getAvailableSlots().catch(() => []),
      ]);

      const activeParkedVehicleIds = new Set(
        allRecords.filter((r) => r.exitTime === null).map((r) => r.vehicle?.id)
      );

      const unparkedVehicles = allVehicles.filter((v) => !activeParkedVehicleIds.has(v.id));
      setVehicles(unparkedVehicles);
      setAvailableSlots(availSlotsData);

      const allSlots = await slotService.getAllSlots().catch(() => []);
      setTotalSlots(allSlots.length);
    } catch (error) {
      console.error('Error loading park vehicle data:', error);
      toast.error('Failed to retrieve vehicle or slot configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleParkSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicleId) {
      toast.warning('Please select a vehicle to park.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await parkingService.parkVehicle(selectedVehicleId);
      toast.success(
        `Vehicle parked successfully in Bay ${response.parkingSlot?.slotNumber || 'allocated'}!`
      );
      setSelectedVehicleId('');
      loadData();
    } catch (error) {
      console.error('Error parking vehicle:', error);
      toast.error(error.response?.data?.message || 'Parking slot allocation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const availableSlotsCount = availableSlots.length;
  const occupiedCount = totalSlots - availableSlotsCount;
  const capacityPercent = totalSlots > 0 ? Math.round((occupiedCount / totalSlots) * 100) : 0;

  return (
    <PageContainer>
      <PageHeader
        title="Check-In Vehicle"
        subtitle="Intelligent auto-allocation pairs incoming vehicle to matching open parking bay"
        actions={
          <Button
            component={Link}
            to="/vehicles"
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ px: 2, py: 0.85, fontWeight: 600 }}
          >
            Register New Vehicle
          </Button>
        }
      />

      <Grid container spacing={GRID_SPACING}>
        {/* Left Column: Park Form & Vehicle Preview */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3.5, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #4f46e5 0%, #0d9488 100%)',
                    color: '#ffffff',
                    display: 'flex',
                  }}
                >
                  <PlayForWorkIcon sx={{ transform: 'rotate(90deg)', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    Select Vehicle for Bay Allocation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose from enrolled unparked fleet
                  </Typography>
                </Box>
              </Box>

              {loading ? (
                <Stack spacing={2}>
                  <Skeleton variant="rounded" height={54} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="rounded" height={48} sx={{ borderRadius: 2 }} />
                </Stack>
              ) : vehicles.length === 0 ? (
                <Alert
                  severity="info"
                  sx={{ borderRadius: 2.5 }}
                  action={
                    <Button color="inherit" size="small" component={Link} to="/vehicles" sx={{ fontWeight: 700 }}>
                      Add Vehicle
                    </Button>
                  }
                >
                  All enrolled vehicles are currently parked or no vehicles registered yet.
                </Alert>
              ) : (
                <form onSubmit={handleParkSubmit} id="park-vehicle-form">
                  <Stack spacing={3}>
                    <FormControl fullWidth>
                      <InputLabel id="select-vehicle-label">Select Unparked Vehicle</InputLabel>
                      <Select
                        labelId="select-vehicle-label"
                        id="select-vehicle"
                        value={selectedVehicleId}
                        label="Select Unparked Vehicle"
                        onChange={(e) => setSelectedVehicleId(e.target.value)}
                      >
                        {vehicles.map((v) => (
                          <MenuItem key={v.id} value={v.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                              <span className="license-plate">{v.vehicleNumber}</span>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {v.ownerName}
                              </Typography>
                              <Chip
                                label={v.vehicleType}
                                size="small"
                                sx={{ ml: 'auto', height: 20, fontSize: '0.65rem', fontWeight: 800 }}
                              />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Selected Vehicle Preview Card */}
                    {selectedVehicle && (
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          bgcolor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          animation: 'fadeSlideUp 0.2s ease',
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1.5 }}>
                          Vehicle Ready for Check-In
                        </Typography>

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Stack spacing={1}>
                              <Typography variant="caption" color="text.secondary">Plate Number</Typography>
                              <Box>
                                <span className="license-plate">{selectedVehicle.vehicleNumber}</span>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Stack spacing={1}>
                              <Typography variant="caption" color="text.secondary">Classification</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getVehicleTypeIcon(selectedVehicle.vehicleType)}
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{selectedVehicle.vehicleType}</Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Stack spacing={0.5}>
                              <Typography variant="caption" color="text.secondary">Owner Name</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedVehicle.ownerName}</Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Stack spacing={0.5}>
                              <Typography variant="caption" color="text.secondary">Contact Phone</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedVehicle.ownerContact || 'N/A'}</Typography>
                              </Box>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    <Button
                      id="submit-park-btn"
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      disabled={submitting || !selectedVehicleId || availableSlotsCount === 0}
                      startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <PlayForWorkIcon sx={{ transform: 'rotate(90deg)' }} />}
                      sx={{
                        py: 1.6,
                        fontWeight: 800,
                        fontSize: '1rem',
                        boxShadow: '0 6px 18px rgba(79, 70, 229, 0.25)',
                      }}
                    >
                      {submitting
                        ? 'Allocating Bay...'
                        : availableSlotsCount === 0
                        ? 'No Bays Available'
                        : 'Allocate Bay & Check In'}
                    </Button>
                  </Stack>
                </form>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Live Lot Status & Smart Allocation Guide */}
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            {/* Live Lot Capacity Card */}
            <Card sx={{ borderRadius: 3.5, border: '1px solid #e2e8f0', p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Live Bay Availability
                </Typography>
                <Chip
                  icon={<span className="live-pulse" style={{ marginRight: 6 }} />}
                  label="Live"
                  size="small"
                  sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontWeight: 800, fontSize: '0.675rem' }}
                />
              </Box>

              <Box sx={{ my: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Capacity Utilized</Typography>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800 }}>{capacityPercent}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={capacityPercent}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(16, 185, 129, 0.15)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #10b981, #4f46e5)',
                    },
                  }}
                />
              </Box>

              <Grid container spacing={1.5} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>Open Bays</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#10b981' }}>{availableSlotsCount}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: '#fff1f2', border: '1px solid #fecdd3', textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#e11d48', fontWeight: 700 }}>Occupied</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#f43f5e' }}>{occupiedCount}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>

            {/* Smart Allocation Algorithm Card */}
            <Card sx={{ borderRadius: 3.5, border: '1px solid #e2e8f0', p: 3, bgcolor: '#faf5ff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <CheckCircleIcon sx={{ color: '#7c3aed', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#581c87' }}>
                  ParkMitra Allocation Engine
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#6b21a8', lineHeight: 1.6, fontSize: '0.85rem' }}>
                When you click Check-In, ParkMitra automatically queries available database slots that match the vehicle type (CAR, SUV, MOTORCYCLE) and locks the earliest open bay with atomic safety.
              </Typography>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ParkVehicle;
