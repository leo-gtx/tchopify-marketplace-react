import PropTypes from 'prop-types';
// material
import { Box, styled } from '@material-ui/core';

// ----------------------------------------------------------------------

LogoFull.propTypes = {
  sx: PropTypes.object
};

const ImgLogoFull = styled('img')(() => ({
  objectFit: 'cover',
  height: 90,
  width: 180
}));

export default function LogoFull({ sx }) {
  return (
    <Box sx={{ ...sx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <ImgLogoFull alt='logo' src='/static/brand/logo_full.svg' />
    </Box>
  );
}
