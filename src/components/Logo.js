import PropTypes from 'prop-types';
// material
import { Box, styled } from '@material-ui/core';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

const ImgLogo = styled('img')(({ theme }) => ({
  objectFit: 'cover',
  height: 70,
  width: 'auto'
}));

export default function Logo({ sx }) {

  return (
    <Box sx={{ ...sx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ImgLogo alt='logo' src='/static/brand/logo_single.svg' />
    </Box>
  );
}
