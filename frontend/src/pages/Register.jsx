import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import ParkMitraLogo from '../components/ParkMitraLogo';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      role: 'USER',
    },
  });

  const watchPassword = watch('password');

  const onRegister = async (data) => {
    setLoading(true);
    const result = await registerUser(
      data.fullName,
      data.email,
      data.password,
      data.confirmPassword,
      data.role
    );
    setLoading(false);

    if (result.success) {
      toast.success('Registration successful! Please sign in with your credentials.');
      reset();
      navigate('/login');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 10% 20%, rgba(79, 70, 229, 0.16) 0%, rgba(13, 148, 136, 0.12) 60%), #0a0f1d',
        p: 2.5,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '540px',
          height: '540px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.18) 0%, rgba(0,0,0,0) 70%)',
          top: '-180px',
          left: '-180px',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '620px',
          height: '620px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.14) 0%, rgba(0,0,0,0) 70%)',
          bottom: '-220px',
          right: '-220px',
        },
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 480,
          borderRadius: 4.5,
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ p: { xs: 3.5, sm: 4.5 }, pb: 1, textAlign: 'center' }}>
          <Box sx={{ mb: 2, display: 'inline-flex' }}>
            <ParkMitraLogo size="large" showTagline />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.75, letterSpacing: '-0.025em' }}>
            Create Account
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Join the ParkMitra smart parking network
          </Typography>
        </Box>

        <CardContent sx={{ p: { xs: 3.5, sm: 4.5 }, pt: 1.5 }}>
          <form onSubmit={handleSubmit(onRegister)} noValidate id="register-form">
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                id="register-fullname"
                label="Full Name"
                type="text"
                variant="outlined"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" sx={{ fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                {...register('fullName', {
                  required: 'Full name is required',
                })}
              />

              <TextField
                fullWidth
                id="register-email"
                label="Email Address"
                type="email"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" sx={{ fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />

              <TextField
                fullWidth
                id="register-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" sx={{ fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 4,
                    message: 'Password must be at least 4 characters',
                  },
                })}
              />

              <TextField
                fullWidth
                id="register-confirm-password"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" sx={{ fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                          {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => {
                    if (val !== watchPassword) {
                      return 'Passwords do not match';
                    }
                  },
                })}
              />

              <FormControl fullWidth error={!!errors.role}>
                <InputLabel id="role-select-label">Account Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="register-role"
                  label="Account Role"
                  defaultValue="USER"
                  {...register('role', { required: 'Role is required' })}
                >
                  <MenuItem value="USER">User (Standard Vehicle Management)</MenuItem>
                  <MenuItem value="ADMIN">Administrator (Full Lot & Tariff Control)</MenuItem>
                </Select>
              </FormControl>

              <Button
                id="register-submit"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.6,
                  mt: 1,
                  fontSize: '0.975rem',
                  fontWeight: 800,
                  boxShadow: '0 8px 20px -5px rgba(13, 148, 136, 0.4)',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create ParkMitra Account'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Already registered?{' '}
              <Link to="/login" style={{ color: '#0d9488', fontWeight: 700, textDecoration: 'none' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
