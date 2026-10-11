import React from 'react';
import { Box, Typography } from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

const ParkMitraLogo = ({
  variant = 'dark', // 'dark' (for white background) or 'light' (for dark background)
  size = 'medium',  // 'small', 'medium', 'large'
  showTagline = false,
  sx = {},
}) => {
  const isLight = variant === 'light';

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 26,
  };

  const badgePaddings = {
    small: 0.5,
    medium: 0.75,
    large: 1,
  };

  const textVariants = {
    small: { fontSize: '1rem', letterSpacing: '-0.02em' },
    medium: { fontSize: '1.25rem', letterSpacing: '-0.03em' },
    large: { fontSize: '1.65rem', letterSpacing: '-0.03em' },
  };

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, userSelect: 'none', ...sx }}>
      {/* Icon Badge */}
      <Box
        sx={{
          p: badgePaddings[size],
          borderRadius: size === 'large' ? 2 : 1.5,
          background: 'linear-gradient(135deg, #4f46e5 0%, #0d9488 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isLight
            ? '0 4px 12px rgba(79, 70, 229, 0.4)'
            : '0 2px 8px rgba(79, 70, 229, 0.25)',
          flexShrink: 0,
        }}
      >
        <LocalParkingIcon
          sx={{
            fontSize: iconSizes[size],
            color: '#ffffff',
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))',
          }}
        />
      </Box>

      {/* Brand Text */}
      <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <Typography
          component="span"
          sx={{
            fontWeight: 900,
            color: isLight ? '#ffffff' : '#0f172a',
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            lineHeight: 1.1,
            ...textVariants[size],
          }}
        >
          Park
          <Typography
            component="span"
            sx={{
              fontWeight: 900,
              color: isLight ? '#2dd4bf' : '#0d9488',
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontSize: 'inherit',
              letterSpacing: 'inherit',
            }}
          >
            Mitra
          </Typography>
        </Typography>

        {showTagline && (
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: isLight ? '#94a3b8' : '#64748b',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              mt: 0.25,
            }}
          >
            Smart Parking Companion
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ParkMitraLogo;
