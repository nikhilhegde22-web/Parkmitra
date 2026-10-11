import React, { useState, useEffect } from 'react';
import parkingService from '../services/parkingService';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Stack,
  Divider,
  Chip,
  CircularProgress,
  Skeleton,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EmptyState from '../components/EmptyState';
import { PageContainer, PageHeader } from '../components/layout';

const ExitVehicle = () => {
  const [activeRecords, setActiveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [exitSummary, setExitSummary] = useState(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const loadActiveRecords = async () => {
    setLoading(true);
    try {
      const allRecords = await parkingService.getAllRecords();
      const active = allRecords.filter((r) => r.exitTime === null);
      setActiveRecords(active);
    } catch (error) {
      console.error('Error fetching parking records:', error);
      toast.error('Failed to load active parking records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveRecords();
  }, []);

  const handleExitVehicle = async (vehicleId) => {
    setProcessingId(vehicleId);
    try {
      const response = await parkingService.exitVehicle(vehicleId);
      toast.success('Vehicle exited successfully!');
      setExitSummary(response);
      setSummaryOpen(true);
      loadActiveRecords();
    } catch (error) {
      console.error('Error exiting vehicle:', error);
      toast.error(error.response?.data?.message || 'Error occurred during exit processing');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDownloadReceipt = async (recordId) => {
    setDownloadingReceipt(true);
    try {
      const blob = await parkingService.downloadReceipt(recordId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ParkMitra_Receipt_${recordId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt PDF');
    } finally {
      setDownloadingReceipt(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (entryTime) => {
    if (!entryTime) return '';
    const diffMs = new Date() - new Date(entryTime);
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hours === 0) return `${mins}m elapsed`;
    return `${hours}h ${mins}m elapsed`;
  };

  const filteredRecords = activeRecords.filter((record) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      record.vehicle?.vehicleNumber?.toLowerCase().includes(q) ||
      record.vehicle?.ownerName?.toLowerCase().includes(q) ||
      record.parkingSlot?.slotNumber?.toLowerCase().includes(q)
    );
  });

  return (
    <PageContainer>
      <PageHeader
        title="Check-Out & Billing"
        subtitle="Process vehicle departure, calculate tariffs, and issue instant verified receipts"
        badge={
          <Chip
            icon={<span className="live-pulse" style={{ marginRight: 6 }} />}
            label={`${activeRecords.length} Active Sessions`}
            size="small"
            sx={{
              bgcolor: 'rgba(245, 158, 11, 0.1)',
              color: '#d97706',
              fontWeight: 800,
              fontSize: '0.72rem',
              border: '1px solid rgba(245, 158, 11, 0.25)',
            }}
          />
        }
      />

      {/* Search Toolbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search by license plate, owner, or bay..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          sx={{ width: { xs: '100%', sm: 320 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Showing {filteredRecords.length} of {activeRecords.length} parked vehicles
        </Typography>
      </Box>

      {/* Active Records Grid */}
      {loading ? (
        <Grid container spacing={2.5}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3.5 }} />
            </Grid>
          ))}
        </Grid>
      ) : filteredRecords.length === 0 ? (
        <EmptyState
          title="No Active Parking Sessions Found"
          description={
            searchFilter
              ? 'No currently parked vehicles match your search filter.'
              : 'All vehicles have checked out. Use Check-In to park an incoming vehicle.'
          }
        />
      ) : (
        <Grid container spacing={2.5}>
          {filteredRecords.map((record) => (
            <Grid item xs={12} sm={6} md={4} key={record.id}>
              <Card
                sx={{
                  borderRadius: 3.5,
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 24px -4px rgba(15, 23, 42, 0.08)',
                    borderColor: '#cbd5e1',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Card Header: Plate & Bay Badge */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <span className="license-plate">{record.vehicle?.vehicleNumber}</span>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 1.5,
                        bgcolor: 'rgba(79, 70, 229, 0.08)',
                        color: 'primary.main',
                        border: '1px solid rgba(79, 70, 229, 0.15)',
                      }}
                    >
                      <LocalParkingIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>
                        Bay {record.parkingSlot?.slotNumber}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Vehicle Details */}
                  <Stack spacing={1.25} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DirectionsCarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Classification:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', ml: 'auto' }}>
                        {record.vehicle?.vehicleType}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Owner:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', ml: 'auto' }}>
                        {record.vehicle?.ownerName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Entry Time:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', ml: 'auto' }}>
                        {formatDate(record.entryTime)}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Duration Badge */}
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      bgcolor: '#fffbeb',
                      border: '1px solid #fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2.5,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 700 }}>
                      Current Stay:
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#d97706', fontWeight: 900 }}>
                      {calculateDuration(record.entryTime)}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Exit Process Button */}
                  <Button
                    id={`exit-btn-${record.vehicle?.id}`}
                    fullWidth
                    variant="contained"
                    color="secondary"
                    disabled={processingId === record.vehicle?.id}
                    onClick={() => handleExitVehicle(record.vehicle?.id)}
                    startIcon={processingId === record.vehicle?.id ? <CircularProgress size={18} color="inherit" /> : <ExitToAppIcon />}
                    sx={{
                      py: 1.2,
                      fontWeight: 800,
                      borderRadius: 2.5,
                    }}
                  >
                    {processingId === record.vehicle?.id ? 'Processing Bill...' : 'Process Exit & Generate Bill'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Exit Billing Summary Dialog */}
      <Dialog open={summaryOpen} onClose={() => setSummaryOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>ParkMitra Invoice</Typography>
          </Box>
          <IconButton size="small" onClick={() => setSummaryOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '10px !important' }}>
          {exitSummary && (
            <Stack spacing={2.5}>
              <Box sx={{ textAlign: 'center', py: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Total Parking Fee
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: 'success.main', my: 0.5 }}>
                  ₹{exitSummary.parkingFee}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Calculated automatically based on elapsed duration
                </Typography>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0' }}>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Vehicle Plate</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{exitSummary.vehicle?.vehicleNumber}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Bay Number</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Bay {exitSummary.parkingSlot?.slotNumber}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 0.5 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Check-In</Typography>
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>{formatDate(exitSummary.entryTime)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Check-Out</Typography>
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>{formatDate(exitSummary.exitTime)}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1, gap: 1 }}>
          <Button onClick={() => setSummaryOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>
            Close
          </Button>
          <Button
            id="download-receipt-btn"
            variant="contained"
            color="primary"
            disabled={downloadingReceipt}
            onClick={() => handleDownloadReceipt(exitSummary?.id)}
            startIcon={downloadingReceipt ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
            sx={{ fontWeight: 800, px: 2.5 }}
          >
            {downloadingReceipt ? 'Downloading...' : 'Download PDF Receipt'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ExitVehicle;
