
import PropTypes from 'prop-types';
import BlockImage from 'react-block-image';
// material
import { styled } from '@material-ui/core/styles';
import { Box, CircularProgress } from '@material-ui/core';


// ----------------------------------------------------------------------

// const THUMB_SIZE = 64;

const RootStyle = styled('div')(({ theme }) => ({
  '& .slick-slide': {
    float: theme.direction === 'rtl' ? 'right' : 'left',
    '&:focus': { outline: 'none' }
  },
}));


// ----------------------------------------------------------------------

LargeItem.propTypes = {
  item: PropTypes.string,
};

function LargeItem({ item }) {
  return (
    <Box sx={{ paddingTop: '100%', position: 'relative' }}>
      <BlockImage
            style={{
              top: 0,
              maxHeight: 625,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
            }}
            src={item}
            showPreview
            loader={
              <center style={{marginTop: '45%'}}>
                <CircularProgress/>
              </center>
          }
          />
    </Box>
  );
}

ProductDetailsCarousel.propTypes = {
  image: PropTypes.string.isRequired
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
