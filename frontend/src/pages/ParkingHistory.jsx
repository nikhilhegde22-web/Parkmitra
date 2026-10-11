import React, { useState, useEffect } from 'react';
import parkingService from '../services/parkingService';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Chip,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  CircularProgress,
  TablePagination,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import LoadingSpinner from '../components/LoadingSpinner';
import { PageContainer, PageHeader, SearchToolbar, DataTable } from '../components/layout';

const ParkingHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await parkingService.getAllRecords();
      const sorted = data.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime));
      setRecords(sorted);
    } catch (error) {
      console.error('Error fetching parking history:', error);
      toast.error('Failed to load parking logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadHistory();
      return;
    }
    setLoading(true);
    try {
      const data = await parkingService.getHistoryByVehicleNumber(searchQuery.trim());
      const sorted = data.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime));
      setRecords(sorted);
    } catch (error) {
      console.error('Error searching history:', error);
      setRecords([]);
      toast.info('No parking history found for this vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadHistory();
  };

  const handleDownloadReceipt = async (recordId) => {
    setDownloadingId(recordId);
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
      toast.success('Receipt PDF downloaded!');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleExportCSV = async () => {
    setExportingCSV(true);
    try {
      const blob = await parkingService.exportCSV();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ParkMitra_Audit_Records_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('ParkMitra CSV audit report exported!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV report');
    } finally {
      setExportingCSV(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Parking Audit Logs"
        subtitle="Historical parking sessions, duration timestamps, and digital PDF invoices"
        actions={
          <Button
            id="export-csv-btn"
            variant="contained"
            color="secondary"
            onClick={handleExportCSV}
            disabled={exportingCSV || records.length === 0}
            startIcon={exportingCSV ? <CircularProgress size={18} color="inherit" /> : <FileDownloadIcon />}
            sx={{ px: 2.5, py: 1, fontWeight: 700 }}
          >
            Export CSV Report
          </Button>
        }
      />

      <SearchToolbar>
        <TextField
          id="search-history-input"
          size="small"
          placeholder="Search by license plate (e.g. MH12AB1234)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ flex: 1, minWidth: { xs: '100%', sm: 300 } }}
          slotProps={{
            input: {
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
            },
          }}
        />
        <Button id="search-history-btn" variant="contained" color="primary" onClick={handleSearch} sx={{ px: 3, fontWeight: 700 }}>
          Filter
        </Button>
      </SearchToolbar>

      <DataTable>
        {loading && records.length === 0 ? (
          <LoadingSpinner message="Retrieving ParkMitra audit database..." />
        ) : records.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              No parking records found matching the search filter
            </Typography>
          </Box>
        ) : (
          <>
            <Table id="history-table" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Record #</TableCell>
                  <TableCell>Vehicle Plate</TableCell>
                  <TableCell>Allocated Bay</TableCell>
                  <TableCell>Entry Timestamp</TableCell>
                  <TableCell>Exit Timestamp</TableCell>
                  <TableCell>Fee (INR)</TableCell>
                  <TableCell align="center">Tax Invoice</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((record) => {
                    const isParked = record.exitTime === null;
                    return (
                      <TableRow key={record.id} hover>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>
                          #{record.id}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <span className="license-plate" style={{ fontSize: '0.78rem' }}>
                              {record.vehicle?.vehicleNumber}
                            </span>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                              {record.vehicle?.ownerName} • {record.vehicle?.vehicleType}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<LocalParkingIcon sx={{ fontSize: '14px !important' }} />}
                            label={`Bay ${record.parkingSlot?.slotNumber}`}
                            size="small"
                            sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#1e293b' }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap', fontWeight: 500 }}>
                          {formatDate(record.entryTime)}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.85rem' }}>
                          {isParked ? (
                            <Chip
                              icon={<span className="live-pulse" style={{ marginRight: 6 }} />}
                              label="Active Session"
                              size="small"
                              sx={{
                                fontWeight: 700,
                                height: 24,
                                fontSize: '0.72rem',
                                bgcolor: 'rgba(245, 158, 11, 0.1)',
                                color: '#b45309',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                              }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                              {formatDate(record.exitTime)}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {isParked ? (
                            <Typography variant="body2" sx={{ color: '#d97706', fontStyle: 'italic', fontWeight: 600, fontSize: '0.85rem' }}>
                              Meter Running...
                            </Typography>
                          ) : (
                            <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main', fontSize: '0.9rem' }}>
                              ₹{record.parkingFee?.toFixed(2)}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={isParked ? 'Session in progress' : 'Download Verified PDF Invoice'} arrow>
                            <span>
                              <IconButton
                                id={`download-receipt-${record.id}`}
                                size="small"
                                color="primary"
                                onClick={() => handleDownloadReceipt(record.id)}
                                disabled={isParked || downloadingId === record.id}
                                sx={{
                                  border: '1px solid #e2e8f0',
                                  borderRadius: 1.5,
                                  bgcolor: '#ffffff',
                                  '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.08)' },
                                }}
                              >
                                {downloadingId === record.id ? (
                                  <CircularProgress size={18} color="inherit" />
                                ) : (
                                  <DownloadIcon fontSize="small" />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={records.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ borderTop: '1px solid #e2e8f0' }}
            />
          </>
        )}
      </DataTable>
    </PageContainer>
  );
};

export default ParkingHistory;
