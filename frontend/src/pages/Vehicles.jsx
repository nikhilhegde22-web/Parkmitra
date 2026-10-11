import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import vehicleService from '../services/vehicleService';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { PageContainer, PageHeader, SearchToolbar, DataTable } from '../components/layout';

const VehicleTypes = ['CAR', 'MOTORCYCLE', 'SUV', 'TRUCK', 'BUS', 'OTHER'];

const getVehicleTypeIcon = (type) => {
  switch (type) {
    case 'MOTORCYCLE':
      return <TwoWheelerIcon sx={{ fontSize: 16 }} />;
    case 'SUV':
      return <AirportShuttleIcon sx={{ fontSize: 16 }} />;
    case 'TRUCK':
    case 'BUS':
      return <LocalShippingIcon sx={{ fontSize: 16 }} />;
    default:
      return <DirectionsCarIcon sx={{ fontSize: 16 }} />;
  }
};

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadVehicles();
      return;
    }
    setLoading(true);
    try {
      const data = await vehicleService.searchVehicle(searchQuery.trim());
      if (data) {
        setVehicles([data]);
      } else {
        setVehicles([]);
        toast.info('No vehicle found matching this number');
      }
    } catch (error) {
      console.error('Error searching vehicle:', error);
      setVehicles([]);
      toast.error('Vehicle number not found');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadVehicles();
  };

  const handleOpenAdd = () => {
    reset();
    setEditMode(false);
    setDialogOpen(true);
  };

  const handleOpenEdit = (row) => {
    reset();
    setEditMode(true);
    setCurrentId(row.id);
    setValue('vehicleNumber', row.vehicleNumber);
    setValue('vehicleType', row.vehicleType);
    setValue('ownerName', row.ownerName);
    setValue('ownerMobile', row.ownerMobile);
    setDialogOpen(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editMode) {
        await vehicleService.updateVehicle(currentId, data);
        toast.success('Vehicle updated successfully!');
      } else {
        await vehicleService.saveVehicle(data);
        toast.success('Vehicle registered successfully!');
      }
      setDialogOpen(false);
      loadVehicles();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error(error.response?.data?.message || 'Error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteOpen(false);
    setLoading(true);
    try {
      await vehicleService.deleteVehicle(deleteId);
      toast.success('Vehicle deleted successfully!');
      loadVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error(error.response?.data?.message || 'Failed to delete vehicle');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, sortable: true },
    {
      field: 'vehicleNumber',
      headerName: 'License Plate',
      flex: 1.2,
      minWidth: 170,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <span className="license-plate">{params.value}</span>
        </Box>
      ),
    },
    {
      field: 'vehicleType',
      headerName: 'Category',
      flex: 0.9,
      minWidth: 140,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip
            icon={getVehicleTypeIcon(params.value)}
            label={params.value}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.72rem',
              height: 24,
              bgcolor: '#f1f5f9',
              color: '#334155',
            }}
          />
        </Box>
      ),
    },
    { field: 'ownerName', headerName: 'Owner Name', flex: 1.2, minWidth: 160 },
    { field: 'ownerMobile', headerName: 'Contact Number', flex: 1, minWidth: 140 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, height: '100%', alignItems: 'center' }}>
          <IconButton
            id={`edit-vehicle-${params.row.id}`}
            size="small"
            color="primary"
            onClick={() => handleOpenEdit(params.row)}
            sx={{ border: '1px solid #e2e8f0', borderRadius: 1.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            id={`delete-vehicle-${params.row.id}`}
            size="small"
            color="error"
            onClick={() => handleOpenDelete(params.row.id)}
            sx={{ border: '1px solid #e2e8f0', borderRadius: 1.5 }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Vehicle Registry"
        subtitle="Enrolled fleet database, license verification, and owner profiles"
        actions={
          <Button
            id="add-vehicle-btn"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{ px: 2.5, py: 1, fontWeight: 700 }}
          >
            Register Vehicle
          </Button>
        }
      />

      <SearchToolbar>
        <TextField
          id="search-vehicle-input"
          size="small"
          placeholder="Search by license plate (e.g. MH12AB1234)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ flex: 1, minWidth: { xs: '100%', sm: 300 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button id="search-vehicle-btn" variant="contained" color="secondary" onClick={handleSearch} sx={{ px: 3, fontWeight: 700 }}>
          Search
        </Button>
      </SearchToolbar>

      <DataTable sx={{ minHeight: 420 }}>
        {loading && vehicles.length === 0 ? (
          <LoadingSpinner message="Fetching vehicles..." />
        ) : (
          <DataGrid
            id="vehicles-datagrid"
            rows={vehicles}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20, 50]}
            disableRowSelectionOnClick
            autoHeight
            rowHeight={56}
            columnHeaderHeight={50}
            sx={{
              border: 'none',
              width: '100%',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 800,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#475569',
              },
              '& .MuiDataGrid-row:nth-of-type(even)': {
                backgroundColor: '#f8fafc',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'rgba(79, 70, 229, 0.04)',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f1f5f9',
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid #e2e8f0',
              },
            }}
          />
        )}
      </DataTable>

      {/* Add / Edit Vehicle Modal */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)} noValidate id="vehicle-form">
          <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem' }}>
            {editMode ? 'Edit Vehicle Profile' : 'Enroll New Vehicle'}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '10px !important' }}>
            <TextField
              id="form-vehicle-number"
              fullWidth
              label="License Plate Number"
              placeholder="e.g. MH12AB1234 or DL01XY9999"
              error={!!errors.vehicleNumber}
              helperText={errors.vehicleNumber?.message}
              {...register('vehicleNumber', { required: 'Vehicle number is required' })}
            />
            <TextField
              id="form-vehicle-type"
              fullWidth
              select
              label="Vehicle Category"
              defaultValue="CAR"
              error={!!errors.vehicleType}
              helperText={errors.vehicleType?.message}
              {...register('vehicleType', { required: 'Vehicle category is required' })}
            >
              {VehicleTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getVehicleTypeIcon(type)}
                    <span>{type}</span>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="form-owner-name"
              fullWidth
              label="Owner Full Name"
              placeholder="e.g. Ramesh Kumar"
              error={!!errors.ownerName}
              helperText={errors.ownerName?.message}
              {...register('ownerName', { required: 'Owner name is required' })}
            />
            <TextField
              id="form-owner-mobile"
              fullWidth
              label="Owner Mobile Number"
              placeholder="e.g. 9876543210"
              error={!!errors.ownerMobile}
              helperText={errors.ownerMobile?.message}
              {...register('ownerMobile', {
                required: 'Owner mobile is required',
                pattern: { value: /^[0-9]{10}$/, message: 'Mobile number must be exactly 10 digits' },
              })}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>
              Cancel
            </Button>
            <Button id="save-vehicle-btn" type="submit" variant="contained" color="primary" disabled={loading} sx={{ fontWeight: 700, px: 3 }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : editMode ? 'Save Changes' : 'Register Vehicle'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? This will permanently remove its registration profile from ParkMitra."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </PageContainer>
  );
};

export default Vehicles;
