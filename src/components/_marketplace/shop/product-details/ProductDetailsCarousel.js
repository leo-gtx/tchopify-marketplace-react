
import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';


// ----------------------------------------------------------------------

const THUMB_SIZE = 64;

const RootStyle = styled('div')(({ theme }) => ({
  '& .slick-slide': {
    float: theme.direction === 'rtl' ? 'right' : 'left',
    '&:focus': { outline: 'none' }
  },
}));

const LargeImgStyle = styled('img')({
  top: 0,
  maxHeight: 625,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});


// ----------------------------------------------------------------------

LargeItem.propTypes = {
  item: PropTypes.string,
  onOpenLightbox: PropTypes.func
};

function LargeItem({ item }) {
  return (
    <Box sx={{ paddingTop: '100%', position: 'relative' }}>
      <LargeImgStyle alt="large image" src={item} />
    </Box>
  );
}


export default function ProductDetailsCarousel({image}) {

  return (
    <RootStyle>

      <Box
        sx={{
          maxHeight: 625,
          my: 0,
          mx: 'auto',
          '& .slick-current .isActive': { opacity: 1 },
        }}
      >
            <LargeItem item={image} />
      </Box>

    </RootStyle>
  );
}
