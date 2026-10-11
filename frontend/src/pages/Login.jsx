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
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import SparklesIcon from '@mui/icons-material/AutoAwesome';
import ParkMitraLogo from '../components/ParkMitraLogo';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleQuickFill = (email, pwd) => {
    setValue('email', email);
    setValue('password', pwd);
    toast.info(`Filled credentials for ${email}`);
  };

  const onLogin = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password);
    setLoading(false);
    
    if (result.success) {
      toast.success('Logged in to ParkMitra successfully!');
      const targetPath = result.user.role === 'ADMIN' ? '/dashboard' : '/vehicles';
      navigate(targetPath, { replace: true });
    } else {
      toast.error(result.error || 'Invalid credentials');
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
          maxWidth: 440,
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
          <Box sx={{ mb: 2.5, display: 'inline-flex' }}>
            <ParkMitraLogo size="large" showTagline />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.75, letterSpacing: '-0.025em' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Sign in to access your ParkMitra parking console
          </Typography>
        </Box>

        <CardContent sx={{ p: { xs: 3.5, sm: 4.5 }, pt: 1.5 }}>
          {/* Demo Credentials Quick Fill Bar */}
          <Box
            sx={{
              p: 1.5,
              mb: 3,
              borderRadius: 2.5,
              bgcolor: 'rgba(79, 70, 229, 0.05)',
              border: '1px solid rgba(79, 70, 229, 0.12)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
              <SparklesIcon sx={{ fontSize: 14, color: 'primary.main' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.7rem' }}>
                Quick Demo Fill:
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip
                label="Admin: admin@parkmitra.com"
                size="small"
                onClick={() => handleQuickFill('admin@parkmitra.com', 'Password@123')}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.675rem',
                  cursor: 'pointer',
                  bgcolor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.08)', borderColor: 'primary.main' },
                }}
              />
              <Chip
                label="Driver: user@parkmitra.com"
                size="small"
                onClick={() => handleQuickFill('user@parkmitra.com', 'Password@123')}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.675rem',
                  cursor: 'pointer',
                  bgcolor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  '&:hover': { bgcolor: 'rgba(13, 148, 136, 0.08)', borderColor: 'secondary.main' },
                }}
              />
            </Stack>
          </Box>

          <form onSubmit={handleSubmit(onLogin)} noValidate id="login-form">
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                id="login-email"
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
                id="login-password"
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
                        <IconButton onClick={handleTogglePassword} edge="end" size="small">
                          {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                {...register('password', {
                  required: 'Password is required',
                })}
              />

              <Button
                id="login-submit"
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
                  boxShadow: '0 8px 20px -5px rgba(79, 70, 229, 0.4)',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In to ParkMitra'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 3.5, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>
                Register here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
