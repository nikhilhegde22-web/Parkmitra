import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import slotService from '../services/slotService';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  CircularProgress,
  Skeleton,
  Stack,
  LinearProgress,
  Tabs,
  Tab,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SearchIcon from '@mui/icons-material/Search';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { PageContainer, PageHeader } from '../components/layout';

const SlotTypes = ['CAR', 'MOTORCYCLE', 'SUV', 'TRUCK', 'BUS', 'OTHER'];

const getVehicleTypeIcon = (type) => {
  switch (type) {
    case 'MOTORCYCLE':
      return <TwoWheelerIcon sx={{ fontSize: 18 }} />;
    case 'SUV':
      return <AirportShuttleIcon sx={{ fontSize: 18 }} />;
    case 'TRUCK':
    case 'BUS':
      return <LocalShippingIcon sx={{ fontSize: 18 }} />;
    default:
      return <DirectionsCarIcon sx={{ fontSize: 18 }} />;
  }
};

const Slots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'AVAILABLE', 'OCCUPIED'
  const [searchFilter, setSearchFilter] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const loadSlots = async () => {
    setLoading(true);
    try {
      const data = await slotService.getAllSlots();
      const sorted = data.sort((a, b) => {
        const valA = a.slotNumber || '';
        const valB = b.slotNumber || '';
        return valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
      });
      setSlots(sorted);
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to load parking slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleOpenAdd = () => {
    reset();
    setEditMode(false);
    setDialogOpen(true);
  };

  const handleOpenEdit = (slot) => {
    reset();
    setEditMode(true);
    setCurrentId(slot.id);
    setValue('slotNumber', slot.slotNumber);
    setValue('slotType', slot.slotType);
    setValue('occupied', slot.occupied);
    setDialogOpen(true);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editMode) {
        await slotService.updateSlot(currentId, data);
        toast.success('Parking slot updated successfully!');
      } else {
        await slotService.addSlot(data);
        toast.success('Parking slot added successfully!');
      }
      setDialogOpen(false);
      reset();
      loadSlots();
    } catch (error) {
      console.error('Error saving slot:', error);
      toast.error(error.response?.data?.message || 'Error saving parking slot');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await slotService.deleteSlot(deleteId);
      toast.success('Parking slot deleted successfully!');
      setDeleteOpen(false);
      loadSlots();
    } catch (error) {
      console.error('Error deleting slot:', error);
      toast.error('Failed to delete parking slot');
    }
  };

  const totalSlotsCount = slots.length;
  const availableSlotsCount = slots.filter((s) => !s.occupied).length;
  const occupiedSlotsCount = totalSlotsCount - availableSlotsCount;
  const occupancyPercentage = totalSlotsCount > 0 ? Math.round((occupiedSlotsCount / totalSlotsCount) * 100) : 0;

  // Filtered Slots
  const filteredSlots = slots.filter((slot) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'AVAILABLE' && !slot.occupied) ||
      (statusFilter === 'OCCUPIED' && slot.occupied);

    const matchesSearch =
      !searchFilter.trim() ||
      slot.slotNumber?.toLowerCase().includes(searchFilter.trim().toLowerCase()) ||
      slot.slotType?.toLowerCase().includes(searchFilter.trim().toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Parking Bays & Slot Matrix"
        subtitle="Live bay telemetry, availability allocation, and slot classification"
        actions={
          <Button
            id="add-slot-btn"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{ px: 2.5, py: 1, fontWeight: 700 }}
          >
            Add New Bay
          </Button>
        }
      />

      {/* Capacity & Statistics Banner */}
      <Card sx={{ p: 3, borderRadius: 3.5, border: '1px solid #e2e8f0' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Overall Bay Capacity
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                {availableSlotsCount}{' '}
                <Typography component="span" variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  of {totalSlotsCount} Bays Open
                </Typography>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={occupancyPercentage}
                  sx={{
                    flexGrow: 1,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(16, 185, 129, 0.15)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #10b981, #f59e0b, #f43f5e)',
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', minWidth: 35 }}>
                  {occupancyPercentage}%
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Total Bays</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mt: 0.25 }}>{totalSlotsCount}</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>Available</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', mt: 0.25 }}>{availableSlotsCount}</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.2)', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#e11d48', fontWeight: 700 }}>Occupied</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#f43f5e', mt: 0.25 }}>{occupiedSlotsCount}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>

      {/* Filter and Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Tabs
          value={statusFilter}
          onChange={(_, val) => setStatusFilter(val)}
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              py: 0.75,
              px: 2,
              fontWeight: 700,
              fontSize: '0.85rem',
              borderRadius: 2,
            },
          }}
        >
          <Tab value="ALL" label={`All Bays (${totalSlotsCount})`} />
          <Tab value="AVAILABLE" label={`Available (${availableSlotsCount})`} />
          <Tab value="OCCUPIED" label={`Occupied (${occupiedSlotsCount})`} />
        </Tabs>

        <TextField
          size="small"
          placeholder="Search by bay number or type..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          sx={{ width: { xs: '100%', sm: 260 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Loading Skeleton */}
      {loading ? (
        <Grid container spacing={2.5}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rounded" height={150} sx={{ borderRadius: 3.5 }} />
            </Grid>
          ))}
        </Grid>
      ) : filteredSlots.length === 0 ? (
        <EmptyState
          title="No Parking Bays Match Criteria"
          description="Adjust your search or status filter, or click 'Add New Bay' to create a parking slot."
        />
      ) : (
        /* Visual Parking Bay Grid */
        <Grid container spacing={2.5}>
          {filteredSlots.map((slot) => {
            const isOccupied = slot.occupied;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={slot.id}>
                <Card
                  sx={{
                    borderRadius: 3.5,
                    border: isOccupied ? '1.5px solid #fecdd3' : '1.5px solid #a7f3d0',
                    backgroundColor: isOccupied ? '#fff1f2' : '#f0fdf4',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: isOccupied
                        ? '0 10px 20px -3px rgba(244, 63, 94, 0.15)'
                        : '0 10px 20px -3px rgba(16, 185, 129, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    {/* Bay Top Row */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Box
                          sx={{
                            p: 0.85,
                            borderRadius: 2,
                            bgcolor: isOccupied ? '#ffe4e6' : '#dcfce7',
                            color: isOccupied ? '#e11d48' : '#059669',
                            display: 'flex',
                          }}
                        >
                          <LocalParkingIcon sx={{ fontSize: 20 }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                          {slot.slotNumber}
                        </Typography>
                      </Box>

                      <Chip
                        icon={isOccupied ? <CancelIcon sx={{ fontSize: '14px !important' }} /> : <CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                        label={isOccupied ? 'Occupied' : 'Open'}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          height: 24,
                          bgcolor: isOccupied ? '#f43f5e' : '#10b981',
                          color: '#ffffff',
                          '& .MuiChip-icon': { color: '#ffffff' },
                        }}
                      />
                    </Box>

                    {/* Vehicle Type Indicator */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5, bgcolor: 'rgba(255,255,255,0.7)', p: 1, borderRadius: 2, border: '1px solid rgba(0,0,0,0.04)' }}>
                      <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                        {getVehicleTypeIcon(slot.slotType)}
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        Type:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', ml: 'auto' }}>
                        {slot.slotType}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 1.5, borderColor: isOccupied ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)' }} />

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.675rem', fontWeight: 600 }}>
                        ID #{slot.id}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          id={`edit-slot-${slot.slotNumber}`}
                          size="small"
                          onClick={() => handleOpenEdit(slot)}
                          sx={{
                            bgcolor: '#ffffff',
                            color: 'primary.main',
                            border: '1px solid #e2e8f0',
                            '&:hover': { bgcolor: 'rgba(99,102,241,0.08)' },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          id={`delete-slot-${slot.slotNumber}`}
                          size="small"
                          onClick={() => handleOpenDelete(slot.id)}
                          disabled={isOccupied}
                          title={isOccupied ? 'Cannot delete an occupied bay' : 'Delete bay'}
                          sx={{
                            bgcolor: '#ffffff',
                            color: 'error.main',
                            border: '1px solid #e2e8f0',
                            '&:hover': { bgcolor: 'rgba(244,63,94,0.08)' },
                            '&.Mui-disabled': { opacity: 0.35 },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)} noValidate id="slot-form">
          <DialogTitle sx={{ fontWeight: 800, pb: 1, fontSize: '1.25rem' }}>
            {editMode ? 'Edit Parking Bay' : 'Create New Parking Bay'}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '10px !important' }}>
            <TextField
              id="form-slot-number"
              fullWidth
              label="Bay Number / Identifier"
              placeholder="e.g. A-101"
              disabled={editMode}
              error={!!errors.slotNumber}
              helperText={errors.slotNumber?.message}
              {...register('slotNumber', { required: 'Slot number is required' })}
            />
            <TextField
              id="form-slot-type"
              fullWidth
              select
              label="Assigned Vehicle Category"
              defaultValue="CAR"
              error={!!errors.slotType}
              helperText={errors.slotType?.message}
              {...register('slotType', { required: 'Slot type is required' })}
            >
              {SlotTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getVehicleTypeIcon(type)}
                    <span>{type}</span>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="form-slot-occupied"
              fullWidth
              select
              label="Initial Status"
              defaultValue="false"
              error={!!errors.occupied}
              helperText={errors.occupied?.message}
              {...register('occupied', {
                required: 'Status is required',
                setValueAs: (v) => v === 'true' || v === true,
              })}
            >
              <MenuItem value="false">Available (Open)</MenuItem>
              <MenuItem value="true">Occupied</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1 }}>
            <Button onClick={() => setDialogOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              id="save-slot-btn"
              type="submit"
              variant="contained"
              disabled={saving}
              sx={{ fontWeight: 700, px: 3 }}
            >
              {saving ? <CircularProgress size={20} color="inherit" /> : editMode ? 'Save Changes' : 'Create Bay'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Parking Bay"
        message="Are you sure you want to delete this parking bay? This action cannot be reversed."
        confirmText="Delete Bay"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </PageContainer>
  );
};

export default Slots;
