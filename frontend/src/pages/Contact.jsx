import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import contactService from '../services/contactService';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  TextField,
  Stack,
  CircularProgress,
  Chip,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await contactService.submitContact(data);
      toast.success('Your message has been received! The ParkMitra team will respond shortly.');
      reset();
    } catch (err) {
      console.error('Contact submit error:', err);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="page-enter" sx={{ py: { xs: 8, md: 11 }, background: 'radial-gradient(circle at 10% 20%, rgba(20, 184, 166, 0.07) 0%, transparent 40%)' }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 7, md: 9 } }}>
          <Chip
            icon={<SupportAgentIcon sx={{ fontSize: '15px !important', color: '#0d9488 !important' }} />}
            label="ParkMitra Support"
            size="small"
            sx={{
              fontWeight: 800,
              bgcolor: 'rgba(13, 148, 136, 0.08)',
              color: 'secondary.main',
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
            Get In Touch
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 620, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.65 }}>
            Have questions regarding ParkMitra parking terminals, commercial fleet enrollments, or custom integrations? We're here to help.
          </Typography>
        </Box>

        <Grid container spacing={5} alignItems="stretch">
          {/* Support Information Card */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              <Card sx={{ border: '1px solid #e2e8f0', borderRadius: 4, flexGrow: 1 }}>
                <CardContent sx={{ p: { xs: 3.5, sm: 4.5 } }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, color: 'text.primary' }}>
                    Connect Directly
                  </Typography>

                  <Stack spacing={3.5}>
                    <Box sx={{ display: 'flex', gap: 2.5 }}>
                      <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'rgba(79, 70, 229, 0.1)', color: 'primary.main', height: 'fit-content', display: 'flex' }}>
                        <EmailIcon />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Email Support
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mt: 0.5 }}>
                          support@parkmitra.com
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
                          Response window: 12-24 Hours
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2.5 }}>
                      <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'rgba(13, 148, 136, 0.1)', color: 'secondary.main', height: 'fit-content', display: 'flex' }}>
                        <PhoneIcon />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Helpline
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mt: 0.5 }}>
                          +91 98765 43210
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
                          Mon-Fri: 9:00 AM to 6:00 PM IST
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2.5 }}>
                      <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', height: 'fit-content', display: 'flex' }}>
                        <LocationOnIcon />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Innovation Center
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mt: 0.5, lineHeight: 1.6 }}>
                          ParkMitra Innovation Labs, Floor 4 <br />
                          Tech Park Plaza, Pune, Maharashtra 411001
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Validated Request Form Card */}
          <Grid item xs={12} md={7}>
            <Card sx={{ border: '1px solid #e2e8f0', borderRadius: 4, height: '100%' }}>
              <CardContent sx={{ p: { xs: 3.5, sm: 4.5 } }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  Submit Inquiry
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3.5 }}>
                  Drop our engineering support operations a quick message.
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate id="contact-form">
                  <Stack spacing={2.5}>
                    <TextField
                      fullWidth
                      id="contact-name"
                      label="Full Name"
                      placeholder="e.g. Ramesh Kumar"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      {...register('name', { required: 'Name is required' })}
                    />

                    <TextField
                      fullWidth
                      id="contact-email"
                      label="Email Address"
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      error={!!errors.email}
                      helperText={errors.email?.message}
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
                      id="contact-subject"
                      label="Subject"
                      placeholder="e.g. ParkMitra Smart Slot API Inquiry"
                      error={!!errors.subject}
                      helperText={errors.subject?.message}
                      {...register('subject', { required: 'Subject is required' })}
                    />

                    <TextField
                      fullWidth
                      id="contact-message"
                      label="Message Details"
                      placeholder="Please elaborate on your questions or system feedback..."
                      multiline
                      rows={4}
                      error={!!errors.message}
                      helperText={errors.message?.message}
                      {...register('message', {
                        required: 'Message is required',
                        minLength: { value: 10, message: 'Message must be at least 10 characters' },
                      })}
                    />

                    <Button
                      id="contact-submit"
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                      endIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                      sx={{
                        py: 1.5,
                        fontWeight: 800,
                        fontSize: '0.95rem',
                      }}
                    >
                      {submitting ? 'Submitting...' : 'Send Message'}
                    </Button>
                  </Stack>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
